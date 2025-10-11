import type { Settings } from '../types/settings'
import { defaultSettings } from '../types/settings'

export const getSettings = async (): Promise<Settings> => {
  try {
    const result = await chrome.storage.sync.get('settings')
    return result.settings || defaultSettings
  } catch (error) {
    console.error('Error getting settings:', error)
    return defaultSettings
  }
}

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await chrome.storage.sync.set({ settings })
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}
