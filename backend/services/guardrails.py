"""Forbidden-claim regex pre-flight (PRD §5).

Screens empathy paragraphs / voiceovers / Devpost copy before render. Any
hit fails the check and surfaces the violation tags so the synthesizer can
re-fire under STRICT MODE.
"""
from __future__ import annotations

import re


_FORBIDDEN_PATTERNS = (
    (re.compile(r"\bshe felt\b", re.I), "reverse-inference: 'she felt'"),
    (re.compile(r"\bhe felt\b", re.I), "reverse-inference: 'he felt'"),
    (re.compile(r"\bhe was thinking\b", re.I), "reverse-inference: 'thinking'"),
    (re.compile(r"\bshe was thinking\b", re.I), "reverse-inference: 'thinking'"),
    (re.compile(r"\bclinical\b", re.I), "clinical-claim"),
    (re.compile(r"\bdiagnos(is|ed|tic)\b", re.I), "clinical-claim: diagnosis"),
    (re.compile(r"\baverage (healthy )?brain\b", re.I), "population-norm comparison"),
    (re.compile(r"\bnormal brain\b", re.I), "population-norm comparison"),
    (re.compile(r"reads (the )?inner monologue\b", re.I), "reverse-inference framing"),
    (re.compile(r"\b(70|70,000) ?(k|thousand)? voxels?\b", re.I), "inflated TRIBE numbers"),
    (re.compile(r"\b700 subjects?\b", re.I), "inflated TRIBE numbers"),
)


def pass_guardrail_pre_flight(text: str) -> tuple[bool, list[str]]:
    if not text:
        return True, []
    violations: list[str] = []
    for pattern, tag in _FORBIDDEN_PATTERNS:
        if pattern.search(text):
            violations.append(tag)
    return (len(violations) == 0), violations
