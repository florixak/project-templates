import { describe, expect, it } from 'vitest'

import { fail, isOk, ok } from './api-response'

describe('api-response', () => {
  it('creates a success envelope', () => {
    const response = ok({ id: '1' })
    expect(response).toEqual({ success: true, data: { id: '1' } })
    expect(isOk(response)).toBe(true)
  })

  it('creates an error envelope with optional details', () => {
    const response = fail('Validation failed', [
      { message: 'Required', path: ['name'] },
    ])
    expect(response).toEqual({
      success: false,
      error: {
        message: 'Validation failed',
        details: [{ message: 'Required', path: ['name'] }],
      },
    })
    expect(isOk(response)).toBe(false)
  })
})
