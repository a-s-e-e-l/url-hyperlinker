# URL Hyperlinker

A modern Chrome extension that automatically converts plain text URLs and domains into clickable hyperlinks on any webpage.

## Features

- **Smart URL detection** — supports http/https and protocol-less URLs, plain domains (e.g., example.com), subdomains, and URLs with paths/parameters
- **Flexible activation modes** — All Sites (with optional exclusions), Specific Sites, with wildcard (e.g., \*.github.com) and regex support
- **Customizable options** — link color, underline toggle, open-in-new-tab setting
- **Privacy-focused** — Works locally without sending data to external servers

## Installation

Choose one of the options below. Option 1 is simplest for non-technical users. Option 2 shows how to build from source if you want the latest code.

### Option 1 — Install from a pre-built release (recommended)

1. Visit the Releases page: https://github.com/KidiXDev/url-hyperlinker/releases
2. Download the latest release archive (look under "Assets" for `url-hyperlinker-{version}.zip`).
3. Extract the downloaded archive to a folder on your computer.
4. Open Chrome and go to: chrome://extensions/
5. Enable "Developer mode" (top-right).
6. Click "Load unpacked" and select the extracted folder.
7. The extension should appear in the list — enable it if needed.

> To remove: return to chrome://extensions/ and click "Remove" for the extension.

### Option 2 — Build from source

Prerequisites:

- Install Node.js (LTS) from https://nodejs.org/ if you don't have it.

Steps:

1. Download the source:
   - Either click "Code → Download ZIP" on the repo page and extract it, or clone:
     ```bash
     git clone https://github.com/KidiXDev/url-hyperlinker.git
     cd url-hyperlinker
     ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:

   ```bash
   npm run build
   ```

4. Open Chrome → chrome://extensions/ → enable "Developer mode" → "Load unpacked" → select the `dist` folder.

5. The extension should appear in the list.

## Development

Clone this repository

```bash
git clone https://github.com/KidiXDev/url-hyperlinker.git
cd url-hyperlinker
```

Install dependencies and run the development server or build for production

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Supported URL Formats

The extension recognizes:

- `example.com`
- `www.example.com`
- `https://example.com`
- `http://example.com/path/to/page`
- `subdomain.example.com`
- And more!

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Vite** for building
- **@crxjs/vite-plugin** for Chrome extension support

## Permissions

This extension requires the following permissions to function:

- **activeTab**: To access the current tab for URL detection and linking
- **storage**: To save user settings and preferences
- **scripting**: To inject scripts for hyperlink conversion
- **Host permissions for all URLs**: To work on any website

No data is sent to external servers; all processing happens locally in your browser.

## Todo

- [x] Basic functionality: detect and hyperlink URLs
- [x] Options page for user settings
- [x] Support wildcard (e.g., \*.github.com) and regex for specific sites
- [ ] Firefox support
- [ ] Safari support
- [ ] Microsoft Edge support
- [ ] Support for IP addresses and custom protocols in URL detection
- [ ] Export/import user settings
- [ ] Dark/Light mode themes support
- [ ] Localization (i18n) support for multiple languages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/some-feature`)
3. Commit your changes (`git commit -m 'Add some new feature'`)
4. Push to the branch (`git push origin feat/some-feature`)
5. Open a Pull Request

For development setup, see the Development section above.

## License

This project is licensed under GNU GPLv3 - see the [LICENSE](LICENSE) file for details.
