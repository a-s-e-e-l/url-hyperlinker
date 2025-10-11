import { z } from 'zod'

export const colorSchema = z
  .string()
  .regex(
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    'Invalid color format. Use hex colors like #3b82f6 or #fff'
  )

export type Color = z.infer<typeof colorSchema>
