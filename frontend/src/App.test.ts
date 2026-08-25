import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from './App.vue'

function createResponse(ok: boolean, body: unknown): Response {
  return {
    ok,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

type FetchResult = Response | Promise<Response> | Error

const healthyStatus = createResponse(true, {
  status: 'ok',
  database: 'ok',
})

const emptyCatalog = createResponse(true, { spots: [] })

function stubFetch(routes: Record<string, FetchResult>) {
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const result = routes[String(input)]

    if (result instanceof Error) {
      return Promise.reject(result)
    }

    return Promise.resolve(result)
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the application loading state while its request is pending', async () => {
    let resolveStatus!: (response: Response) => void
    const pendingStatus = new Promise<Response>((resolve) => {
      resolveStatus = resolve
    })
    stubFetch({
      '/api/status': pendingStatus,
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)

    expect(wrapper.get('.status-message').text()).toBe(
      'Checking alerts.surf status...',
    )

    resolveStatus(healthyStatus)
    await flushPromises()
  })

  it('shows the running state for a healthy response', async () => {
    const fetchMock = stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('/api/status')
    expect(wrapper.get('.status-message').text()).toBe(
      'alerts.surf is running',
    )
  })

  it('shows the application unavailable state for a non-success response', async () => {
    stubFetch({
      '/api/status': createResponse(false, {}),
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.status-message').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('shows the application unavailable state for a malformed response', async () => {
    stubFetch({
      '/api/status': createResponse(true, {
        status: 'ok',
        database: 'unavailable',
      }),
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.status-message').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('shows the application unavailable state for a network failure', async () => {
    stubFetch({
      '/api/status': new Error('Network error'),
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.status-message').text()).toBe(
      'alerts.surf is unavailable',
    )
  })

  it('shows the catalog loading state while its request is pending', async () => {
    let resolveCatalog!: (response: Response) => void
    const pendingCatalog = new Promise<Response>((resolve) => {
      resolveCatalog = resolve
    })
    stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': pendingCatalog,
    })

    const wrapper = mount(App)

    expect(wrapper.get('.catalog-content [role="status"]').text()).toBe(
      'Loading surf spots...',
    )

    resolveCatalog(emptyCatalog)
    await flushPromises()
  })

  it('shows every spot from a populated catalog in response order', async () => {
    const fetchMock = stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': createResponse(true, {
        spots: [
          { name: 'Mundaka', region: 'Bizkaia', country_code: 'ES' },
          { name: 'Pantín', region: 'A Coruña', country_code: 'ES' },
        ],
      }),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith('/api/spots')
    expect(wrapper.get('#spots-title').text()).toBe('Surf spots')
    expect(wrapper.findAll('.spot-item').map((item) => item.text())).toEqual([
      'MundakaBizkaia · ES',
      'PantínA Coruña · ES',
    ])
  })

  it('shows the empty catalog state', async () => {
    stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': emptyCatalog,
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.catalog-content [role="status"]').text()).toBe(
      'No surf spots available',
    )
  })

  it('shows the catalog unavailable state for a non-success response', async () => {
    stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': createResponse(false, {}),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.catalog-content [role="status"]').text()).toBe(
      'Surf spots are unavailable',
    )
  })

  it('shows the catalog unavailable state for a malformed response', async () => {
    stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': createResponse(true, {
        spots: [{ name: 'Mundaka', region: 'Bizkaia', country_code: 'es' }],
      }),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.catalog-content [role="status"]').text()).toBe(
      'Surf spots are unavailable',
    )
  })

  it('shows the catalog unavailable state for a network failure', async () => {
    stubFetch({
      '/api/status': healthyStatus,
      '/api/spots': new Error('Network error'),
    })

    const wrapper = mount(App)
    await flushPromises()

    expect(wrapper.get('.catalog-content [role="status"]').text()).toBe(
      'Surf spots are unavailable',
    )
  })
})
