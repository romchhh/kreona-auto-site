type SectionHeadingProps = {
  title: React.ReactNode
  lead?: React.ReactNode
}

export function SectionHeading({ title, lead }: SectionHeadingProps) {
  return (
    <div className="section-intro">
      <h2 className="section-heading">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  )
}
