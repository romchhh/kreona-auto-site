'use client'
import { useEffect } from 'react'
import { captureUtmFromUrl } from '../lib/utm'

/** Saves UTM params from the URL into sessionStorage for later form submissions. */
export default function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl()
  }, [])

  return null
}
