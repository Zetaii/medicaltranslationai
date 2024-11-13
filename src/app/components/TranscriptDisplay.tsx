import React, { useState } from "react"

interface TranscriptDisplayProps {
  title: string
  text: string
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  title,
  text,
}) => {
  const [volume, setVolume] = useState(0.5)

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value))
  }

  return (
    <section className="p-4 sm:p-8 mt-6 space-y-4 sm:space-y-6 bg-gray-400 rounded-xl shadow-md max-w-full sm:max-w-lg border border-gray-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <label htmlFor="volume" className="text-sm font-medium text-gray-600">
          Volume:
        </label>
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Volume slider"
        />
      </div>

      <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 sm:h-44 overflow-y-auto shadow-inner">
        {text ? (
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed tracking-wide">
            {text}
          </p>
        ) : (
          <p className="text-gray-400 italic">Text will appear here</p>
        )}
      </div>
    </section>
  )
}

export default TranscriptDisplay
