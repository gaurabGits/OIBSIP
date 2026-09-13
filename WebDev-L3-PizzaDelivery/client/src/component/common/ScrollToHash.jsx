import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToSection } from '../../utils/scrollToSection'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    let frameId
    const timeoutIds = []

    const runScroll = (behavior) => {
      frameId = window.requestAnimationFrame(() => {
        scrollToSection(hash, behavior)
      })
    }

    timeoutIds.push(window.setTimeout(() => runScroll('smooth'), 0))
    timeoutIds.push(window.setTimeout(() => runScroll('auto'), 350))
    timeoutIds.push(window.setTimeout(() => runScroll('auto'), 800))

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [pathname, hash])

  return null
}

export default ScrollToHash
