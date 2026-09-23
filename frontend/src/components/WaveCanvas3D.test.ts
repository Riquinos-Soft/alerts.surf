import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import WaveCanvas3D from './WaveCanvas3D.vue'

describe('WaveCanvas3D', () => {
  it('mounts gracefully without breaking in virtual DOM environment', () => {
    const wrapper = mount(WaveCanvas3D)
    expect(wrapper.find('.wave-canvas-3d').exists()).toBe(true)
  })
})
