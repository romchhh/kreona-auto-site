'use client'

import { useEffect } from 'react'

let lockCount = 0
let savedScrollY = 0
let savedBody = {
  overflow: '',
  paddingRight: '',
  position: '',
  top: '',
  left: '',
  right: '',
  width: '',
}
let savedHtmlOverflow = ''

function lockBody() {
  if (lockCount === 0) {
    const { body } = document
    const html = document.documentElement
    const scrollbarGap = window.innerWidth - html.clientWidth

    savedScrollY = window.scrollY
    savedBody = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    }
    savedHtmlOverflow = html.style.overflow

    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    body.style.position = 'fixed'
    body.style.top = `-${savedScrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`
    }
  }

  lockCount += 1
}

function unlockBody() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return

  const { body } = document
  const html = document.documentElement

  body.style.overflow = savedBody.overflow
  body.style.paddingRight = savedBody.paddingRight
  body.style.position = savedBody.position
  body.style.top = savedBody.top
  body.style.left = savedBody.left
  body.style.right = savedBody.right
  body.style.width = savedBody.width
  html.style.overflow = savedHtmlOverflow

  window.scrollTo(0, savedScrollY)
}

/** Locks page scroll while `locked` is true. Safe with multiple concurrent locks. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    lockBody()
    return () => unlockBody()
  }, [locked])
}
