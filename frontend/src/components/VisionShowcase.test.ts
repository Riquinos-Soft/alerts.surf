import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import VisionShowcase from './VisionShowcase.vue'

describe('VisionShowcase', () => {
  it('renders all product pillars and agentic caddy preview', () => {
    const wrapper = mount(VisionShowcase)

    expect(wrapper.get('#showcase-title').text()).toContain('Everything traditional surf forecasts missed')
    expect(wrapper.get('#pillar-physics').text()).toContain('Condition Scoring That Actually Works')
    expect(wrapper.get('#pillar-agent').text()).toContain('Your Personal AI Surf Caddy')
    expect(wrapper.get('#pillar-alerts').text()).toContain('Laser-Focused Notifications')
    expect(wrapper.get('#pillar-mobile').text()).toContain('Native Speed, Zero Bloat')
  })

  it('triggers voice simulation when action button is clicked', async () => {
    const wrapper = mount(VisionShowcase)

    const voiceBtn = wrapper.find('.action-pill-btn')
    expect(voiceBtn.text()).toContain('Simulate Voice Query')

    await voiceBtn.trigger('click')
    expect(wrapper.text()).toContain('Listening...')
    expect(wrapper.find('.voice-wave').exists()).toBe(true)
  })
})
