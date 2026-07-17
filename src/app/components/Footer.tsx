'use client'
import { BRAND, SOCIAL_LINKS } from '../brand'
import { phoneTel } from '../seo'
import Logo from './Logo'
import { useDictionary, useLocale } from '../../i18n/LocaleProvider'
import { localePath } from '../../i18n/paths'
import styles from './Footer.module.css'

export default function Footer() {
  const dict = useDictionary()
  const locale = useLocale()

  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.bg} aria-hidden="true">
        <img
          src="/footer-bg.png"
          alt=""
          className={styles.bgImage}
        />
        <div className={styles.bgOverlay} />
        <div className={styles.bgFade} />
      </div>

      <div className={styles.content}>
        <a href={localePath(locale)} className={styles.logoMark} aria-label={BRAND.shortName}>
          <Logo className={styles.logoImg} />
        </a>

        <div className={styles.mid}>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>{dict.footer.contacts}</h3>
            {BRAND.phones.map((phone) => (
              <div key={phone} className={styles.phoneRow}>
                <a href={`tel:${phoneTel(phone)}`} className={styles.colLink}>
                  {phone}
                </a>
                <a
                  href={`https://wa.me/${phoneTel(phone).replace('+', '')}`}
                  className={styles.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${dict.common.whatsapp} ${phone}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.59 5.95L0 24l6.35-1.66a11.83 11.83 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.14-3.41-8.43Zm-8.47 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.85 9.85 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89a9.8 9.8 0 0 1 7.01 2.91 9.83 9.83 0 0 1 2.89 7c0 5.46-4.44 9.9-9.88 9.9Zm5.43-7.43c-.3-.15-1.76-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.45-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.38-.27.3-1.03 1-1.03 2.44s1.05 2.82 1.2 3.02c.15.2 2.06 3.15 4.99 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
                  </svg>
                </a>
              </div>
            ))}
            <a href={`mailto:${BRAND.email}`} className={styles.colLink}>
              {BRAND.email}
            </a>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>{dict.footer.social}</h3>
            <a
              href={SOCIAL_LINKS.instagram}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{dict.footer.copyright} {new Date().getFullYear()}</span>
          <div className={styles.bottomRight}>
            <a href={localePath(locale, '/polityka')}>{dict.footer.policy}</a>
            <a
              href="https://telebots.site/en"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.devCredit}
              aria-label={dict.footer.devAria}
            >
              <img
                src="/telebots-logo.png"
                alt="TeleBots"
                width={36}
                height={36}
                className={styles.devLogo}
              />
              <span className={styles.devText}>
                <span className={styles.devLabel}>{dict.footer.devLabel}</span>
                <span className={styles.devName}>TeleBots</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
