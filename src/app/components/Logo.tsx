import type { SVGProps } from 'react'

export default function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 102 28"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <text
        x="0"
        y="22"
        fontFamily="var(--font-sans), Montserrat, Helvetica Neue, Arial, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="0.02em"
      >
        kreona
      </text>
    </svg>
  )
}
