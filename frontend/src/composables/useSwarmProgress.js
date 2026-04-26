import { ref, onBeforeUnmount } from 'vue'
import { fetchWarmupStatus } from '../api/index.js'

/**
 * useSwarmProgress — polls /demo/warmup-status every `intervalMs` ms while a
 * clip's warmup is in flight. Stops as soon as the swarm is fully done OR
 * warmup reports `ready: true`. Caller calls start(clipId) when the clip is
 * known and stop() to tear down explicitly.
 *
 * Exposed reactive state:
 *   swarmReadings — { network: { state, text, confidence, completed_at } }
 *   active        — true once at least one poll has come back
 *   warmupReady   — mirror of warmup-status.ready
 */
export function useSwarmProgress(intervalMs = 500) {
  const swarmReadings = ref({})
  const active = ref(false)
  const warmupReady = ref(false)

  let timer = null
  let stopped = false

  const NETWORKS_LEN = 7

  async function pollOnce(clipId) {
    try {
      const res = await fetchWarmupStatus(clipId)
      active.value = true
      warmupReady.value = !!res?.ready
      const progress = res?.swarm_readings_progress
      // Real-data-only: never invent done states. Empty dict is fine.
      swarmReadings.value = progress && typeof progress === 'object' ? progress : {}
      const doneCount = Object.values(swarmReadings.value).filter(
        v => v?.state === 'done',
      ).length
      return doneCount >= NETWORKS_LEN || warmupReady.value
    } catch (err) {
      // Soft-fail: keep polling. The panel will stay in "thinking" state.
      // eslint-disable-next-line no-console
      console.warn('[useSwarmProgress] poll failed:', err)
      return false
    }
  }

  function start(clipId) {
    if (!clipId || timer) return
    stopped = false
    const tick = async () => {
      if (stopped) return
      const done = await pollOnce(clipId)
      if (done || stopped) {
        stop()
        return
      }
      timer = setTimeout(tick, intervalMs)
    }
    tick()
  }

  function stop() {
    stopped = true
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  onBeforeUnmount(stop)

  return {
    swarmReadings,
    active,
    warmupReady,
    start,
    stop,
  }
}
