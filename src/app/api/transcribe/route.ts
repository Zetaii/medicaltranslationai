import { NextResponse } from "next/server"
import axios from "axios"

interface GoogleSpeechAlternative {
  transcript: string
  confidence: number
}

interface GoogleSpeechResult {
  alternatives: GoogleSpeechAlternative[]
}

interface GoogleSpeechResponse {
  results: GoogleSpeechResult[]
}

export async function POST(req: Request) {
  try {
    const { audioContent } = await req.json()

    if (!audioContent) {
      console.error("No audio content received")
      return NextResponse.json(
        { error: "Audio content is required" },
        { status: 400 }
      )
    }

    const cleanedAudioContent = audioContent.replace(
      /^data:audio\/\w+;base64,/,
      ""
    )

    const requestData = {
      audio: { content: cleanedAudioContent },
      config: {
        encoding: "WEBM_OPUS",
        languageCode: "en-US",
        model: "phone_call",
        useEnhanced: true,
        enableAutomaticPunctuation: true,
        maxAlternatives: 5,
        profanityFilter: true,
        speechContexts: [
          {
            phrases: [
              "patient",
              "diagnosis",
              "treatment",
              "symptoms",
              "medication",
              "prescription",
              "dosage",
              "MRI",
            ],
            boost: 15,
          },
        ],
      },
    }

    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      throw new Error("Google Cloud API key is not configured")
    }

    // Google Speech-to-Text API call
    const googleResponse = await axios.post<GoogleSpeechResponse>(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    if (!googleResponse.data?.results?.[0]?.alternatives?.[0]) {
      console.warn("No transcription results returned from Google API")
      return NextResponse.json(
        { error: "No speech detected. Please try again." },
        { status: 400 }
      )
    }

    const bestAlternative = googleResponse.data.results
      .map((result) => result.alternatives[0])
      .reduce((prev, curr) => (curr.confidence > prev.confidence ? curr : prev))

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("OpenAI API URL is not configured")
    }

    const openAIResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/openai`,
      { transcription: bestAlternative.transcript.trim() },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    return NextResponse.json({
      transcription: openAIResponse.data.refinedTranscription,
      confidence: bestAlternative.confidence,
    })
  } catch (error: unknown) {
    console.error(
      "Transcription error:",
      (error as { response?: { data?: string } }).response?.data ||
        (error as Error).message
    )
    return NextResponse.json(
      {
        error: "Failed to transcribe audio. Please try again.",
        details:
          (error as { response?: { data?: string } }).response?.data ||
          (error as Error).message,
      },
      {
        status:
          (error as { response?: { status?: number } }).response?.status || 500,
      }
    )
  }
}
