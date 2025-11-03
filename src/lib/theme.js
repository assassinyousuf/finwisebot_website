// Client-side theme helper (light / dark) — persists choice to localStorage
const THEME_KEY = 'fw_theme'

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY)
  } catch (e) {
    return null
  }
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('theme-dark', theme === 'dark')
  document.documentElement.classList.toggle('theme-light', theme === 'light')
  const meta = document.querySelector('meta[name="color-scheme"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? 'dark' : 'light')
}

export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch (e) {
    // ignore
  }
  applyTheme(theme)
}

export function initTheme() {
  if (typeof window === 'undefined') return
  const stored = getStoredTheme()
  if (stored) {
    applyTheme(stored)
    return stored
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const initial = prefersDark ? 'dark' : 'light'
  setTheme(initial)
  return initial
}

export default { getStoredTheme, applyTheme, setTheme, initTheme }
