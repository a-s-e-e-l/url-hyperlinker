import Card from '@/popup/components/card'
import AboutTab from '@/popup/components/tab-content/about-tab'
import SettingsTab from '@/popup/components/tab-content/setting-tab'
import SitesTab from '@/popup/components/tab-content/sites-tab'
import TabNavigation from '@/popup/components/tab-navigation'
import { defaultSettings, type Settings } from '@/types/settings'
import { cn } from '@/utils/helper'
import { getSettings, saveSettings } from '@/utils/storage'
import { Link, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type Tab = 'settings' | 'sites' | 'about'

function Popup() {
  const [activeTab, setActiveTab] = useState<Tab>('settings')
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [showReloadNotification, setShowReloadNotification] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

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
    <div className="w-[480px] h-[600px] bg-[#1a1a1f] text-gray-200 flex flex-col">
      {/* Header */}
      <Card className="border-b border-gray-800 rounded-none bg-[#0f0f12] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Link className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">URL Hyperlinker</h1>
            <p className="text-sm text-gray-400">Convert text URLs to links</p>
          </div>
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

      {/* Reload Notification */}
      {showReloadNotification && (
        <div className="bg-yellow-600 text-white p-3 text-center text-sm flex items-center justify-center gap-2">
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
      )}
    </div>
  )
}

export default Popup
