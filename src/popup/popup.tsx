import { useUpdateChecker } from '@/hooks/use-update-checker'
import Card from '@/popup/components/card'
import AboutTab from '@/popup/components/tab-content/about-tab'
import SettingsTab from '@/popup/components/tab-content/setting-tab'
import SitesTab from '@/popup/components/tab-content/sites-tab'
import TabNavigation from '@/popup/components/tab-navigation'
import { defaultSettings, type Settings } from '@/types/settings'
import { cn } from '@/utils/helper'
import { getSettings, saveSettings } from '@/utils/storage'
import { Link, Loader2, RefreshCw, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Tab = 'settings' | 'sites' | 'about'

function Popup() {
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [showReloadNotification, setShowReloadNotification] = useState(false)
  const { updateAvailable, latestVersion, releaseUrl, loadUpdateInfo } =
    useUpdateChecker()
  const [isUpdateCheckCooldown, setIsUpdateCheckCooldown] = useState(false)
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null)
  const [showNoUpdateNotification, setShowNoUpdateNotification] =
    useState(false)
  const [buttonTitle, setButtonTitle] = useState('Check for updates')
  const [dismissingReload, setDismissingReload] = useState(false)
  const [dismissingNoUpdate, setDismissingNoUpdate] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    if (cooldownEndTime) {
      const interval = setInterval(() => {
        const remaining = Math.ceil((cooldownEndTime - Date.now()) / 1000)
        if (remaining > 0) {
          setButtonTitle(`Cooldown: ${remaining}s remaining`)
        } else {
          setIsUpdateCheckCooldown(false)
          setCooldownEndTime(null)
          setButtonTitle('Check for updates')
          clearInterval(interval)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [cooldownEndTime])

  useEffect(() => {
    if (showReloadNotification) {
      setDismissingReload(false)
    }
  }, [showReloadNotification])

  useEffect(() => {
    if (showNoUpdateNotification) {
      setDismissingNoUpdate(false)
    }
  }, [showNoUpdateNotification])

  const loadSettings = async () => {
    const loaded = await getSettings()
    setSettings(loaded)
    setLoading(false)
  }

  const handleSettingsChange = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    await saveSettings(updated)
    setShowReloadNotification(true)
  }

  const handleRecheckUpdate = async () => {
    if (isUpdateCheckCooldown || isCheckingUpdate) return
    setIsCheckingUpdate(true)
    setShowNoUpdateNotification(false) // Hide previous notification
    await loadUpdateInfo()
    setIsCheckingUpdate(false)
    setIsUpdateCheckCooldown(true)
    setCooldownEndTime(Date.now() + 60000)
    if (!updateAvailable) {
      setShowNoUpdateNotification(true)
      setTimeout(() => {
        setDismissingNoUpdate(true)
        setTimeout(() => setShowNoUpdateNotification(false), 300)
      }, 5000)
    }
  }

  if (loading) {
    return (
      <div className="w-[480px] h-[600px] bg-[#1a1a1f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[480px] h-[600px] bg-[#1a1a1f] text-gray-200 flex flex-col relative overflow-hidden">
      {/* Header */}
      <Card className="border-b border-gray-800 rounded-none bg-[#0f0f12] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Link className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">URL Hyperlinker</h1>
              <p className="text-sm text-gray-400">
                Convert text URLs to links
              </p>
            </div>
          </div>
          <button
            onClick={handleRecheckUpdate}
            disabled={isUpdateCheckCooldown || isCheckingUpdate}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            title={buttonTitle}
          >
            <RefreshCw
              className={`w-5 h-5 ${isCheckingUpdate ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </Card>

      {/* Tab Navigation */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="flex-1 relative">
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto transition-opacity duration-300 ease-in-out flex flex-col min-h-full',
            activeTab === 'settings'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          )}
        >
          <SettingsTab settings={settings} onChange={handleSettingsChange} />
        </div>
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto transition-opacity duration-300 ease-in-out flex flex-col min-h-full',
            activeTab === 'sites'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          )}
        >
          <SitesTab settings={settings} onChange={handleSettingsChange} />
        </div>
        <div
          className={cn(
            'absolute inset-0 overflow-y-auto transition-opacity duration-300 ease-in-out flex flex-col min-h-full',
            activeTab === 'about'
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          )}
        >
          <AboutTab />
        </div>
      </div>

      <div
        aria-hidden={
          !updateAvailable &&
          !showNoUpdateNotification &&
          !showReloadNotification
        }
        className={cn(
          'absolute left-4 right-4 bottom-4 flex items-end justify-center pointer-events-none',
          'transform-gpu'
        )}
      >
        {/* Update available */}
        <div
          className={cn(
            'w-fit rounded-md text-sm shadow-lg transition-all duration-300 ease-out',
            updateAvailable
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-6 opacity-0 pointer-events-none'
          )}
        >
          {updateAvailable && (
            <div className="bg-blue-600 text-white p-3 text-center flex items-center justify-center gap-2 rounded-md">
              <span>New version {latestVersion} available!</span>
              <button
                onClick={() => {
                  chrome.tabs.create({ url: releaseUrl })
                }}
                className="underline hover:no-underline"
              >
                View Release
              </button>
            </div>
          )}
        </div>

        {/* No update (success) */}
        <div
          className={cn(
            'w-fit rounded-md text-sm shadow-lg transition-all duration-300 ease-out mt-2',
            showNoUpdateNotification && !dismissingNoUpdate
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-12 opacity-0 pointer-events-none'
          )}
        >
          {showNoUpdateNotification && (
            <div className="bg-green-600 text-white p-3 text-center rounded-md">
              <span>You are up to date!</span>
            </div>
          )}
        </div>

        {/* Reload notification */}
        <div
          className={cn(
            'w-fit rounded-md text-sm shadow-lg transition-all duration-300 ease-out mt-2',
            showReloadNotification && !dismissingReload
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-12 opacity-0 pointer-events-none'
          )}
        >
          {showReloadNotification && (
            <div className="bg-yellow-600 text-white p-3 rounded-md relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Page reload required for changes to take effect.</span>
                <button
                  onClick={async () => {
                    const [tab] = await chrome.tabs.query({
                      active: true,
                      currentWindow: true
                    })
                    if (tab.id) {
                      chrome.tabs.reload(tab.id)
                    }
                    setShowReloadNotification(false)
                  }}
                  className="underline hover:no-underline"
                >
                  Reload Page
                </button>
              </div>
              <button
                onClick={() => {
                  setDismissingReload(true)
                  setTimeout(() => setShowReloadNotification(false), 300)
                }}
                className="text-white hover:text-gray-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup
