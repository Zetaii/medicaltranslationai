import React from "react"

interface SpeakButtonProps {
  onClick: () => void
  label?: string
}

const SpeakButton: React.FC<SpeakButtonProps> = ({
  onClick,
  label = "Play Translated Audio",
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-2 sm:p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {label}
    </button>
  )
}

export default SpeakButton
