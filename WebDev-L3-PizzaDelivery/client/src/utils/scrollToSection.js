const getHeaderOffset = () => {
  if (typeof document === 'undefined') {
    return 0
  }

  const header = document.querySelector('[data-scroll-header]')
  return header ? Math.ceil(header.getBoundingClientRect().height) : 0
}

export const scrollToSection = (targetId, behavior = 'smooth') => {
  if (typeof window === 'undefined' || !targetId) {
    return false
  }

  const id = targetId.replace(/^#/, '')
  const target = document.getElementById(id)

  if (!target) {
    return false
  }

  const targetTop = target.getBoundingClientRect().top + window.scrollY

  window.scrollTo({
    top: Math.max(targetTop - getHeaderOffset(), 0),
    behavior,
  })

  return true
}

export const getHashTarget = (href) => {
  if (!href || !href.includes('#')) {
    return null
  }

  const [path, hash] = href.split('#')

  return {
    path: path || '/',
    hash: hash ? `#${hash}` : '',
    id: hash || '',
  }
}
