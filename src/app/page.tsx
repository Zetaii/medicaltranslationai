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

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
  ]

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
            playTranslationAudio(translated)
          }
        } catch (error) {
          console.error("Translation error:", error)
          setError("Translation failed. Please try again.")
        } finally {
          setLoading(false)
        }
      } else {
        setTranslatedText("")
      }
    }

    translateText()
  }, [transcriptionText, outputLanguage, autoSpeak])

  const playTranslationAudio = async (text: string) => {
    try {
      const response = await axios.post("/api/speak", { text })

      if (response.data.audioContent) {
        const audio = new Audio(
          `data:audio/mp3;base64,${response.data.audioContent}`
        )
        translationAudioRef.current = audio
        audio.play()
      } else {
        console.error("No audio content returned for translation")
      }
    } catch (error) {
      console.error("Error fetching translation audio:", error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-5xl rounded-lg p-4 sm:p-8 space-y-6 sm:space-y-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-4 sm:mb-6">
          Healthcare Translation Service
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
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

        <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-8">
          <div className="flex-1 min-h-44">
            <TranscriptDisplay title="Transcription" text={transcriptionText} />
          </div>
          <div className="flex-1 min-h-44">
            <TranscriptDisplay title="Translated Text" text={translatedText} />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center font-medium">{error}</p>
        )}
      </div>
    </div>
  )
}

export default Home
