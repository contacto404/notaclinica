import { permanentRedirect } from 'next/navigation'

// La promo ahora es la portada. /promo redirige a / (308) para no duplicar contenido.
export default function PromoRedirect() {
  permanentRedirect('/')
}
