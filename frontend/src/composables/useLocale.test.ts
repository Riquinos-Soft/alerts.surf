import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { detectLocale, initializeLocale, setLocale, useLocale } from './useLocale'

describe('interface language', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('detects Spanish, other declared languages, and the no-language fallback', () => {
    expect(detectLocale('es-ES')).toBe('es')
    expect(detectLocale('es')).toBe('es')
    expect(detectLocale('fr-FR')).toBe('en')
    expect(detectLocale('en-US')).toBe('en')
    expect(detectLocale(undefined)).toBe('es')
    expect(detectLocale('')).toBe('es')
  })

  it('uses the browser language on first visit and updates document lang', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    initializeLocale()
    expect(useLocale().locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  it('persists an explicit selection ahead of browser detection', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('fr-FR')
    initializeLocale()
    setLocale('es')
    expect(localStorage.getItem('alerts.surf.language')).toBe('es')
    expect(document.documentElement.lang).toBe('es')

    initializeLocale()
    expect(useLocale().locale.value).toBe('es')
    expect(useLocale().t('Sign in')).toBe('Entrar')
  })

  it('ignores invalid stored values and falls back to Spanish without a browser language', () => {
    localStorage.setItem('alerts.surf.language', 'fr')
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('')
    initializeLocale()
    expect(useLocale().locale.value).toBe('es')
  })
})
