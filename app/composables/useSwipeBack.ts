import type { Ref } from 'vue'

/** Go to the previous page, or to `fallback` when the app was opened on this page. */
export function useGoBack(fallback = '/') {
  const router = useRouter()
  return () => {
    if (window.history.state?.back) router.back()
    else navigateTo(fallback, { replace: true })
  }
}

/**
 * Swipe right anywhere on `el` to go back, like a native iOS app. The page follows
 * the finger and either slides away or snaps back. Elements inside
 * `[data-no-swipe]` (sliders, croppers, horizontal scrollers) are ignored.
 */
export function useSwipeBack(el: Ref<HTMLElement | null>, fallback = '/') {
  const goBack = useGoBack(fallback)
  let startX = 0
  let startY = 0
  let startTime = 0
  let dx = 0
  let mode: 'pending' | 'swipe' | 'ignore' = 'ignore'

  const setOffset = (x: number, animate: boolean) => {
    const node = el.value
    if (!node) return
    node.style.transition = animate ? 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
    node.style.transform = x ? `translate3d(${x}px, 0, 0)` : ''
  }

  const onStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    if (e.touches.length !== 1 || target.closest('[data-no-swipe], input, textarea, select')) {
      mode = 'ignore'
      return
    }
    startX = e.touches[0]!.clientX
    startY = e.touches[0]!.clientY
    startTime = performance.now()
    dx = 0
    mode = 'pending'
  }

  const onMove = (e: TouchEvent) => {
    if (mode === 'ignore') return
    const moveX = e.touches[0]!.clientX - startX
    const moveY = e.touches[0]!.clientY - startY
    if (mode === 'pending') {
      if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) return
      mode = moveX > 0 && Math.abs(moveX) > Math.abs(moveY) * 1.2 ? 'swipe' : 'ignore'
      if (mode === 'ignore') return
    }
    e.preventDefault()
    dx = Math.max(0, moveX)
    setOffset(dx, false)
  }

  const onEnd = () => {
    if (mode !== 'swipe') return
    mode = 'ignore'
    const velocity = dx / (performance.now() - startTime)
    if (dx > window.innerWidth * 0.3 || velocity > 0.5) {
      setOffset(window.innerWidth, true)
      setTimeout(goBack, 200)
    } else {
      setOffset(0, true)
    }
  }

  onMounted(() => {
    const node = el.value
    if (!node) return
    node.addEventListener('touchstart', onStart, { passive: true })
    node.addEventListener('touchmove', onMove, { passive: false })
    node.addEventListener('touchend', onEnd)
    node.addEventListener('touchcancel', onEnd)
  })

  onBeforeUnmount(() => {
    const node = el.value
    if (!node) return
    node.removeEventListener('touchstart', onStart)
    node.removeEventListener('touchmove', onMove)
    node.removeEventListener('touchend', onEnd)
    node.removeEventListener('touchcancel', onEnd)
  })

  return goBack
}
