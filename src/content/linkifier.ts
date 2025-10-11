import type { Settings } from '@/types/settings'
import { isValidUrl, matchesPattern, normalizeUrl } from '@/utils/url-detector'

let settings: Settings | null = null
let observer: MutationObserver | null = null
const processedNodes = new WeakSet<Node>()

// URL regex pattern
const URL_REGEX =
  /(?:(?:https?:\/\/)?(?:www\.)?)?([a-zA-Z0-9][-a-zA-Z0-9]*\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g

const shouldProcessPage = (): boolean => {
  if (!settings || !settings.enabled) return false

  const currentDomain = window.location.hostname

  // Check excluded sites
  if (settings.mode === 'all') {
    return !settings.excludedSites.some((pattern) =>
      matchesPattern(currentDomain, pattern)
    )
  }

  // Check specific sites
  if (settings.mode === 'specific') {
    return settings.specificSites.some((pattern) =>
      matchesPattern(currentDomain, pattern)
    )
  }

  return false
}

const createLink = (url: string): HTMLAnchorElement => {
  const link = document.createElement('a')
  link.href = normalizeUrl(url)
  link.textContent = url
  link.className = 'url-hyperlinker-link'

  if (settings?.openInNewTab) {
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
  }

  // Apply custom styles
  if (settings?.linkColor) {
    link.style.color = settings.linkColor
  }
  if (settings?.underlineLinks) {
    link.style.textDecoration = 'underline'
  }

  return link
}

const processTextNode = (node: Text): void => {
  if (processedNodes.has(node)) return
  if (!node.textContent) return

  const parent = node.parentElement
  if (!parent) return

  // Skip if already a link or in certain elements
  const skipTags = ['A', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']
  if (skipTags.includes(parent.tagName)) return

  const text = node.textContent
  const matches = Array.from(text.matchAll(URL_REGEX))

  if (matches.length === 0) return

  const fragment = document.createDocumentFragment()
  let lastIndex = 0

  matches.forEach((match) => {
    const url = match[0]
    const index = match.index!

    // Skip if not a valid URL
    if (!isValidUrl(url)) return

    // Add text before URL
    if (index > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.substring(lastIndex, index))
      )
    }

    // Add link
    fragment.appendChild(createLink(url))
    lastIndex = index + url.length
  })

  // Add remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
  }

  if (fragment.childNodes.length > 0) {
    processedNodes.add(node)
    parent.replaceChild(fragment, node)
  }
}

const processNode = (node: Node): void => {
  if (node.nodeType === Node.TEXT_NODE) {
    processTextNode(node as Text)
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element

    // Skip certain elements
    const skipTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'A']
    if (skipTags.includes(element.tagName)) return

    // Process child nodes
    Array.from(node.childNodes).forEach(processNode)
  }
}

const processPage = (): void => {
  if (!shouldProcessPage()) return

  // Process the entire document
  processNode(document.body)
}

const initObserver = (): void => {
  if (observer) observer.disconnect()

  observer = new MutationObserver((mutations) => {
    if (!shouldProcessPage()) return

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        processNode(node)
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

const init = async (): Promise<void> => {
  try {
    // Get settings from storage
    const result = await chrome.storage.sync.get('settings')
    settings = result.settings

    // Inject CSS for link styling
    if (shouldProcessPage()) {
      injectStyles()
      processPage()
      initObserver()
    }
  } catch (error) {
    console.error('URL Hyperlinker error:', error)
  }
}

const injectStyles = (): void => {
  if (document.getElementById('url-hyperlinker-styles')) return

  const style = document.createElement('style')
  style.id = 'url-hyperlinker-styles'
  style.textContent = `
    .url-hyperlinker-link {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .url-hyperlinker-link:hover {
      opacity: 0.8;
    }
  `
  document.head.appendChild(style)
}

// Listen for settings changes
chrome.storage.onChanged.addListener(
  (changes: { settings?: { newValue: Settings } }) => {
    if (changes.settings) {
      settings = changes.settings.newValue

      // Reload page to apply new settings
      if (shouldProcessPage()) {
        injectStyles()
        processPage()
        initObserver()
      } else if (observer) {
        observer.disconnect()
      }
    }
  }
)

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
