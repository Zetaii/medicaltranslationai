import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(req: Request) {
  const { text } = await req.json()

  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 })
  }

  try {
    // Call Google Text-to-Speech API
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        input: { text },
        voice: {
          languageCode: "en-US",
          ssmlGender: "FEMALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const audioContent = response.data.audioContent
    return NextResponse.json({ audioContent })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    )
  }
}
