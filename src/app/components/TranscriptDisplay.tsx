import React, { useState, useEffect } from "react"

interface TranscriptDisplayProps {
  title: string
  text: string
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  title,
  text,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [autoSpeak, setAutoSpeak] = useState(false) // Toggle for translation auto-speak

  // Effect to play updated translation audio if autoSpeak is enabled
  useEffect(() => {
    if (autoSpeak && title === "Translated Text" && text) {
      playAudio(text)
    }
  }, [text, autoSpeak, title])

  const playAudio = async (content: string) => {
    setIsSpeaking(true)
    try {
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      })

      const data = await response.json()
      if (data.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
        audio.volume = volume
        audio.onended = () => setIsSpeaking(false)
        audio.play()
      } else {
        console.error("No audio content returned")
        setIsSpeaking(false)
      }
    } catch (error) {
      console.error("Error fetching audio:", error)
      setIsSpeaking(false)
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value))
  }

  const handleToggleSpeak = () => {
    if (title === "Translated Text") {
      setAutoSpeak(!autoSpeak)
    } else {
      playAudio(text)
    }
  }

  return (
    <section className="p-8 mt-12 space-y-6 bg-gray-400 rounded-xl shadow-md max-w-lg border border-gray-300">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
        <button
          onClick={handleToggleSpeak}
          disabled={isSpeaking && title === "Transcription"}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSpeaking && title === "Transcription"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
          }`}
          aria-label="Speak or Play Audio"
        >
          {title === "Translated Text"
            ? autoSpeak
              ? "Do Not Speak"
              : "Speak"
            : "Play Audio"}
        </button>
      </div>

      <div className="flex items-center space-x-3">
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

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 h-44 overflow-y-auto shadow-inner">
        {text ? (
          <p className="text-gray-800 leading-relaxed tracking-wide">{text}</p>
        ) : (
          <p className="text-gray-400 italic">Text will appear here</p>
        )}
      </div>
    </section>
  )
}

export default TranscriptDisplay
