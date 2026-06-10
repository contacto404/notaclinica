'use client'

import { useState } from 'react'

export default function PortalLinkButton({ token, patientPhone }: { token: string; patientPhone?: string | null }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}/portal/${token}` : ''

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const waText = encodeURIComponent(`Hola! Te comparto tu espacio de seguimiento. Antes de la próxima sesión, podés registrar cómo venís acá: ${url}`)
  const waHref = patientPhone
    ? `https://wa.me/${patientPhone.replace(/[^0-9]/g, '')}?text=${waText}`
    : `https://wa.me/?text=${waText}`

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="border border-[#E2E8F0] text-[#475569] px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors">
        🔗 Portal
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <p className="text-[11px] text-[#64748B] font-medium uppercase tracking-widest mb-0.5">Portal del paciente</p>
              <h2 className="text-lg font-bold text-[#0F172A]">Compartir acceso</h2>
            </div>
            <p className="text-sm text-[#64748B] mb-4">El paciente abre este link (sin registrarse) para ver su próximo turno y registrar cómo viene entre sesiones.</p>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#475569] break-all mb-3">
              {url}
            </div>

            <div className="flex gap-2">
              <button onClick={copiar}
                className="flex-1 border border-[#E2E8F0] text-[#475569] rounded-xl py-2.5 text-sm font-medium hover:bg-[#F8FAFC] transition-colors">
                {copied ? '¡Copiado!' : 'Copiar link'}
              </button>
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white rounded-xl py-2.5 text-sm font-semibold text-center hover:bg-[#1DA851] transition-colors">
                Enviar por WhatsApp
              </a>
            </div>

            <button onClick={() => setOpen(false)}
              className="w-full text-sm text-[#64748B] hover:text-[#0F172A] py-2 mt-3 transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
