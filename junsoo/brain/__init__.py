"""Brain-encoding module for the Empathy Layer engine.

Wraps Meta's TRIBE V2 in both directions:

* forward (text -> brain pattern) via `predict_brain_from_text`
* reverse (video -> brain pattern) via `encode_video`

Both honor `MOCK_FORWARD=1` for GPU-free testing.
"""
from .forward import predict_brain_from_text
from .reverse import encode_video
from .schema import BrainFrame, BrainPattern, PredictedBrainPattern, RegionActivation

__all__ = [
    "BrainFrame",
    "BrainPattern",
    "PredictedBrainPattern",
    "RegionActivation",
    "encode_video",
    "predict_brain_from_text",
]
