import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SurferDashboard from './SurferDashboard.vue'

global.fetch = vi.fn()

describe('SurferDashboard', () => {
  beforeEach(() => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        beaches: [{ id: 1, name: 'Test Beach' }],
        tides: { current_level: '1m', trend: 'rising' },
        quiver: [{ id: 1, model: 'Test Board' }],
        alerts: [{ id: 1, rule: 'Test Alert', status: 'active' }]
      })
    })
  })

  it('renders all four domain tabs and switches between them', async () => {
    const wrapper = mount(SurferDashboard)
    
    // wait for onMounted
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.find('[data-test="tab-playas"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tab-mareas"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tab-tablas"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="tab-alertas"]').exists()).toBe(true)

    // Initial is playas
    expect(wrapper.find('[data-test="panel-playas"]').exists()).toBe(true)

    // Click mareas
    await wrapper.find('[data-test="tab-mareas"]').trigger('click')
    expect(wrapper.find('[data-test="panel-mareas"]').exists()).toBe(true)
  })

  it('emits logout on logout button click', async () => {
    const wrapper = mount(SurferDashboard)
    await new Promise(r => setTimeout(r, 0))

    await wrapper.find('[data-test="logout-btn"]').trigger('click')
    expect(wrapper.emitted('logout')).toBeTruthy()
  })
})
