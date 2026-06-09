import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const MAX_BYTES = 25 * 1024 * 1024 // 25 MB

export async function POST(request: NextRequest) {
  try {
    // Autenticación: solo usuarios logueados pueden transcribir
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const formData = await request.formData()
    const audio = formData.get('audio') as File
    if (!audio) return NextResponse.json({ error: 'No audio' }, { status: 400 })
    if (audio.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Audio demasiado grande (máx 25MB)' }, { status: 413 })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
      language: 'es',
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const maxDuration = 60
