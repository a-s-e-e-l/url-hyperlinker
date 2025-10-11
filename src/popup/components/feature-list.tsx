import { Check } from 'lucide-react'

interface Feature {
  text: string
}

interface FeatureListProps {
  features: Feature[]
}

function FeatureList({ features }: FeatureListProps) {
  return (
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3">
          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-400">{feature.text}</span>
        </li>
      ))}
    </ul>
  )
}

export default FeatureList
