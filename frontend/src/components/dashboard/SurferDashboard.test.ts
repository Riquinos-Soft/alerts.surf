import { flushPromises, mount } from '@vue/test-utils'
import Vant from 'vant'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import SurferDashboard from './SurferDashboard.vue'

const summary = {
  beaches: [{ id: 1, name: 'Test Beach', condition_score: 8, swell: '1m', wind: '5 kts' }],
  tides: { current_level: '1m', trend: 'rising', next_high: '12:00', next_low: '18:00' },
  quiver: [{ id: 1, model: 'Test Board', length: '6ft', volume: 30 }],
  alerts: [{ id: 1, rule: 'Test Alert', status: 'active' }],
}

function mountDashboard() {
  return mount(SurferDashboard, { global: { plugins: [Vant] } })
}

describe('SurferDashboard navigation', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => summary,
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shares one active section across mobile and desktop menus', async () => {
    const wrapper = mountDashboard()
    await flushPromises()

    for (const section of ['playas', 'mareas', 'tablas', 'alertas']) {
      expect(wrapper.get(`[data-test="tab-${section}"]`).attributes('role')).toBe('tab')
      expect(wrapper.get(`[data-test="sidebar-${section}"]`).attributes('role')).toBe('tab')
    }

    expect(wrapper.get('[data-test="panel-playas"]').text()).toContain('Test Beach')
    await wrapper.get('[data-test="tab-mareas"]').trigger('click')
    expect(wrapper.get('[data-test="panel-mareas"]').text()).toContain('12:00')
    expect(wrapper.get('[data-test="sidebar-mareas"]').attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-test="sidebar-tablas"]').trigger('click')
    expect(wrapper.get('[data-test="panel-tablas"]').text()).toContain('Test Board')
    expect(wrapper.get('[data-test="tab-tablas"]').attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-test="tab-alertas"]').trigger('click')
    expect(wrapper.get('[data-test="panel-alertas"]').text()).toContain('Test Alert')
    expect(wrapper.find('[data-test="panel-playas"]').exists()).toBe(false)
  })

  it('allows keyboard activation and exposes selected state', async () => {
    const wrapper = mountDashboard()
    await flushPromises()

    await wrapper.get('[data-test="tab-mareas"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.find('[data-test="panel-mareas"]').exists()).toBe(true)
    expect(wrapper.get('[role="tabpanel"]').attributes('aria-label')).toBe('Mareas')
    expect(wrapper.get('[data-test="tab-mareas"]').attributes('aria-selected')).toBe('true')

    await wrapper.get('[data-test="sidebar-alertas"]').trigger('keydown', { key: ' ' })
    expect(wrapper.get('[role="tabpanel"]').attributes('aria-label')).toBe('Alertas')
    expect(wrapper.get('[data-test="sidebar-alertas"]').attributes('aria-selected')).toBe('true')
  })

  it('keeps logout available while loading and after a failed summary request', async () => {
    let rejectRequest!: (reason: Error) => void
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise((_resolve, reject) => {
      rejectRequest = reject
    })))

    const wrapper = mountDashboard()
    expect(wrapper.get('[role="status"]').text()).toBe('Loading...')
    expect(wrapper.find('[data-test="logout-btn"]').exists()).toBe(true)

    rejectRequest(new Error('Unavailable'))
    await flushPromises()
    expect(wrapper.get('[role="alert"]').text()).toBe('Unavailable')
    expect(wrapper.find('[data-test="logout-btn"]').exists()).toBe(true)
  })

  it('emits logout even when the logout request fails', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failure')))

    await wrapper.get('[data-test="logout-btn"]').trigger('click')
    await flushPromises()

    expect(wrapper.emitted('logout')).toHaveLength(1)
  })
})
