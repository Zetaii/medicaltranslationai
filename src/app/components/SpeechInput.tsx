import React, { useState, useRef, useEffect } from "react"

interface SpeechInputProps {
  onTranscriptionUpdate: (text: string) => void
}

const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscriptionUpdate }) => {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    onTranscriptionUpdate(transcript)
  }, [transcript, onTranscriptionUpdate])

  const startRecording = async () => {
    try {
      setTranscript("")
      audioChunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
      }

      startRealTimeTranscription()
      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert(
        "Could not access microphone. Please enable microphone permissions."
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
    stopRealTimeTranscription()
  }

  const startRealTimeTranscription = () => {
    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognitionRef.current = recognition

    recognition.onresult = (event) => {
      let finalTranscripts = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscripts += event.results[i][0].transcript + " "
        }
      }

      setTranscript((prev) => prev + finalTranscripts)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
    }

    recognition.start()
  }

  const stopRealTimeTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <div className="space-y-4 flex justify-center">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`w-1/2 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          recording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  )
}

export default SpeechInput
