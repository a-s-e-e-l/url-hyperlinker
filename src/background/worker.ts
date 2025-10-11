import type { Settings } from '@/types/settings'
import { defaultSettings } from '@/types/settings'

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get('settings')

  if (!result.settings) {
    await chrome.storage.sync.set({ settings: defaultSettings })
  }
})

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; settings?: Settings },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: {
      settings?: Settings
      success?: boolean
    }) => void
  ) => {
    if (request.action === 'getSettings') {
      chrome.storage.sync
        .get('settings')
        .then((result: { settings?: Settings }) => {
          sendResponse({ settings: result.settings || defaultSettings })
        })
      return true
    }

    if (request.action === 'saveSettings') {
      chrome.storage.sync.set({ settings: request.settings }).then(() => {
        sendResponse({ success: true })
      })
      return true
    }
  }
)
