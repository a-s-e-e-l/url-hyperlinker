export const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export const isNewerVersion = (latest: string, current: string): boolean => {
  const latestParts = latest.split('.').map(Number)
  const currentParts = current.split('.').map(Number)
  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const l = latestParts[i] || 0
    const c = currentParts[i] || 0
    if (l > c) return true
    if (l < c) return false
  }
  return false
}

export interface UpdateInfo {
  updateAvailable: boolean
  latestVersion: string
  releaseUrl: string
}

export const checkForUpdates = async (): Promise<UpdateInfo | null> => {
  try {
    const cached = await chrome.storage.sync.get([
      'lastUpdateCheck',
      'updateAvailable',
      'latestVersion',
      'releaseUrl'
    ])
    const now = Date.now()
    const lastCheck = cached.lastUpdateCheck

    if (lastCheck && now - lastCheck < UPDATE_CHECK_INTERVAL) {
      // Return cached data
      return {
        updateAvailable: cached.updateAvailable || false,
        latestVersion: cached.latestVersion || '',
        releaseUrl: cached.releaseUrl || ''
      }
    }

    // Fetch new data
    const currentVersion = chrome.runtime.getManifest().version
    const response = await fetch(
      'https://api.github.com/repos/KidiXDev/url-hyperlinker/releases/latest'
    )
    if (!response.ok) return null
    const release = await response.json()
    const latestVersion = release.tag_name.replace(/^v/, '')
    const hasUpdate = isNewerVersion(latestVersion, currentVersion)

    // Store in cache
    await chrome.storage.sync.set({
      lastUpdateCheck: now,
      updateAvailable: hasUpdate,
      latestVersion: hasUpdate ? latestVersion : '',
      releaseUrl: hasUpdate ? release.html_url : ''
    })

    return {
      updateAvailable: hasUpdate,
      latestVersion: hasUpdate ? latestVersion : '',
      releaseUrl: hasUpdate ? release.html_url : ''
    }
  } catch (error) {
    console.error('Failed to check for updates:', error)
    return null
  }
}
