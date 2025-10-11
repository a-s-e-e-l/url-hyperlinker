import { checkForUpdates } from '@/utils/update-checker'
import { useEffect, useState } from 'react'

export const useUpdateChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [latestVersion, setLatestVersion] = useState('')
  const [releaseUrl, setReleaseUrl] = useState('')

  const loadUpdateInfo = async () => {
    const updateInfo = await checkForUpdates()
    if (updateInfo) {
      setUpdateAvailable(updateInfo.updateAvailable)
      setLatestVersion(updateInfo.latestVersion)
      setReleaseUrl(updateInfo.releaseUrl)
    }
  }

  useEffect(() => {
    loadUpdateInfo()
  }, [])

  return {
    updateAvailable,
    latestVersion,
    releaseUrl,
    loadUpdateInfo
  }
}
