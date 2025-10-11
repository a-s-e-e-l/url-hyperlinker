const PROTOCOL_PATTERN = /^https?:\/\//i

export const isValidUrl = (text: string): boolean => {
  try {
    // Check if it's a domain or URL
    if (!text.includes('.')) return false

    // If it has protocol, validate as URL
    if (PROTOCOL_PATTERN.test(text)) {
      new URL(text)
      return true
    }

    // If no protocol, check if it's a valid domain
    const domainPattern = /^([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/
    const domain = text.split('/')[0]
    return domainPattern.test(domain)
  } catch {
    return false
  }
}

export const normalizeUrl = (url: string): string => {
  if (PROTOCOL_PATTERN.test(url)) {
    return url
  }
  return `https://${url}`
}

export const matchesPattern = (domain: string, pattern: string): boolean => {
  try {
    // If pattern contains regex-like characters, treat as regex
    if (
      pattern.includes('*') ||
      pattern.includes('^') ||
      pattern.includes('$')
    ) {
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*')
      const regex = new RegExp(regexPattern, 'i')
      return regex.test(domain)
    }

    // Exact or partial match
    return domain.toLowerCase().includes(pattern.toLowerCase())
  } catch {
    return false
  }
}

export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(normalizeUrl(url))
    return urlObj.hostname
  } catch {
    return url.split('/')[0]
  }
}
