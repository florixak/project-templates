import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    const maybeHidden: string | false = false
    expect(cn('px-2 py-1', 'px-4', maybeHidden, 'text-sm')).toBe(
      'py-1 px-4 text-sm',
    )
  })
})
