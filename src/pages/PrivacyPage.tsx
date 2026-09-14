import { LegalDocument } from '@/components/landing/LegalDocument'
import { privacyIntro, privacyMeta, privacySections } from '@/content/privacy'

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      effectiveDate={privacyMeta.effectiveDate}
      lastUpdated={privacyMeta.lastUpdated}
      intro={privacyIntro}
      sections={privacySections}
    />
  )
}
