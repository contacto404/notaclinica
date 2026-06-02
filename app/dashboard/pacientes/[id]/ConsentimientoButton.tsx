'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  patientId: string
  patientName: string
  professionalId: string
  consent: {
    id: string
    status: string
    signed_at: string | null
    signed_name: string | null
  } | null
}

const CONSENT_TEXT = `Yo, el/la abajo firmante, declaro haber sido informado/a de manera clara y comprensible sobre:

1. La naturaleza del tratamiento y los procedimientos que se realizarán.
2. Que las sesiones podrán ser registradas en audio con fines de documentación clínica, utilizando herramientas de transcripción automática. Dichos registros serán utilizados exclusivamente por el/la profesional tratante y no serán compartidos con terceros sin mi consentimiento expreso.
3. Que la información de salud recopilada será almacenada de forma segura y confidencial, conforme a la Ley N° 18.331 de Protección de Datos Personales de la República Oriental del Uruguay.
4. Que puedo revocar este consentimiento en cualquier momento, sin que ello afecte la continuidad de mi atención médica.
5. Que tengo derecho a acceder, rectificar y cancelar mis datos personales.

Al firmar este documento, confirmo que he leído, comprendido y acepto las condiciones descritas.`

export default function ConsentimientoButton({ patientId, patientName, professionalId, consent }: Props) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [aceptado, setAceptado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const signed = consent?.status === 'signed'

  async function handleFirmar() {
    if (!aceptado || !nombre.trim()) {
      setError('Debes escribir tu nombre completo y aceptar el consentimiento.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (consent?.id) {
      const { error: err } = await supabase
        .from('consents')
        .update({
          status: 'signed',
          signed_at: new Date().toISOString(),
          signed_name: nombre.trim(),
        })
        .eq('id', consent.id)
      if (err) { setError('Error al guardar. Intenta de nuevo.'); setLoading(false); return }
    } else {
      const { error: err } = await supabase
        .from('consents')
        .insert({
          patient_id: patientId,
          professional_id: professionalId,
          consent_text: CONSENT_TEXT,
          status: 'signed',
          signed_at: new Date().toISOString(),
          signed_name: nombre.trim(),
        })
      if (err) { setError('Error al guardar. Intenta de nuevo.'); setLoading(false); return }
    }

    setLoading(false)
    setOpen(false)
    window.location.reload()
  }

  async function handlePendiente() {
    setLoading(true)
    const supabase = createClient()
    if (!consent?.id) {
      await supabase.from('consents').insert({
        patient_id: patientId,
        professional_id: professionalId,
        consent_text: CONSENT_TEXT,
        status: 'pending',
      })
    }
    setLoading(false)
    setOpen(false)
    window.location.reload()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          'border px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ' +
          (signed
            ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
            : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100')
        }
      >
        {signed ? '✅ Consentimiento firmado' : '⚠️ Consentimiento pendiente'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#0F172A]">📋 Consentimiento informado</h2>
              <button onClick={() => setOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A] text-xl leading-none">×</button>
            </div>

            {signed ? (
              <>
                <div className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-200">
                  <p className="text-sm font-semibold text-green-800">✅ Firmado por {consent?.signed_name}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {consent?.signed_at && new Date(consent.signed_at).toLocaleDateString('es-UY', {
                      day: '2-digit', month: 'long', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                      timeZone: 'America/Montevideo'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
                >
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-[#64748B] mb-3">
                  Paciente: <span className="font-semibold text-[#0F172A]">{patientName}</span>
                </p>

                <div className="bg-[#F8FAFC] rounded-2xl p-4 mb-4 border border-[#E2E8F0] text-xs text-[#475569] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {CONSENT_TEXT}
                </div>

                <div className="mb-3">
                  <label className="text-xs font-medium text-[#64748B] block mb-1.5">
                    Nombre completo del paciente
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej: María García"
                    className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <label className="flex items-start gap-2.5 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptado}
                    onChange={e => setAceptado(e.target.checked)}
                    className="mt-0.5 accent-[#2563EB]"
                  />
                  <span className="text-xs text-[#475569]">
                    El paciente declara haber leído y comprendido el consentimiento informado y acepta sus términos voluntariamente.
                  </span>
                </label>

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <div className="flex gap-2">
                  <button
                    onClick={handlePendiente}
                    disabled={loading}
                    className="flex-1 border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                  >
                    Dejar pendiente
                  </button>
                  <button
                    onClick={handleFirmar}
                    disabled={loading}
                    className="flex-1 bg-[#2563EB] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {loading ? 'Guardando...' : 'Registrar firma'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
