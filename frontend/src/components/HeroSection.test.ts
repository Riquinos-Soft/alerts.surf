import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HeroSection from './HeroSection.vue'

describe('HeroSection', () => {
  it('renders hero title, description, and primary CTAs', () => {
    const wrapper = mount(HeroSection)

    expect(wrapper.get('#hero-title').text()).toContain('Know exactly when and where')
    expect(wrapper.text()).toContain('Explore Intelligence')
    expect(wrapper.text()).toContain('Discover Surf Agent')
  })

  it('renders live spot telemetry and allows tab switching', async () => {
    const wrapper = mount(HeroSection)

    // Default spot is Mundaka
    expect(wrapper.find('.spot-name').text()).toBe('Mundaka')
    expect(wrapper.text()).toContain('Basque Country')
    expect(wrapper.text()).toContain("6'0\" Round Pin")

    // Switch to Pantín
    const tabs = wrapper.findAll('.spot-tab')
    expect(tabs.length).toBe(2)
    await tabs[1].trigger('click')

    expect(wrapper.find('.spot-name').text()).toBe('Pantín')
    expect(wrapper.text()).toContain('Galicia')
    expect(wrapper.text()).toContain("5'10\" All-Rounder")
  })
})
