import { z } from 'zod'

export const sitePatternSchema = z
  .string()
  .min(1, 'Site pattern cannot be empty')
  .refine(
    (val) => val.trim() === val,
    'Site pattern should not have leading or trailing spaces'
  )
  .refine((val) => {
    // Basic validation for wildcard patterns
    if (val.includes('*')) {
      // Check if wildcard is used properly (not in the middle of domain parts)
      const parts = val.split('.')
      for (const part of parts) {
        if (part.includes('*') && part !== '*') {
          // Allow * at start of subdomain or end of domain
          if (!part.startsWith('*') && !part.endsWith('*')) {
            return false
          }
        }
      }
    }
    return true
  }, 'Invalid wildcard pattern. Use * at the beginning of subdomains or end of domains')
  .refine((val) => {
    // If it looks like regex (starts and ends with / or contains regex chars), validate as regex
    if (
      (val.startsWith('/') && val.endsWith('/')) ||
      /[.*+?^${}()|[\]\\]/.test(val)
    ) {
      try {
        new RegExp(val.replace(/^\/|\/$/g, ''))
        return true
      } catch {
        return false
      }
    }
    return true
  }, 'Invalid regex pattern')
  .refine((val) => {
    // For non-regex patterns, ensure it looks like a domain (has at least one dot)
    const isRegex =
      (val.startsWith('/') && val.endsWith('/')) ||
      /[.*+?^${}()|[\]\\]/.test(val)
    if (!isRegex) {
      return val.includes('.')
    }
    return true
  }, 'Domain patterns must include at least one dot (e.g., example.com)')

export type SitePattern = z.infer<typeof sitePatternSchema>
