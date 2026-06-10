// Tipos de las entidades de la base de datos (Supabase).
// Se van aplicando gradualmente para reducir el uso de `any`.

export interface Patient {
  id: string
  professional_id: string
  full_name: string
  diagnosis?: string | null
  medication?: string | null
  phone?: string | null
  date_of_birth?: string | null
  notes?: string | null
  insurance_provider?: string | null
  insurance_member_id?: string | null
  portal_token?: string
  created_at?: string
}

export interface Summary {
  id?: string
  session_id?: string
  chief_complaint?: string | null
  observations?: string | null
  plan?: string | null
  next_steps?: string | null
  content?: string | null
  format?: string | null
}

export interface SessionRow {
  id: string
  patient_id: string
  professional_id: string
  session_date: string
  status: string
  summaries?: Summary | Summary[] | null
  transcriptions?: { content?: string } | { content?: string }[] | null
}

export interface Appointment {
  id: string
  patient_id: string
  professional_id: string
  appointment_date: string
  notes?: string | null
  status?: string | null
  patients?: Patient | null
}

export interface Payment {
  id: string
  professional_id: string
  patient_id: string
  amount: number
  status: string
  description?: string | null
  created_at: string
  patients?: { full_name?: string } | null
}

export interface ScaleAssessment {
  id: string
  patient_id: string
  professional_id: string
  scale: string
  score: number
  severity: string
  assessed_at: string
}

export interface Checkin {
  mood?: number | null
  anxiety?: number | null
  note?: string | null
  created_at: string
}
