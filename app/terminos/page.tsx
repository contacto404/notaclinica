export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] p-5 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <a href="/login" className="text-xs text-[#6E6E73] hover:text-[#0A0A0A] transition-colors font-medium">
            ← Volver
          </a>
        </div>

        <div className="mb-8">
          <p className="text-xs text-[#6E6E73] font-medium uppercase tracking-widest mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Términos y Condiciones</h1>
          <p className="text-sm text-[#6E6E73] mt-1">Última actualización: junio de 2026</p>
        </div>

        <div className="flex flex-col gap-6">
          {[
            {
              title: '1. Aceptación de los términos',
              content: 'Al crear una cuenta o utilizar NotaClínica, el usuario acepta estos Términos y Condiciones y la Política de Privacidad. Si no está de acuerdo, no debe utilizar el servicio.'
            },
            {
              title: '2. Descripción del servicio',
              content: 'NotaClínica es una herramienta de software para profesionales de la salud que permite grabar consultas, generar transcripciones y resúmenes clínicos asistidos por inteligencia artificial, gestionar pacientes, agenda y honorarios. La IA genera borradores que el profesional revisa y edita; el criterio clínico es siempre del profesional.'
            },
            {
              title: '3. Uso profesional y responsabilidad clínica',
              content: 'NotaClínica es una herramienta de apoyo y no reemplaza el juicio profesional. El profesional es el único responsable del contenido clínico, los diagnósticos, las indicaciones y las decisiones tomadas. NotaClínica no presta servicios médicos ni garantiza resultados clínicos.'
            },
            {
              title: '4. Responsabilidad sobre los datos de pacientes',
              content: 'El profesional es el responsable del tratamiento de los datos de sus pacientes y debe contar con el consentimiento informado correspondiente antes de grabar o documentar una sesión. El profesional declara cumplir la normativa de protección de datos y de ejercicio profesional aplicable en su jurisdicción.'
            },
            {
              title: '5. Cuenta y seguridad',
              content: 'El usuario es responsable de mantener la confidencialidad de sus credenciales y de toda la actividad realizada en su cuenta. Debe notificar de inmediato cualquier uso no autorizado.'
            },
            {
              title: '6. Suscripción, prueba y pagos',
              content: 'NotaClínica ofrece un período de prueba gratuito sin tarjeta. Finalizado el período, el acceso continuo requiere una suscripción paga. Los precios se expresan en dólares estadounidenses (USD) y pueden actualizarse con aviso previo. La suscripción se puede cancelar en cualquier momento; el acceso se mantiene hasta el fin del período ya abonado.'
            },
            {
              title: '7. Cancelación y exportación',
              content: 'El usuario puede cancelar su cuenta cuando quiera. Antes de la baja puede exportar el historial de cada paciente en PDF. Tras la baja, los datos se eliminan en un plazo máximo de 30 días, conforme a la Política de Privacidad.'
            },
            {
              title: '8. Propiedad intelectual',
              content: 'El software, la marca y los contenidos de NotaClínica son propiedad de Sortiplan SA. Los datos clínicos cargados por el profesional y sus pacientes son y siguen siendo del profesional.'
            },
            {
              title: '9. Disponibilidad y limitación de responsabilidad',
              content: 'El servicio se ofrece "tal cual", procurando la máxima disponibilidad pero sin garantizar que sea ininterrumpido o libre de errores. En la medida permitida por la ley, Sortiplan SA no será responsable por daños indirectos derivados del uso o la imposibilidad de uso del servicio.'
            },
            {
              title: '10. Modificaciones',
              content: 'Podemos actualizar estos Términos. Los cambios significativos se notificarán por correo o mediante aviso en la plataforma. El uso continuado del servicio implica la aceptación de los términos vigentes.'
            },
            {
              title: '11. Ley aplicable y contacto',
              content: 'Estos Términos se rigen por las leyes de la República Oriental del Uruguay. Para consultas: contacto@notaclinica.app'
            },
          ].map(({ title, content }) => (
            <div key={title} className="bg-white rounded-3xl border border-[#EDEDED] p-6">
              <h2 className="text-sm font-bold text-[#0A0A0A] mb-3">{title}</h2>
              <p className="text-sm text-[#6E6E73] leading-relaxed">{content}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-[#6E6E73] mt-8">© 2026 Sortiplan SA · NotaClínica</p>

      </div>
    </div>
  )
}
