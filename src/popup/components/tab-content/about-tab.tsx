import Card from '@/popup/components/card'
import FeatureList from '@/popup/components/feature-list'
import Section from '@/popup/components/section'

function AboutTab() {
  const features = [
    { text: 'Automatically detects URLs and domains in plain text' },
    { text: 'Activate on all sites or only specific domains' },
    { text: 'Exclude specific domains when using "all sites" mode' },
    { text: 'Support for wildcards and regex patterns' },
    { text: 'Customizable link color and styling' },
    { text: 'Open links in new tab option' }
  ]

  return (
    <div className="p-6 space-y-6 flex flex-col">
      {/* About Section */}
      <Section title="About This Extension">
        <p className="text-gray-400 leading-relaxed">
          URL Hyperlinker automatically detects plain text URLs and domain names
          on web pages and converts them into clickable hyperlinks. This makes
          it easy to visit websites that are mentioned in text but not linked.
        </p>
      </Section>

      {/* Features */}
      <Section title="Features">
        <FeatureList features={features} />
      </Section>

      {/* Version */}
      <Card>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Version</span>
          <span className="text-white font-medium">1.0.0</span>
        </div>
      </Card>
    </div>
  )
}

export default AboutTab
