"""Forbidden-claim guardrails — pure-Python regex pre-flight.

Implements the §5 forbidden-claim categories from the Empathy Layer
technical PRD. Every Stage 2 (Opus) paragraph, every voiceover line, every
Devpost copy paragraph, every sponsor swap-slide MUST be screened through
``check_paragraph_for_forbidden_claims`` before it reaches a human surface.

The eight categories enforced (technical PRD §5 + architecture §6):

1. Reverse inference — ``she felt grief`` / ``he thought``. Invalid per
   Poldrack 2006: brain-region activation cannot be back-inferred to a
   specific subjective feeling.
2. Clinical claims — ``clinical fatigue``, ``diagnosis``, ``disorder``,
   ``symptom*``. TRIBE V2 license + framing forbid clinical use.
3. Sub-second predictions — ``millisecond``, ``sub-second``. TRIBE is 1 Hz
   with a 5-second HRF lag (structural floor).
4. Population-norm comparison — ``average healthy brain``, ``normal range``.
   Within-subject contrast only; we do not have the population baseline.
5. Inflated TRIBE numbers — ``70,000`` / ``70K voxels`` / ``700 subjects``.
   Canonical numbers are ~20K vertices on fsaverage5 + ~25 subjects.
6. ``inner monologue`` framing — reverse-inference variant in disguise.
7. First-person mental-state attribution — ``he was thinking`` /
   ``she was feeling`` / ``they believed``. Folded into the reverse-
   inference pattern below.
8. Diagnostic verbs — ``suffering from``, ``exhibits with``,
   ``presents as``.

Usage::

    from caltech.engine.guardrails import check_paragraph_for_forbidden_claims

    passed, reason = check_paragraph_for_forbidden_claims(opus_output)
    if not passed:
        log.warning("guardrail tripped: %s", reason)
        # auto-retry with stricter prompt, OR fall back to pre-cached paragraph

The list ``FORBIDDEN_PATTERNS`` is exported so other modules (Stage 2
prompt builder, observability dashboard, smoke-gate harness) can introspect
exactly which patterns the engine is enforcing.
"""

from __future__ import annotations

import re
from typing import Final


# Each tuple is (compiled regex, human-readable category label).
# Order matters only for "first match wins" reporting — we report whichever
# forbidden phrase appears earliest in the paragraph (lowest char offset).
FORBIDDEN_PATTERNS: Final[list[tuple[re.Pattern[str], str]]] = [
    # 1 + 7. Reverse inference / first-person mental-state attribution.
    #   Matches: "she felt", "he was feeling", "they thought",
    #            "she was thinking", "he believed".
    (
        re.compile(
            r"\b(she|he|they)\s+(felt|was\s+feeling|thought|was\s+thinking|believed)\b",
            re.IGNORECASE,
        ),
        "reverse inference",
    ),
    # 2. Clinical claims — clinical / diagnos* / disorder* / symptom*.
    #   The trailing \w* lets us match diagnosis, diagnosed, diagnostic,
    #   disorders, symptomatic, etc. without listing each variant.
    (
        re.compile(r"\b(clinical|diagnos|disorder|symptom)\w*", re.IGNORECASE),
        "clinical claim",
    ),
    # 4. Population-norm comparison — "average healthy brain",
    #   "normal response", "typical brain", etc.
    (
        re.compile(
            r"\b(average|normal|typical)\s+(brain|response|healthy)\b",
            re.IGNORECASE,
        ),
        "population-norm comparison",
    ),
    # 3 + 5. Inflated TRIBE numbers + sub-second predictions, fused into
    #   one pattern because they share a "things TRIBE V2 cannot do or is
    #   not" motif. Catches "70,000", "70.000", "70000", "700 subjects",
    #   "millisecond(s)", "sub-second", "sub second".
    (
        re.compile(
            r"\b(70[,.]?000|700\s+subjects|millisecond|sub[\-\s]second)\w*",
            re.IGNORECASE,
        ),
        "inflated TRIBE numbers / sub-second prediction",
    ),
    # 6. Reverse-inference variant: "inner monologue / voice / narrative".
    (
        re.compile(r"\binner\s+(monologue|voice|narrative)\b", re.IGNORECASE),
        "reverse inference (inner monologue framing)",
    ),
    # 8. Diagnostic verbs — "suffering from", "exhibits with",
    #   "presents as".
    (
        re.compile(
            r"\b(suffering|exhibits|presents)\s+(from|with|as)\b",
            re.IGNORECASE,
        ),
        "diagnostic verb",
    ),
]


def check_paragraph_for_forbidden_claims(text: str) -> tuple[bool, str]:
    """Screen ``text`` for any forbidden-claim phrase.

    Returns ``(passed, reason)``. ``passed`` is ``True`` iff none of the
    patterns in :data:`FORBIDDEN_PATTERNS` match anywhere in ``text``.

    When a violation is found, ``reason`` is a short string of the form::

        "<category>: '<matched phrase>' at char <offset>"

    suitable for logging and observability. We report the *earliest* match
    (lowest char offset) so the violation message points at the first
    failure the reader will see.
    """
    if not text:
        return True, "empty input"

    earliest: tuple[int, str, str] | None = None  # (offset, category, phrase)

    for pattern, label in FORBIDDEN_PATTERNS:
        match = pattern.search(text)
        if match is None:
            continue
        offset = match.start()
        if earliest is None or offset < earliest[0]:
            earliest = (offset, label, match.group(0))

    if earliest is None:
        return True, "passed"

    offset, label, phrase = earliest
    return False, f"{label}: '{phrase}' at char {offset}"


__all__ = ["FORBIDDEN_PATTERNS", "check_paragraph_for_forbidden_claims"]
