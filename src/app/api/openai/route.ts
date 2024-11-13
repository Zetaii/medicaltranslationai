import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client outside the handler
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to check if an error has a response property with a status
function isAxiosError(
  error: unknown
): error is { response: { status: number } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response: { status?: unknown } }).response.status !==
      undefined &&
    typeof (error as { response: { status: unknown } }).response.status ===
      "number"
  )
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured")
    }

    const { transcription, speakers, timestamps } = await req.json()

    if (!transcription || typeof transcription !== "string") {
      return NextResponse.json(
        { error: "Valid transcription text is required" },
        { status: 400 }
      )
    }

    // Construct context-aware prompt based on available metadata
    let systemPrompt = `You are an expert transcription refinement system. Your task is to:
1. Maintain 100% accuracy of the spoken words - do not add, remove, or change any words
2. Format the text with proper punctuation, capitalization, and paragraphing
3. Identify and label speakers if multiple voices are present
4. Preserve any timing information
5. Handle speech disfluencies (um, uh, etc.) accurately
6. Include non-verbal audio cues in [brackets] (e.g., [laughter], [pause], [background noise])
7. Format overlapping speech with appropriate notation
8. Maintain proper spacing between sentences and paragraphs

Please refine the following transcription while ensuring complete word-for-word accuracy.`

    // Add speaker-specific instructions if speakers are provided
    if (speakers?.length > 0) {
      systemPrompt += "\nSpeakers in this transcription: " + speakers.join(", ")
      systemPrompt +=
        "\nPlease prefix each speaker's dialogue with their name followed by a colon."
    }

    if (timestamps) {
      systemPrompt +=
        "\nPlease preserve all timestamp information in [HH:MM:SS] format at the start of each paragraph or speaker change."
    }

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: transcription },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      presence_penalty: -0.5,
      frequency_penalty: -0.5,
    })

    if (!gptResponse.choices?.[0]?.message?.content) {
      throw new Error("No response received from OpenAI")
    }

    return NextResponse.json({
      refinedTranscription: gptResponse.choices[0].message.content.trim(),
      model: "gpt-4",
      metadata: {
        hasSpeakers: Boolean(speakers?.length),
        hasTimestamps: Boolean(timestamps),
      },
    })
  } catch (error: unknown) {
    console.error("Transcription refinement error:", error)

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred"
    const statusCode = isAxiosError(error) ? error.response.status : 500

    return NextResponse.json(
      {
        error: "Failed to refine transcription",
        details: errorMessage,
      },
      { status: statusCode }
    )
  }
}
