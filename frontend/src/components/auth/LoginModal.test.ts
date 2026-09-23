import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import LoginModal from './LoginModal.vue'

// Mock fetch
global.fetch = vi.fn()

describe('LoginModal', () => {
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
})
