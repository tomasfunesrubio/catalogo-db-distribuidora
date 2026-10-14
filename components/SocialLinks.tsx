import { SOCIAL_LINKS } from '@/lib/site-config'

export function SocialLinks({ dark = false }: { dark?: boolean }) {
  const linkClass = `flex size-10 items-center justify-center rounded-lg transition hover:text-[#b80f0f] ${
    dark ? 'text-white/80 hover:text-white' : 'text-[#44403c]'
  }`

  return (
    <div className="flex items-center gap-1">
      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className={linkClass}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[1.8]">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".7" className="fill-current stroke-0" />
        </svg>
      </a>
      <a
        href={SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className={linkClass}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
          <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7.8v3h2.7v8H14Z" />
        </svg>
      </a>
    </div>
  )
}
