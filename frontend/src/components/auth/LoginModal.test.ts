import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import LoginModal from './LoginModal.vue'
import { setLocale } from '../../composables/useLocale'

// Mock fetch
global.fetch = vi.fn()

describe('LoginModal', () => {
  beforeEach(() => setLocale('en'))
  afterEach(() => vi.unstubAllGlobals())
  it('shows error message on failed login', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false
    })

    const wrapper = mount(LoginModal, {
      props: { isOpen: true }
    })

    await wrapper.find('[data-test="username"]').setValue('wrong')
    await wrapper.find('[data-test="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')

    // flush promises
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.find('[data-test="error"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to login')
  })

  it('emits success on valid login', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ access_token: 'test-token' })
    })

    const wrapper = mount(LoginModal, {
      props: { isOpen: true }
    })

    await wrapper.find('[data-test="username"]').setValue('userbeta')
    await wrapper.find('[data-test="password"]').setValue('userbeta')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('translates a failed login and updates the error when language changes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const wrapper = mount(LoginModal, { props: { isOpen: true } })
    setLocale('es')

    await wrapper.get('[data-test="username"]').setValue('wrong')
    await wrapper.get('[data-test="password"]').setValue('wrong')
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.get('[data-test="error"]').text()).toBe('No se pudo entrar: credenciales incorrectas')
    setLocale('en')
    await wrapper.vm.$nextTick()
    expect(wrapper.get('[data-test="error"]').text()).toBe('Failed to login: Invalid credentials')
  })
})
