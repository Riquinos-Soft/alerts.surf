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
})
