"use client"
import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import LanguageSelector from "./components/LanguageSelector"
import TranscriptDisplay from "./components/TranscriptDisplay"
import SpeechInput from "./components/SpeechInput"

const Home: React.FC = () => {
  const [inputLanguage, setInputLanguage] = useState<string>("en")
  const [outputLanguage, setOutputLanguage] = useState<string>("es")
  const [transcriptionText, setTranscriptionText] = useState<string>("")
  const [translatedText, setTranslatedText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [autoSpeak, setAutoSpeak] = useState<boolean>(false)

  const translationAudioRef = useRef<HTMLAudioElement | null>(null)
  const lastSpokenTextRef = useRef<string>("")

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ]

  const playTranslationAudio = async (text: string) => {
    try {
      const response = await axios.post("/api/speak", { text })
      if (response.data.audioContent) {
        const audio = new Audio(
          `data:audio/mp3;base64,${response.data.audioContent}`
        )
        translationAudioRef.current = audio
        audio.volume = 1.0
        audio.play()
      } else {
        console.error("No audio content returned for translation")
      }
    } catch (error) {
      console.error("Error fetching translation audio:", error)
    }
  }

  useEffect(() => {
    const translateText = async () => {
      if (transcriptionText) {
        setLoading(true)
        setError("")

        try {
          const response = await axios.post("/api/translate", {
            text: transcriptionText,
            targetLanguage: outputLanguage,
          })
          const translated = response.data.translation || "Translation failed."
          setTranslatedText(translated)

          if (autoSpeak && translated) {
            const newText = translated
              .substring(lastSpokenTextRef.current.length)
              .trim()
            if (newText) {
              playTranslationAudio(newText)
              lastSpokenTextRef.current += newText
            }
          }
        } catch (error) {
          console.error("Translation error:", error)
          setError("Translation failed. Please try again.")
        } finally {
          setLoading(false)
        }
      } else {
        setTranslatedText("")
        lastSpokenTextRef.current = ""
      }
    }

    translateText()
  }, [transcriptionText, outputLanguage, autoSpeak])

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center px-4 py-6 sm:px-8 sm:py-12 text-white">
      <div className="w-full max-w-3xl bg-gray-900 rounded-lg p-6 sm:p-10 space-y-6 sm:space-y-8 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-8">
          Healthcare Translation Service
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <LanguageSelector
            label="Input Language"
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value)}
            options={languageOptions}
          />
          <LanguageSelector
            label="Output Language"
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value)}
            options={languageOptions}
          />
        </div>

        <SpeechInput
          onTranscriptionUpdate={(text) => setTranscriptionText(text)}
        />

        <div className="flex flex-col items-center space-y-8 mt-8 sm:mt-10">
          <div className="w-full max-w-md">
            <TranscriptDisplay title="Transcription" text={transcriptionText} />
          </div>

          <div className="w-full max-w-md mt-8 sm:mt-10">
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  autoSpeak
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {autoSpeak ? "Disable" : "Enable Live Translation Audio"}
              </button>
            </div>
            <TranscriptDisplay title="Translated Text" text={translatedText} />
            {loading && (
              <p className="text-center text-gray-400 mt-4">
                Loading translation...
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  )
}

export default Home
