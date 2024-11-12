import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { text, targetLanguage } = await req.json()

  if (!text || !targetLanguage) {
    return NextResponse.json(
      { error: "Text and target language are required." },
      { status: 400 }
    )
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage}. The text is: "${text}"`,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    })

    const translation = response.choices[0].message?.content?.trim()
    return NextResponse.json({ translation })
  } catch (error) {
    console.error("Error in translation:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
