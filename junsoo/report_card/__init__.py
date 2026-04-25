"""Ironside per-action report card pipeline.

Pipeline:
    per_action_activations.json (from Person A's aggregate_per_action.py)
        -> run_specialists.py: 8 K2 specialist calls per action
        -> synthesize.py: instruct-model JSON synthesis per action
        -> ironside_report.json (validated schema)

Entry point: run_report_card.py
"""
