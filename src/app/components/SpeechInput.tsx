import React, { useState, useRef } from "react"

interface SpeechInputProps {
  onTranscriptionUpdate: (text: string) => void
}

const SpeechInput: React.FC<SpeechInputProps> = ({ onTranscriptionUpdate }) => {
  const [recording, setRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        })
        await processAndTranscribeAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

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
  }

  const processAndTranscribeAudio = async (audioBlob: Blob) => {
    const base64Audio = await blobToBase64(audioBlob)
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioContent: base64Audio }),
    })

    const data = await response.json()
    if (data.transcription) {
      onTranscriptionUpdate(data.transcription)
    } else {
      console.error("Transcription failed:", data.error)
    }
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(",")[1] || ""
        resolve(base64data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  return (
    <div className="space-y-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
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
