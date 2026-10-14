import Link from 'next/link'
import { asset } from '@/lib/site-config'

export function Logo({ className = 'size-11 sm:size-12' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ir al inicio - DB Distribuidora"
      className="flex items-center shrink-0 group focus:outline-none"
    >
      <img
        src={asset('/logo.png')}
        alt="DB Distribuidora"
        className={`object-contain transition-transform group-hover:scale-105 ${className}`}
      />
    </Link>
  )
}
