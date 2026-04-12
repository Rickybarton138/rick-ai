"""
Minimal Apify Actor Run client for the video agent.

Same pattern as astra-removals/app/apify_client.py. Kept standalone here so
video-agent can be run independently.
"""

import logging
import os
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)

APIFY_BASE = "https://api.apify.com/v2"
TERMINAL_STATUSES = {"SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"}


class ApifyError(RuntimeError):
    """Raised when an Apify API call fails or a run ends in a non-success state."""


def _token() -> str:
    token = os.environ.get("APIFY_TOKEN")
    if not token:
        raise ApifyError("APIFY_TOKEN not set in environment")
    return token


def start_run(actor_id: str, input_payload: dict[str, Any]) -> dict[str, str]:
    """Start an actor run. Returns {run_id, dataset_id}."""
    res = requests.post(
        f"{APIFY_BASE}/acts/{actor_id}/runs",
        params={"token": _token()},
        json=input_payload,
        timeout=30,
    )
    if res.status_code >= 300:
        raise ApifyError(f"Run start failed {res.status_code}: {res.text[:500]}")
    data = res.json().get("data", {})
    run_id = data.get("id")
    if not run_id:
        raise ApifyError(f"No run id in response: {data}")
    logger.info("Started Apify run %s for actor %s", run_id, actor_id)
    return {"run_id": run_id, "dataset_id": data.get("defaultDatasetId")}


def get_run(run_id: str) -> dict[str, Any]:
    res = requests.get(
        f"{APIFY_BASE}/actor-runs/{run_id}",
        params={"token": _token()},
        timeout=30,
    )
    if res.status_code >= 300:
        raise ApifyError(f"Run status check failed {res.status_code}: {res.text[:500]}")
    return res.json().get("data", {})


def poll_run(run_id: str, max_wait_seconds: int = 1200, poll_interval: int = 10) -> dict[str, Any]:
    """Poll until the run reaches a terminal state. Video generation can take a while."""
    elapsed = 0
    while elapsed < max_wait_seconds:
        run = get_run(run_id)
        status = run.get("status", "UNKNOWN")
        if status in TERMINAL_STATUSES:
            if status != "SUCCEEDED":
                raise ApifyError(f"Run {run_id} ended with status {status}")
            return run
        logger.info("Run %s status=%s (%ds elapsed)", run_id, status, elapsed)
        time.sleep(poll_interval)
        elapsed += poll_interval
    raise ApifyError(f"Run {run_id} did not reach terminal state in {max_wait_seconds}s")


def get_dataset_items(dataset_id: str) -> list[dict[str, Any]]:
    res = requests.get(
        f"{APIFY_BASE}/datasets/{dataset_id}/items",
        params={"token": _token(), "clean": "true"},
        timeout=60,
    )
    if res.status_code >= 300:
        raise ApifyError(f"Dataset fetch failed {res.status_code}: {res.text[:500]}")
    return res.json() if res.content else []
