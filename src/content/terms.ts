import type { LegalSection } from '@/components/landing/LegalDocument'

export const termsMeta = {
  effectiveDate: 'September 15, 2026',
  lastUpdated: 'September 15, 2026',
}

export const termsIntro = [
  'These Terms and Conditions ("Terms") govern your access to and use of the YetiWize mobile application, website, and related services.',
  'Throughout these Terms, "YetiWize," "we," "us," and "our" refer to the developer/operator of YetiWize. "You" and "user" refer to any person who accesses or uses YetiWize.',
  'By downloading, installing, or using YetiWize, you agree to these Terms. If you do not agree with these Terms, do not use YetiWize.',
]

export const termsSections: LegalSection[] = [
  {
    title: '1. Description of YetiWize',
    paragraphs: ['YetiWize is a personal finance tracking and organization application. Features may be added, modified, or removed over time.'],
    bullets: [
      'Expense tracking and income tracking',
      'Transaction categorization and multiple wallets',
      'Budget planning, spending limits, and savings goals',
      'Savings progress, transaction history, and personal finance summaries',
    ],
  },
  {
    title: '2. Not a Bank or Financial Institution',
    paragraphs: [
      'YetiWize is not a bank, wallet provider, financial institution, money-transfer service, investment adviser, broker, lender, accounting firm, or payment processor.',
      'Balances displayed in YetiWize represent information entered or calculated within the app. They do not represent funds held by YetiWize.',
    ],
    bullets: [
      'YetiWize cannot hold your funds, withdraw your money, deposit money into your accounts, transfer funds between banks, guarantee your account balances, execute investments, provide credit, or guarantee savings or financial outcomes',
    ],
  },
  {
    title: '3. No Financial Advice',
    paragraphs: [
      'Information presented through YetiWize is provided for personal organization and informational purposes only.',
      'You remain responsible for your own financial decisions. For professional advice, consult an appropriately qualified adviser.',
    ],
    bullets: [
      'Nothing provided by YetiWize constitutes financial, investment, tax, legal, accounting, credit, or professional financial planning advice',
    ],
  },
  {
    title: '4. User-Entered Information',
    paragraphs: [
      'You are responsible for the accuracy of information you enter into YetiWize.',
      'YetiWize may calculate balances, spending totals, savings progress, and budgets based on the information you provide. Incorrect or incomplete input may produce incorrect calculations.',
      'We do not guarantee that displayed balances match balances held by your bank, wallet provider, financial institution, or other service.',
    ],
  },
  {
    title: '5. Eligibility',
    paragraphs: [
      'You must have the legal capacity required under applicable law to agree to these Terms.',
      'If you are legally a minor in your jurisdiction, you may only use YetiWize to the extent permitted by applicable law and with parental or guardian involvement where required.',
    ],
  },
  {
    title: '6. License to Use YetiWize',
    paragraphs: [
      'Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, revocable license to use YetiWize for lawful personal purposes.',
      'You do not acquire ownership of the application, source code, branding, designs, intellectual property, or underlying technologies.',
    ],
  },
  {
    title: '7. Acceptable Use',
    paragraphs: ['You agree not to misuse YetiWize. Nothing in these Terms restricts rights granted to you by applicable open-source software licenses or mandatory law.'],
    bullets: [
      'Use YetiWize for unlawful purposes or attempt to interfere with application security',
      'Attempt unauthorized access to YetiWize systems or circumvent technical restrictions',
      'Distribute malicious code, use automated systems to abuse online infrastructure, or impersonate another person',
      'Misrepresent your relationship with YetiWize or copy/redistribute proprietary parts except where permitted by law',
      'Attempt to exploit vulnerabilities in YetiWize or associated infrastructure',
    ],
  },
  {
    title: '8. Ownership',
    paragraphs: [
      'YetiWize and its original content are owned by or licensed to the YetiWize developer and are protected by applicable intellectual property laws.',
      'Third-party trademarks remain the property of their respective owners.',
    ],
    bullets: [
      'Branding, logos, user interface designs, graphics, mascots, application design, software, documentation, website materials, and original text',
    ],
  },
  {
    title: '9. Your Content and Records',
    paragraphs: [
      'You retain responsibility for financial records and other information you create within YetiWize.',
      'By entering information locally in the app, you do not transfer ownership of those records to YetiWize.',
      'If future functionality requires sending content to YetiWize servers solely to provide a requested service, you grant us the limited rights reasonably necessary to process that content for that purpose.',
    ],
  },
  {
    title: '10. Data Storage',
    paragraphs: [
      'YetiWize may store personal finance records locally on your device. You are responsible for protecting your device and maintaining copies of information that you cannot afford to lose.',
    ],
    bullets: [
      'We cannot guarantee that locally stored information will survive uninstallation, device resets, device failures, operating-system errors, accidental deletion, data corruption, device loss or theft, or updates or migrations',
    ],
  },
  {
    title: '11. Backup and Recovery',
    paragraphs: [
      'Unless YetiWize explicitly provides a backup or synchronization feature, you should not assume that your app records are stored remotely.',
      'YetiWize does not guarantee recovery of deleted or lost locally stored data.',
    ],
  },
  {
    title: '12. Application Availability',
    paragraphs: [
      'We aim to keep YetiWize functional, but we do not guarantee uninterrupted availability.',
    ],
    bullets: [
      'Maintenance, software updates, technical failures, operating-system changes, third-party service interruptions, security issues, or events beyond our reasonable control',
    ],
  },
  {
    title: '13. Updates',
    paragraphs: [
      'We may release updates to add features, remove features, fix bugs, improve security, improve performance, maintain compatibility, or satisfy legal or platform requirements.',
      'Some updates may be necessary for continued use of YetiWize.',
    ],
  },
  {
    title: '14. Changes to Features',
    paragraphs: [
      'We reserve the right to modify, redesign, discontinue, or replace application features.',
      'We cannot guarantee that a particular feature will remain available indefinitely.',
    ],
  },
  {
    title: '15. Free and Paid Features',
    paragraphs: [
      'YetiWize may currently be offered without charge. We reserve the right to introduce optional premium features, subscriptions, or other paid services in the future.',
      'If paid functionality is introduced, pricing will be displayed before purchase, applicable store/payment terms will be presented, users will not be charged merely because a future paid feature exists, and existing rights required by consumer law will be respected.',
    ],
  },
  {
    title: '16. Third-Party Services',
    paragraphs: [
      'YetiWize may depend on services supplied by third parties. Their services may be governed by their own terms and privacy policies.',
      'We are not responsible for interruptions caused solely by third-party services beyond our reasonable control.',
    ],
    bullets: [
      'Mobile operating systems, app stores, hosting providers, crash-reporting services, analytics providers, notification providers, and other technology providers',
    ],
  },
  {
    title: '17. Google Play',
    paragraphs: [
      'If you obtain YetiWize through Google Play, your use of Google Play is also governed by Google\'s applicable terms.',
      'Google is not responsible for operating or supporting YetiWize except to the extent required under Google\'s own terms or applicable law.',
    ],
  },
  {
    title: '18. No Guarantee of Financial Results',
    paragraphs: [
      'Using an expense tracker or budget planner does not guarantee that you will save money, avoid debt, improve your credit, increase income, meet a budget, reach a savings goal, or achieve any particular financial outcome.',
      'Results depend on your circumstances and decisions.',
    ],
  },
  {
    title: '19. Accuracy of Calculations',
    paragraphs: [
      'We aim to provide accurate calculations, but software can contain errors.',
      'Before making important financial decisions, independently verify important balances, totals, budget amounts, savings calculations, and transaction information.',
      'Do not rely exclusively on YetiWize for legally, financially, or professionally critical records.',
    ],
  },
  {
    title: '20. Disclaimer of Warranties',
    paragraphs: [
      'To the maximum extent permitted by law, YetiWize is provided on an "as is" and "as available" basis.',
      'Nothing in this clause excludes warranties or consumer rights that cannot legally be excluded.',
    ],
    bullets: [
      'We do not warrant that YetiWize will always be error-free, uninterrupted, completely secure, compatible with every device, accurate in all circumstances, free from data loss, or available indefinitely',
    ],
  },
  {
    title: '21. Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by applicable law, YetiWize and its developer will not be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use YetiWize.',
      'Nothing in these Terms limits liability where limiting liability would be prohibited by applicable law.',
    ],
    bullets: [
      'Lost application data, incorrect entries, incorrect financial decisions, lost devices, device malfunction, software errors, missed savings targets, reliance on displayed calculations, or third-party failures',
    ],
  },
  {
    title: '22. Indemnification',
    paragraphs: [
      'To the extent permitted by applicable law, you agree to be responsible for claims resulting from your unlawful misuse of YetiWize or material violation of these Terms.',
      'This section does not require consumers to waive statutory protections that cannot legally be waived.',
    ],
  },
  {
    title: '23. Suspension or Termination',
    paragraphs: [
      'We may restrict access to online portions of YetiWize where reasonably necessary because of fraud, security threats, illegal activity, abuse of infrastructure, or serious violation of these Terms.',
      'You may stop using YetiWize at any time. If YetiWize operates entirely locally, uninstalling the application ends your use of the installed application.',
    ],
  },
  {
    title: '24. Privacy',
    paragraphs: [
      'Use of YetiWize is also subject to the YetiWize Privacy Policy.',
      'The Privacy Policy explains how information is handled and should be read together with these Terms.',
    ],
  },
  {
    title: '25. Changes to These Terms',
    paragraphs: [
      'We may update these Terms when YetiWize changes, new functionality is introduced, business practices change, applicable laws change, or platform requirements change.',
      'The latest version will include an updated effective or revision date. Material changes may be communicated through the application or website where appropriate.',
    ],
  },
  {
    title: '26. Severability',
    paragraphs: [
      'If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue in effect to the extent permitted by law.',
    ],
  },
  {
    title: '27. No Waiver',
    paragraphs: [
      'Our failure to enforce a provision of these Terms does not automatically waive our right to enforce that provision later.',
    ],
  },
  {
    title: '28. Entire Agreement',
    paragraphs: [
      'These Terms, together with the Privacy Policy and any additional terms presented for specific services, represent the agreement governing your use of YetiWize to the extent permitted by law.',
    ],
  },
  {
    title: '29. Governing Law',
    paragraphs: [
      'These Terms will be governed by the laws applicable to the developer/operator of YetiWize, subject to mandatory consumer-protection rights that may apply in the user\'s country of residence.',
      'Before publishing, this section should be replaced with the specific country or state of your legal developer entity.',
    ],
  },
  {
    title: '30. Dispute Resolution',
    paragraphs: [
      'If you have a concern about YetiWize, please contact us first so that we can attempt to resolve the issue informally.',
      'Nothing in these Terms removes rights to pursue remedies through courts, consumer-protection authorities, or other mechanisms where such rights are guaranteed by applicable law.',
      'Contact casualcommmits@yetiwize.com.',
    ],
  },
  {
    title: '31. Contact Information',
    paragraphs: [
      'Questions about YetiWize or these Terms can be sent to YetiWize at yetiwize.com or casualcommmits@yetiwize.com.',
    ],
  },
]
