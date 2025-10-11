import { cn } from '@/utils/helper'
import { type KeyboardEvent } from 'react'

interface InputWithAddButtonProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
  placeholder: string
  buttonText?: string
  error?: string
}

function InputWithAddButton({
  value,
  onChange,
  onAdd,
  placeholder,
  buttonText = 'Add',
  error
}: InputWithAddButtonProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAdd()
    }
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'flex-1 px-4 py-2 bg-[#1a1a1f] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-700 focus:ring-blue-500'
          )}
        />
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {buttonText}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}

export default InputWithAddButton
