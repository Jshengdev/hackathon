# Junsoo lane — Ironside report-card pipeline shortcuts.
# Run from anywhere inside the repo: `make -C junsoo test`, or `cd junsoo && make test`.

PYTHON ?= python3
REPO_ROOT := $(shell git rev-parse --show-toplevel)

.PHONY: help test test-offline test-ping run-fixture clean

help:
	@echo "Targets:"
	@echo "  test          run offline smoke + live K2/Instruct ping"
	@echo "  test-offline  schema/fixture checks, no network (always safe)"
	@echo "  test-ping     single specialist + synth call — verifies API keys"
	@echo "  run-fixture   end-to-end: full pipeline against the example fixture"
	@echo "  clean         remove __pycache__"

test: test-offline test-ping

test-offline:
	@echo "==> Offline smoke (no network)"
	@cd $(REPO_ROOT) && $(PYTHON) -m junsoo.report_card.smoke_test_offline

test-ping:
	@echo "==> Live K2 + Instruct ping (needs K2_API_KEY)"
	@cd $(REPO_ROOT) && $(PYTHON) -m junsoo.report_card.test_live_ping

run-fixture:
	@echo "==> Full pipeline on example fixture (8 K2 calls + 3 synth calls)"
	@cd $(REPO_ROOT) && $(PYTHON) -m junsoo.report_card.run_report_card \
		--activations junsoo/report_card/fixtures/example_per_action_activations.json \
		--out         junsoo/report_card/fixtures/example_ironside_report.json \
		--video-stem  example_fixture

clean:
	@find $(CURDIR) -type d -name __pycache__ -exec rm -rf {} +
	@echo "Removed __pycache__"
