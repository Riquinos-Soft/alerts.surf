import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LandingHeader from './LandingHeader.vue'
import Vant from 'vant'

describe('LandingHeader', () => {
  const globalOptions = {
    plugins: [Vant]
  }

  it('renders brand emblem and loading status', () => {
    const wrapper = mount(LandingHeader, {
      props: {
        statusMessage: 'Checking alerts.surf status...',
        isHealthy: false,
        isLoading: true,
      },
      global: globalOptions
    })

    expect(wrapper.text()).toContain('alerts.surf')
    expect(wrapper.get('[role="status"]').text()).toBe('Checking alerts.surf status...')
    expect(wrapper.find('.status-beacon.checking').exists()).toBe(true)
  })

  it('renders healthy status beacon when operational', () => {
    const wrapper = mount(LandingHeader, {
      props: {
        statusMessage: 'alerts.surf is running',
        isHealthy: true,
        isLoading: false,
      },
      global: globalOptions
    })

    expect(wrapper.get('[role="status"]').text()).toBe('alerts.surf is running')
    expect(wrapper.find('.status-beacon.healthy').exists()).toBe(true)
  })

  it('renders degraded status beacon when unavailable', () => {
    const wrapper = mount(LandingHeader, {
      props: {
        statusMessage: 'alerts.surf is unavailable',
        isHealthy: false,
        isLoading: false,
      },
      global: globalOptions
    })

    expect(wrapper.get('[role="status"]').text()).toBe('alerts.surf is unavailable')
    expect(wrapper.find('.status-beacon.degraded').exists()).toBe(true)
  })

  it('emits openLogin when sign in button is clicked', async () => {
    const wrapper = mount(LandingHeader, {
      props: {
        statusMessage: 'alerts.surf is running',
        isHealthy: true,
        isLoading: false,
      },
      global: globalOptions
    })
    
    await wrapper.find('[data-test="login-btn"]').trigger('click')
    expect(wrapper.emitted('openLogin')).toBeTruthy()
  })
})
