import Card from '@/popup/components/card'
import Section from '@/popup/components/section'
import ToggleSwitch from '@/popup/components/toggle-switch'
import { colorSchema } from '@/schema/color-schema'
import type { Settings } from '@/types/settings'
import { cn } from '@/utils/helper'
import { useEffect, useState } from 'react'

interface SettingsTabProps {
  settings: Settings
  onChange: (settings: Partial<Settings>) => void
}

function SettingsTab({ settings, onChange }: SettingsTabProps) {
  const [colorValue, setColorValue] = useState(settings.linkColor)
  const [colorError, setColorError] = useState('')

  useEffect(() => {
    setColorValue(settings.linkColor)
    setColorError('')
  }, [settings.linkColor])

  const handleColorChange = (value: string) => {
    setColorValue(value)
    const result = colorSchema.safeParse(value)
    if (result.success) {
      onChange({ linkColor: result.data })
      setColorError('')
    } else {
      setColorError(result.error.issues[0].message)
    }
  }
  return (
    <div className="p-6 space-y-6 flex flex-col">
      {/* Enable/Disable */}
      <Card>
        <ToggleSwitch
          checked={settings.enabled}
          onChange={(checked) => onChange({ enabled: checked })}
          label="Enable Extension"
          description="Turn URL hyperlink conversion on or off"
        />
      </Card>

      {/* Mode Selection */}
      <Section title="Activation Mode">
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              checked={settings.mode === 'all'}
              onChange={() => onChange({ mode: 'all' })}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-white">All Sites</div>
              <div className="text-sm text-gray-400">
                Activate on all websites with optional exclusions
              </div>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              checked={settings.mode === 'specific'}
              onChange={() => onChange({ mode: 'specific' })}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
            />
            <div>
              <div className="font-medium text-white">Specific Sites</div>
              <div className="text-sm text-gray-400">
                Activate only on specified websites
              </div>
            </div>
          </label>
        </div>
      </Section>

      {/* Link Behavior */}
      <Section title="Link Behavior">
        <div className="space-y-4">
          <ToggleSwitch
            checked={settings.openInNewTab}
            onChange={(checked) => onChange({ openInNewTab: checked })}
            label="Open in New Tab"
            description="Links open in a new browser tab"
          />

          <ToggleSwitch
            checked={settings.underlineLinks}
            onChange={(checked) => onChange({ underlineLinks: checked })}
            label="Underline Links"
            description="Add underline to converted links"
          />
        </div>
      </Section>

      {/* Link Color */}
      <Section title="Link Color">
        <div className="flex-col gap-3 flex">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={colorValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={colorValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className={cn(
                  'w-full px-4 py-2 bg-[#1a1a1f] border rounded-lg text-white focus:outline-none focus:ring-2',
                  colorError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-700 focus:ring-blue-500'
                )}
                placeholder="#3b82f6"
              />
            </div>
          </div>
          {colorError && <p className="text-red-400 text-sm">{colorError}</p>}
        </div>
      </Section>
    </div>
  )
}

export default SettingsTab
