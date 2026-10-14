import { ArrowRight, Check, MapPin, Truck } from 'lucide-react'
import { SHOP_INFO, WHATSAPP_URL } from '@/lib/site-config'
import { WhatsAppIcon } from './WhatsAppIcon'

const SHIPPING_POINTS = [
  `Envíos a domicilio en ${SHOP_INFO.zones.join(', ')}.`,
  'Entregas rápidas en 24 a 48 hs hábiles.',
  `Envío GRATIS en compras superiores a ${SHOP_INFO.freeShippingFrom}.`,
  'Retiro en el local sin costo con 5% de descuento adicional pagando en efectivo.',
  'Medios de pago: Efectivo contra entrega y Transferencia bancaria.'
]

export function ShippingInfo() {
  const mapQuery = encodeURIComponent(SHOP_INFO.address)

  return (
    <section id="envios" className="scroll-mt-24 border-y border-[#e3dbcf] bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-[#b80f0f] font-bold text-xs uppercase tracking-wider">
            <Truck className="size-4" /> Envíos y retiros
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
            ¿Cómo comprar y recibir tu pedido?
          </h2>
          <ul className="mt-6 flex flex-col gap-3.5 text-sm text-[#44403c]">
            {SHIPPING_POINTS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-[#b80f0f]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#15803d] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#166534] transition"
          >
            <WhatsAppIcon className="size-4" />
            Consultar envíos por WhatsApp
          </a>
        </div>

        <div>
          <div className="flex items-center gap-2 text-[#b80f0f] font-bold text-xs uppercase tracking-wider">
            <MapPin className="size-4" /> Ubicación
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">Dónde encontrarnos</h2>
          <div className="mt-4 text-sm text-[#44403c] space-y-1">
            <p className="font-semibold text-[#1a1a1a]">{SHOP_INFO.address}</p>
            <p>{SHOP_INFO.hours.join(' · ')}</p>
            <p>Teléfono: {SHOP_INFO.phone}</p>
          </div>
          <iframe
            title="Mapa de DB Distribuidora"
            loading="lazy"
            className="mt-5 h-56 w-full rounded-xl border border-[#e3dbcf]"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#b80f0f] hover:underline"
          >
            Abrir en Google Maps <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
