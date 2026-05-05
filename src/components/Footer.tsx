import { config } from '../config'

function Icon({ name }: { name: 'facebook' | 'instagram' | 'youtube' | 'linkedin' | 'whatsapp' }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor' as const }
  if (name === 'facebook')
    return (
      <svg {...common}>
        <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0022 12z" />
      </svg>
    )
  if (name === 'instagram')
    return (
      <svg {...common}>
        <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2a4 4 0 01-1 1.5 4 4 0 01-1.5 1c-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4a4 4 0 01-1.5-1 4 4 0 01-1-1.5c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2a4 4 0 011-1.5 4 4 0 011.5-1c.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-1.9.3a3 3 0 00-1.1.7 3 3 0 00-.7 1.1c-.1.3-.3.9-.3 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.3 1.9.2.4.4.7.7 1.1.4.3.7.5 1.1.7.3.1.9.3 1.9.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 1.9-.3.4-.2.7-.4 1.1-.7.3-.4.5-.7.7-1.1.1-.3.3-.9.3-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.3-1.9a3 3 0 00-.7-1.1 3 3 0 00-1.1-.7c-.3-.1-.9-.3-1.9-.3C15.5 4 15.1 4 12 4zm0 3a5 5 0 110 10 5 5 0 010-10zm0 1.8a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4zm5.2-2.2a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
      </svg>
    )
  if (name === 'youtube')
    return (
      <svg {...common}>
        <path d="M23 7.5s-.2-1.5-.9-2.2c-.8-.9-1.7-.9-2.1-1C16.9 4 12 4 12 4s-4.9 0-8 .3c-.4.1-1.3.1-2.1 1C1.2 6 1 7.5 1 7.5S.7 9.3.7 11v1.6c0 1.7.3 3.5.3 3.5s.2 1.5.9 2.2c.8.9 1.9.8 2.4.9 1.8.2 7.7.3 7.7.3s4.9 0 8-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.2.9-2.2s.3-1.8.3-3.5V11c0-1.7-.3-3.5-.3-3.5zM9.7 14.4V8.7l6.4 2.9-6.4 2.8z" />
      </svg>
    )
  if (name === 'linkedin')
    return (
      <svg {...common}>
        <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.3 18.3v-7.6H5.7v7.6h2.6zM7 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11.3 8.8v-4.2c0-2.2-1.2-3.3-2.8-3.3-1.3 0-1.9.7-2.2 1.2v-1H10.7v7.6h2.6V14c0-1.1.2-2.1 1.5-2.1 1.3 0 1.3 1.2 1.3 2.2v4.2h2.2z" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M20 3.5A11.7 11.7 0 003.4 20.1L2 22l1.9-1.4A11.7 11.7 0 1020 3.5zm-8 18.4a9.5 9.5 0 01-4.9-1.3l-.4-.2-2.9.7.8-2.9-.2-.4A9.5 9.5 0 1112 21.9zm5.4-7.1c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8.9-.9 1.1-.2.2-.4.2-.7.1-1.5-.7-2.5-1.3-3.5-2.9-.3-.4.3-.4.8-1.4.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.2.3 2 3.1 4.9 4.4 1.8.7 2.5.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.2-.2-.6-.4z" />
    </svg>
  )
}

export default function Footer() {
  const socials = [
    { key: 'facebook', url: config.social.facebook },
    { key: 'instagram', url: config.social.instagram },
    { key: 'youtube', url: config.social.youtube },
    { key: 'linkedin', url: config.social.linkedin },
  ] as const

  const whatsappUrl = `https://wa.me/${config.contact.whatsappE164}`
  const visibleSocials = socials.filter(s => s.url)

  return (
    <footer className="mt-12 border-t border-black/5 bg-white/40">
      <div className="px-5 py-8 space-y-6">
        <div>
          <h4 className="font-serif text-base text-[var(--color-primary)] mb-1">
            {config.brand.name}
          </h4>
          <p className="text-sm text-[var(--color-text)]/70 leading-relaxed">
            Mindfulness y gestión emocional para entornos de alta presión.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-semibold mb-2 uppercase tracking-wide text-[var(--color-text)]/60">
            Contacto
          </h5>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:underline"
          >
            <Icon name="whatsapp" />
            WhatsApp {config.contact.whatsappNumber}
          </a>
          {config.contact.email && (
            <div className="mt-2">
              <a
                href={`mailto:${config.contact.email}`}
                className="text-sm text-[var(--color-text)]/70 hover:text-[var(--color-primary)]"
              >
                {config.contact.email}
              </a>
            </div>
          )}
        </div>

        {visibleSocials.length > 0 && (
          <div>
            <h5 className="text-xs font-semibold mb-2 uppercase tracking-wide text-[var(--color-text)]/60">
              Redes
            </h5>
            <div className="flex gap-3">
              {visibleSocials.map(s => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.key}
                  className="w-10 h-10 grid place-items-center rounded-full bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                >
                  <Icon name={s.key} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-black/5">
        <div className="px-5 py-3 flex flex-col gap-1 text-[11px] text-[var(--color-text)]/55">
          <span>© {new Date().getFullYear()} {config.brand.name}</span>
          <a href={config.website} target="_blank" rel="noreferrer" className="hover:text-[var(--color-primary)]">
            {config.website.replace(/^https?:\/\//, '')}
          </a>
        </div>
      </div>
    </footer>
  )
}
