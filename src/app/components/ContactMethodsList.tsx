import type { ReactNode } from 'react'
import { BRAND, SOCIAL_LINKS } from '../brand'
import { phoneTel } from '../seo'
import styles from './ContactSection.module.css'

function ContactMethodIcon({ type }: { type: 'phone' | 'email' | 'instagram' | 'location' | 'whatsapp' }) {
  const iconClass = styles.contactMethodIcon

  switch (type) {
    case 'phone':
      return (
        <span className={iconClass} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
      )
    case 'email':
      return (
        <span className={iconClass} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v16H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </span>
      )
    case 'instagram':
      return (
        <span className={iconClass} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </span>
      )
    case 'whatsapp':
      return (
        <span className={iconClass} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.77 11.77 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.59 5.95L0 24l6.35-1.66a11.83 11.83 0 0 0 5.69 1.45h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.14-3.41-8.43Zm-8.47 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.77.99 1.01-3.68-.24-.38a9.85 9.85 0 0 1-1.51-5.24c0-5.45 4.44-9.89 9.9-9.89a9.8 9.8 0 0 1 7.01 2.91 9.83 9.83 0 0 1 2.89 7c0 5.46-4.44 9.9-9.88 9.9Zm5.43-7.43c-.3-.15-1.76-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.3-.76.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.45-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.79.38-.27.3-1.03 1-1.03 2.44s1.05 2.82 1.2 3.02c.15.2 2.06 3.15 4.99 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
          </svg>
        </span>
      )
    case 'location':
      return (
        <span className={iconClass} aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </span>
      )
  }
}

function ContactMethodItem({ children }: { children: ReactNode }) {
  return <span className={styles.contactMethodItem}>{children}</span>
}

export default function ContactMethodsList() {
  return (
    <ul className={styles.contactMethods}>
      <li>
        <a href={BRAND.mapLink} target="_blank" rel="noopener noreferrer">
          <ContactMethodIcon type="location" />
          {BRAND.address}, {BRAND.city}
        </a>
      </li>
      {BRAND.phones.map((phone) => (
        <li key={phone}>
          <ContactMethodItem>
            <a href={`tel:${phoneTel(phone)}`}>
              <ContactMethodIcon type="phone" />
              {phone}
            </a>
            <a
              href={`https://wa.me/${phoneTel(phone).replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ContactMethodIcon type="whatsapp" />
              WhatsApp
            </a>
          </ContactMethodItem>
        </li>
      ))}
      <li>
        <a href={`mailto:${BRAND.email}`}>
          <ContactMethodIcon type="email" />
          {BRAND.email}
        </a>
      </li>
      <li>
        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
          <ContactMethodIcon type="instagram" />
          @kreona.pl
        </a>
      </li>
    </ul>
  )
}
