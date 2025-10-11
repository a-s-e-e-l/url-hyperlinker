import { Trash2 } from 'lucide-react'

interface SiteListProps {
  sites: string[]
  onRemove: (index: number) => void
  emptyMessage?: string
}

function SiteList({
  sites,
  onRemove,
  emptyMessage = 'No sites added yet'
}: SiteListProps) {
  return (
    <div className="space-y-2">
      {sites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <>
          <div className="text-sm text-gray-400 mb-2">
            {sites.length} site{sites.length !== 1 ? 's' : ''}
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {sites.map((site, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#1a1a1f] px-3 py-2 rounded-lg border border-gray-800"
              >
                <span className="text-gray-200 font-mono text-sm">{site}</span>
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SiteList
