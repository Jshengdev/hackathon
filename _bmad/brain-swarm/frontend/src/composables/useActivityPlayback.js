import { computed, watch, ref } from 'vue'

/**
 * useActivityPlayback — drive brain visuals from an activity.json + a time ref.
 *
 * Inputs:
 *   activityData — ref(activity.json) where frames is [{t_s, regions, top_region, stimulus?}]
 *   timeRef      — ref(seconds, fractional) e.g. video.currentTime
 *   meshNetworks — ref(brain mesh network metadata: { name → { vertex_indices, centroid } })
 *
 * Outputs:
 *   currentFrame — ref(frame at floor(time) % nFrames), null until ready
 *   regionLevels — ref({ name → 0..1 normalized activation }) for current frame
 *   topRegion    — ref(string) — most active network
 *   stimulus     — ref(string|null) — most recent stimulus text seen
 *   vertexActivations — function(): Float32Array length n_vertices, computed lazily
 *
 * The composable is *frontend-only* — no fetches, no WebSocket. Caller fetches
 * activity.json + mesh once, and updates timeRef every animation frame.
 */
export function useActivityPlayback(activityData, timeRef, meshNetworks) {
  const currentFrame = ref(null)
  const regionLevels = ref({})
  const topRegion = ref('')
  const stimulus = ref(null)
  const lastFrameIdx = ref(-1)

  // Cache: precomputed Float32Array of vertex activations, rebuilt lazily.
  let _vertexBuf = null
  let _vertexBufStaleAt = -1

  function frameAt(t) {
    const data = activityData.value
    if (!data?.frames?.length) return null
    const fps = data.fps || 1
    const nFrames = data.frames.length
    // floor(t * fps), then modulo for looping
    const idx = Math.floor(t * fps)
    return { idx: ((idx % nFrames) + nFrames) % nFrames, nFrames }
  }

  function recompute() {
    const data = activityData.value
    if (!data?.frames?.length) return
    const t = timeRef.value || 0
    const { idx } = frameAt(t)
    if (idx === lastFrameIdx.value) return

    lastFrameIdx.value = idx
    const f = data.frames[idx]
    currentFrame.value = f
    regionLevels.value = f.regions || {}
    topRegion.value = f.top_region || ''
    if (f.stimulus) stimulus.value = f.stimulus
    _vertexBufStaleAt = idx
    _vertexBuf = null
  }

  /**
   * Compute (or return cached) vertex-activation buffer for current frame.
   * Each vertex inherits its network's activation level. Vertices not assigned
   * to any of the 7 networks are left at 0.
   *
   * Caller passes nVertices because mesh data is owned outside this composable.
   */
  function getVertexActivations(nVertices) {
    if (_vertexBuf && _vertexBuf.length === nVertices) return _vertexBuf
    const networks = meshNetworks?.value
    const levels = regionLevels.value
    const buf = new Float32Array(nVertices)
    if (networks) {
      for (const [name, meta] of Object.entries(networks)) {
        const lvl = levels[name] ?? 0
        const indices = meta.vertex_indices
        if (!indices) continue
        for (let i = 0; i < indices.length; i++) {
          buf[indices[i]] = lvl
        }
      }
    }
    _vertexBuf = buf
    return buf
  }

  // Watch time ref so consumers don't have to call recompute() manually.
  watch(timeRef, recompute, { immediate: true })
  watch(activityData, () => {
    lastFrameIdx.value = -1
    recompute()
  }, { immediate: true })

  return {
    currentFrame,
    regionLevels,
    topRegion,
    stimulus,
    getVertexActivations,
    recompute,
  }
}
