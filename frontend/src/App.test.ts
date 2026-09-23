import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'

function createResponse(ok: boolean, body: unknown): Response {
  return {
    ok,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the loading state while the request is pending', async () => {
    let resolveRequest!: (response: Response) => void
    const pendingRequest = new Promise<Response>((resolve) => {
      resolveRequest = resolve
    })
    vi.stubGlobal('fetch', vi.fn(() => pendingRequest))

    const wrapper = mount(App)

    expect(wrapper.get('[role="status"]').text()).toBe(
      'Checking alerts.surf status...',
    )

    resolveRequest(
      createResponse(true, {
        status: 'ok',
        database: 'ok',
      }),
    )
    await flushPromises()
  })

  it('shows the running state for a healthy response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createResponse(true, {
        status: 'ok',
        database: 'ok',
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('/api/status')
    expect(wrapper.get('[role="status"]').text()).toBe(
      'alerts.surf is running',
    )
  })

  it('shows the unavailable state for a non-success response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createResponse(false, {})))

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('[role="status"]').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('shows the unavailable state for a malformed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createResponse(true, {
          status: 'ok',
          database: 'unavailable',
        }),
      ),
    )

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('[role="status"]').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('shows the unavailable state for a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('[role="status"]').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('renders all key sections of the welcome landing page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createResponse(true, {
          status: 'ok',
          database: 'ok',
        }),
      ),
    )

    const wrapper = mount(App)
    await flushPromises()

    // Header & brand
    expect(wrapper.find('.landing-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('alerts.surf')

    // Hero section & live spot radar
    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.get('#hero-title').text()).toContain('Know exactly when and where')
    expect(wrapper.find('.radar-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mundaka')

    // Vision showcase & agentic AI
    expect(wrapper.find('.vision-section').exists()).toBe(true)
    expect(wrapper.get('#pillar-agent').text()).toContain('Your Personal AI Surf Caddy')

    // Pricing
    expect(wrapper.find('.pricing-section').exists()).toBe(true)
    expect(wrapper.text()).toContain('Radically Fair Pricing')
    expect(wrapper.text()).toContain('€2.99')

    // Footer
    expect(wrapper.find('.landing-footer').exists()).toBe(true)
  })

  it('runs full login-to-dashboard-to-logout flow', async () => {
    // Clear token before
    sessionStorage.removeItem('beta_token')

    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url === '/api/status') {
        return Promise.resolve(createResponse(true, { status: 'ok', database: 'ok' }))
      }
      if (url === '/api/auth/login') {
        return Promise.resolve(createResponse(true, { access_token: 'test-token' }))
      }
      if (url === '/api/dashboard/summary') {
        return Promise.resolve(createResponse(true, {
          beaches: [], tides: {}, quiver: [], alerts: []
        }))
      }
      if (url === '/api/auth/logout') {
        return Promise.resolve(createResponse(true, {}))
      }
      return Promise.resolve(createResponse(false, {}))
    })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(App)
    await flushPromises()

    // 1. Initial state: unauthenticated, should show login button
    expect(wrapper.find('[data-test="login-btn"]').exists()).toBe(true)
    
    // 2. Click login button -> opens modal
    await wrapper.find('[data-test="login-btn"]').trigger('click')
    
    // 3. Login
    await wrapper.find('[data-test="username"]').setValue('userbeta')
    await wrapper.find('[data-test="password"]').setValue('userbeta')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()
    
    // 4. Authenticated state: should hide landing, show dashboard
    expect(wrapper.find('.dashboard').exists()).toBe(true)
    expect(wrapper.find('.landing-shell main').exists()).toBe(false)
    
    // 5. Logout
    await wrapper.find('[data-test="logout-btn"]').trigger('click')
    await flushPromises()
    
    // 6. Unauthenticated again
    expect(wrapper.find('.dashboard').exists()).toBe(false)
    expect(wrapper.find('[data-test="login-btn"]').exists()).toBe(true)
  })
})
