import { LegalDocument } from '@/components/landing/LegalDocument'
import { termsIntro, termsMeta, termsSections } from '@/content/terms'

export function TermsPage() {
  return (
    <LegalDocument
      title="Terms and Conditions"
      effectiveDate={termsMeta.effectiveDate}
      lastUpdated={termsMeta.lastUpdated}
      intro={termsIntro}
      sections={termsSections}
    />
  )
}
