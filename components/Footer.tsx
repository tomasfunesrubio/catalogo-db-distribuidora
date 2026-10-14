import Link from 'next/link'
import { SHOP_INFO, WHATSAPP_URL } from '@/lib/site-config'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'
import { WhatsAppIcon } from './WhatsAppIcon'

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-serif text-lg font-bold">DB Distribuidora</p>
              <p className="text-xs text-[#a8a29e]">Distribuidora de Bebidas</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#c8c3bb]">
            Venta mayorista y minorista de bebidas, cervezas, vinos, aperitivos y kiosco en Plátanos, Berazategui y zona sur.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">Navegación</h3>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-[#c8c3bb]">
            <Link href="/#categorias" className="hover:text-white transition">Categorías</Link>
            <Link href="/productos" className="hover:text-white transition">Catálogo completo</Link>
            <Link href="/#ofertas" className="hover:text-white transition">Ofertas y promociones</Link>
            <Link href="/#envios" className="hover:text-white transition">Zonas de envío y retiro</Link>
          </nav>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">Contacto</h3>
          <div className="mt-3 space-y-2 text-sm text-[#c8c3bb]">
            <p>{SHOP_INFO.phone}</p>
            <p>{SHOP_INFO.email}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803d] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166534] transition mt-1"
            >
              <WhatsAppIcon className="size-3.5" /> Escribinos por WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">Redes Sociales</h3>
          <p className="mt-3 text-sm text-[#c8c3bb]">Seguinos para novedades y promociones:</p>
          <div className="mt-2">
            <SocialLinks dark />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#8f8a81]">
        Venta prohibida a menores de 18 años. Beber con moderación. · © 2026 DB Distribuidora de Bebidas
      </div>
    </footer>
  )
}
