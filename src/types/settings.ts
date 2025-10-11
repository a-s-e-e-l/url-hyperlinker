export interface Settings {
  enabled: boolean
  mode: 'all' | 'specific'
  specificSites: string[]
  excludedSites: string[]
  openInNewTab: boolean
  underlineLinks: boolean
  linkColor: string
}

export const defaultSettings: Settings = {
  enabled: true,
  mode: 'all',
  specificSites: [],
  excludedSites: [],
  openInNewTab: true,
  underlineLinks: true,
  linkColor: '#3b82f6'
}
