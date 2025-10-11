import { cn } from '@/utils/helper'

type Tab = 'settings' | 'sites' | 'about'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'settings', label: 'Settings' },
    { key: 'sites', label: 'Sites' },
    { key: 'about', label: 'About' }
  ]

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab)

  return (
    <div className="bg-[#0f0f12] border-b border-gray-800 px-6">
      <div className="flex relative">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={cn(
              'px-4 py-3 font-medium transition-all flex-1',
              activeTab === key
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            {label}
          </button>
        ))}
        <div
          className="absolute bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ease-in-out"
          style={{
            left: `${(activeIndex / tabs.length) * 100}%`,
            width: `${100 / tabs.length}%`
          }}
        />
      </div>
    </div>
  )
}

export default TabNavigation
