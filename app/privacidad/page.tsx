export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-5 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <a href="/login" className="text-xs text-[#64748B] hover:text-[#0F172A] transition-colors font-medium">
            ← Volver
          </a>
        </div>

        <div className="mb-8">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-[#0F172A]">Política de Privacidad</h1>
          <p className="text-sm text-[#64748B] mt-1">Última actualización: junio de 2026</p>
        </div>

        <div className="flex flex-col gap-6">

          {[
            {
              title: '1. Responsable del tratamiento',
              content: 'Sortiplan SA (RUT 218380350012) es la responsable del tratamiento de los datos personales recabados a través de NotaClínica. Contacto: contacto@vibraco.com.uy'
            },
            {
              title: '2. ¿Qué datos recopilamos?',
              content: null,
              extra: (
                <div className="flex flex-col gap-3">
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Del profesional de salud</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">Nombre, correo electrónico, contraseña e información de perfil profesional.</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">De los pacientes (ingresados por el profesional)</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">Nombre completo, teléfono, fecha de nacimiento, diagnósticos, notas clínicas, transcripciones de sesiones, resúmenes generados por IA y agenda de turnos.</p>
                  </div>
                </div>
              )
            },
            {
              title: '3. Finalidad del tratamiento',
              content: 'Los datos se utilizan exclusivamente para permitir al profesional gestionar su práctica clínica, generar transcripciones y resúmenes de sesiones mediante inteligencia artificial, enviar recordatorios de turnos, y mejorar el funcionamiento de la plataforma. Los datos de pacientes son administrados por el profesional, quien asume la responsabilidad de contar con el consentimiento correspondiente de sus pacientes.'
            },
            {
              title: '3bis. Consentimiento informado',
              content: 'NotaClínica provee al profesional una herramienta de consentimiento informado digital. El profesional es responsable de obtener el consentimiento explícito de cada paciente antes de iniciar el tratamiento y el uso de herramientas de transcripción con IA. El registro de firma queda almacenado con fecha, hora y nombre del firmante, conforme a la Ley 18.331.'
            },
            {
              title: '4. Base legal',
              content: 'El tratamiento se realiza en base al consentimiento del usuario al registrarse, la ejecución del contrato de servicio y el interés legítimo en la prestación del servicio.'
            },
            {
              title: '5. Transferencia internacional de datos',
              content: 'Los datos se almacenan en servidores de Supabase (AWS us-west-1, Estados Unidos) y se procesan parcialmente por OpenAI y Anthropic para la generación de transcripciones y resúmenes. Estos proveedores cuentan con certificaciones de seguridad internacionales (SOC 2, encriptación TLS y AES-256). Al utilizar NotaClínica, el profesional acepta esta transferencia internacional.'
            },
            {
              title: '6. Plazo de conservación',
              content: 'Los datos se conservan mientras el profesional mantenga una cuenta activa. Ante la baja de la cuenta, los datos serán eliminados en un plazo máximo de 30 días.'
            },
            {
              title: '7. Derechos del usuario',
              content: null,
              extra: (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-[#0F172A] leading-relaxed">El usuario tiene derecho a acceder, rectificar, cancelar y oponerse al tratamiento de sus datos. Para ejercerlos: <span className="text-[#2563EB]">contacto@vibraco.com.uy</span></p>
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Uruguay</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">Ley 18.331 de Protección de Datos Personales. Organismo de control: URCDP.</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Argentina</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">Ley 25.326 de Protección de Datos Personales. Organismo de control: AAIP.</p>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-2xl p-4">
                    <p className="text-xs text-[#64748B] font-medium uppercase tracking-widest mb-1.5">Resto de Latinoamérica</p>
                    <p className="text-sm text-[#0F172A] leading-relaxed">Se aplican los principios generales de protección de datos conforme a la legislación local vigente en cada país.</p>
                  </div>
                </div>
              )
            },
            {
              title: '8. Seguridad',
              content: 'Implementamos encriptación en tránsito (TLS) y en reposo (AES-256), autenticación segura y acceso restringido para proteger los datos.'
            },
            {
              title: '9. Cookies',
              content: 'NotaClínica utiliza únicamente cookies estrictamente necesarias para el funcionamiento de la sesión. No utilizamos cookies de seguimiento ni publicidad.'
            },
            {
              title: '10. Modificaciones',
              content: 'Nos reservamos el derecho de actualizar esta política. Notificaremos cambios significativos por correo electrónico o mediante aviso en la plataforma.'
            },
            {
              title: '11. Contacto',
              content: 'Para consultas sobre privacidad: contacto@vibraco.com.uy'
            },
          ].map(({ title, content, extra }) => (
            <div key={title} className="bg-white rounded-3xl border border-[#E2E8F0] p-6">
              <h2 className="text-sm font-bold text-[#0F172A] mb-3">{title}</h2>
              {content && <p className="text-sm text-[#475569] leading-relaxed">{content}</p>}
              {extra}
            </div>
          ))}

        </div>

        <p className="text-center text-xs text-[#64748B] mt-8">© 2026 Sortiplan SA · NotaClínica</p>

      </div>
    </div>
  )
}