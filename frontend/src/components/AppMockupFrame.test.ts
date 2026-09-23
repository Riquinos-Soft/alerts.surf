import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppMockupFrame from './AppMockupFrame.vue'
import Vant from 'vant'

describe('AppMockupFrame', () => {
  it('renders phone frame and interactive spot selector', async () => {
    const wrapper = mount(AppMockupFrame, {
      global: {
        plugins: [Vant]
      }
    })
    await flushPromises()

    expect(wrapper.find('[data-test="app-mockup"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mundaka')
    expect(wrapper.text()).toContain('alerts.surf')

    const spotChips = wrapper.findAll('[data-test="spot-chip"]')
    expect(spotChips.length).toBeGreaterThan(1)

    // Select second spot
    await spotChips[1].trigger('click')
    expect(wrapper.text()).toContain('Salinas')
  })

  it('interacts with AI Surf Caddy button', async () => {
    const wrapper = mount(AppMockupFrame, {
      global: {
        plugins: [Vant]
      }
    })
    await flushPromises()

    const aiBtn = wrapper.find('[data-test="ai-advice-btn"]')
    expect(aiBtn.exists()).toBe(true)
    await aiBtn.trigger('click')
    expect(wrapper.text()).toContain('Advisory Active')
  })
})
