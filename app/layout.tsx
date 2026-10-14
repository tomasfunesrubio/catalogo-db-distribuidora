import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { CartDrawer } from '@/components/CartDrawer'
import { FloatingCartBar } from '@/components/FloatingCartBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { CartProvider } from '@/lib/cart-context'
import { asset } from '@/lib/site-config'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['600', '700', '800'] })

export const metadata: Metadata = {
  title: {
    default: 'DB Distribuidora de Bebidas | Precio, volumen y confianza',
    template: '%s | DB Distribuidora de Bebidas',
  },
  description: 'Pedí bebidas online en DB Distribuidora. Cervezas, vinos, fernet, aperitivos y gaseosas con entrega a domicilio.',
  openGraph: { title: 'DB Distribuidora de Bebidas', description: 'Precio, volumen y confianza. Pedí online y te lo llevamos.', type: 'website' },
  icons: {
    icon: asset('/logo.png'),
    shortcut: asset('/logo.png'),
    apple: asset('/logo.png'),
  },
}

export const viewport: Viewport = { themeColor: '#b80f0f', colorScheme: 'light', userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <CartProvider>
          <div className="min-h-screen bg-[#f6f1e9] text-[#1a1a1a]">
            <div className="bg-[#b80f0f] px-4 py-2 text-center text-xs font-semibold text-white tracking-wide">
              5% de descuento pagando en efectivo y retirando en el local · Envíos a Plátanos, Berazategui y alrededores
            </div>
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingCartBar />
            <CartDrawer />
          </div>
        </CartProvider>
        {/* Vercel Analytics only works when the site is hosted on Vercel */}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
