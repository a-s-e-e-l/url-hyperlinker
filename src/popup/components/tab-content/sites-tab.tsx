import Card from '@/popup/components/card'
import InputWithAddButton from '@/popup/components/input-with-add-button'
import Section from '@/popup/components/section'
import SiteList from '@/popup/components/site-list'
import { sitePatternSchema } from '@/schema/url-input-schema'
import type { Settings } from '@/types/settings'
import { Info } from 'lucide-react'
import { useState } from 'react'

interface SitesTabProps {
  settings: Settings
  onChange: (settings: Partial<Settings>) => void
}

function SitesTab({ settings, onChange }: SitesTabProps) {
  const [specificInput, setSpecificInput] = useState('')
  const [excludeInput, setExcludeInput] = useState('')
  const [specificError, setSpecificError] = useState('')
  const [excludeError, setExcludeError] = useState('')

  const handleSpecificInputChange = (value: string) => {
    setSpecificInput(value)
    if (specificError) setSpecificError('')
  }

  const handleExcludeInputChange = (value: string) => {
    setExcludeInput(value)
    if (excludeError) setExcludeError('')
  }

  const addSpecificSite = () => {
    if (!specificInput.trim()) return
    const result = sitePatternSchema.safeParse(specificInput.trim())
    if (result.success) {
      const newSites = [...settings.specificSites, result.data]
      onChange({ specificSites: newSites })
      setSpecificInput('')
      setSpecificError('')
    } else {
      setSpecificError(result.error.issues[0].message)
    }
  }

  const removeSpecificSite = (index: number) => {
    const newSites = settings.specificSites.filter((_, i) => i !== index)
    onChange({ specificSites: newSites })
  }

  const addExcludedSite = () => {
    if (!excludeInput.trim()) return
    const result = sitePatternSchema.safeParse(excludeInput.trim())
    if (result.success) {
      const newSites = [...settings.excludedSites, result.data]
      onChange({ excludedSites: newSites })
      setExcludeInput('')
      setExcludeError('')
    } else {
      setExcludeError(result.error.issues[0].message)
    }
  }

  const removeExcludedSite = (index: number) => {
    const newSites = settings.excludedSites.filter((_, i) => i !== index)
    onChange({ excludedSites: newSites })
  }

  return (
    <div className="p-6 space-y-6 flex flex-col">
      {/* Specific Sites */}
      {settings.mode === 'specific' && (
        <Card>
          <h3 className="font-semibold text-white mb-2">Specific Sites</h3>
          <p className="text-sm text-gray-400 mb-4">
            Add domains where the extension should be active. Supports wildcards
            (*) and regex patterns.
          </p>

          <InputWithAddButton
            value={specificInput}
            onChange={handleSpecificInputChange}
            onAdd={addSpecificSite}
            placeholder="e.g., github.com, *.reddit.com"
            error={specificError}
          />

          <SiteList
            sites={settings.specificSites}
            onRemove={removeSpecificSite}
            emptyMessage="No specific sites added yet"
          />
        </Card>
      )}

      {/* Excluded Sites */}
      {settings.mode === 'all' && (
        <Card>
          <h3 className="font-semibold text-white mb-2">Excluded Sites</h3>
          <p className="text-sm text-gray-400 mb-4">
            Add domains where the extension should NOT be active. Supports
            wildcards (*) and regex patterns.
          </p>

          <InputWithAddButton
            value={excludeInput}
            onChange={handleExcludeInputChange}
            onAdd={addExcludedSite}
            placeholder="e.g., example.com, mail.*"
            error={excludeError}
          />

          <SiteList
            sites={settings.excludedSites}
            onRemove={removeExcludedSite}
            emptyMessage="No excluded sites added yet"
          />
        </Card>
      )}

      {/* Pattern Guide */}
      <Section
        title="Pattern Guide"
        icon={<Info className="w-5 h-5 text-blue-400" />}
      >
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex gap-2">
            <code className="text-blue-400 font-mono">example.com</code>
            <span>- Matches "example.com"</span>
          </div>
          <div className="flex gap-2">
            <code className="text-blue-400 font-mono">*.github.com</code>
            <span>- Matches any GitHub subdomain</span>
          </div>
          <div className="flex gap-2">
            <code className="text-blue-400 font-mono">mail.*</code>
            <span>- Matches domains starting with "mail."</span>
          </div>
          <div className="flex gap-2">
            <code className="text-blue-400 font-mono">^.*\.dev$</code>
            <span>- Regex: matches all .dev domains</span>
          </div>
        </div>
      </Section>
    </div>
  )
}

export default SitesTab
