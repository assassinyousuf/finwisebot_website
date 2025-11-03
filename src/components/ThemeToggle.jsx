import { useEffect, useState } from 'react'
import { initTheme, setTheme } from '../lib/theme'

export default function ThemeToggle({ className = '' }) {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const t = initTheme() || 'light'
    setThemeState(t)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={theme === 'dark'}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className={`btn-theme-toggle ${className}`}
    >
      <span style={{display:'inline-block', transform: theme==='dark' ? 'rotate(20deg)' : 'none'}}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
