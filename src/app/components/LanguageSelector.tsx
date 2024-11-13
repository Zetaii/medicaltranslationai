import React from "react"

interface LanguageSelectorProps {
  label: string
  value: string
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div className="space-y-1">
      <label className="text-white font-semibold text-sm sm:text-base">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 text-sm sm:text-base border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSelector
