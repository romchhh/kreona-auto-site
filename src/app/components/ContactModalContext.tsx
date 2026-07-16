'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import ContactModal from './ContactModal'
import FloatingCtaButton from './FloatingCtaButton'
import type { CarInquiry } from '../lib/carInquiry'
import { useBodyScrollLock } from '../lib/useBodyScrollLock'

type ContactModalContextValue = {
  openForm: (car?: CarInquiry) => void
  closeForm: () => void
  formOpen: boolean
  inquiryCar: CarInquiry | null
}

const ContactModalContext = createContext<ContactModalContextValue | null>(null)

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [formOpen, setFormOpen] = useState(false)
  const [inquiryCar, setInquiryCar] = useState<CarInquiry | null>(null)

  const openForm = useCallback((car?: CarInquiry) => {
    setInquiryCar(car ?? null)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setInquiryCar(null)
  }, [])

  useBodyScrollLock(formOpen)

  return (
    <ContactModalContext.Provider value={{ openForm, closeForm, formOpen, inquiryCar }}>
      {children}
      <FloatingCtaButton />
      <ContactModal open={formOpen} onClose={closeForm} inquiryCar={inquiryCar} />
    </ContactModalContext.Provider>
  )
}

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  if (!ctx) throw new Error('useContactModal must be used within ContactModalProvider')
  return ctx
}
