import type { LegalSection } from '@/components/landing/LegalDocument'

export const privacyMeta = {
  effectiveDate: 'September 15, 2026',
  lastUpdated: 'September 15, 2026',
}

export const privacyIntro = [
  'YetiWize respects your privacy and is committed to being transparent about how your information is handled.',
  'This Privacy Policy explains what information YetiWize may access, how information is used and stored, when information may be shared, the choices available to you, and how you can contact us regarding privacy.',
  'By downloading, installing, accessing, or using YetiWize, you acknowledge the practices described in this Privacy Policy.',
  'For privacy-related questions, contact casualcommmits@yetiwize.com or visit yetiwize.com.',
]

export const privacySections: LegalSection[] = [
  {
    title: '1. About YetiWize',
    paragraphs: [
      'YetiWize is a personal finance management application designed to help users manage their own financial records.',
      'YetiWize is a personal record-keeping tool. It is not a bank, financial institution, payment processor, investment service, lender, or financial adviser.',
      'Unless a future feature clearly states otherwise, YetiWize does not connect directly to your bank account and does not transfer, hold, deposit, withdraw, or manage real-world funds.',
    ],
    bullets: [
      'Record income and expenses',
      'Categorize transactions',
      'Manage multiple wallets',
      'Monitor balances',
      'Create daily and monthly spending limits',
      'Create budgets',
      'Set savings goals',
      'Track savings progress',
      'Review transaction history',
      'Add notes or other information to transactions',
      'Monitor personal spending habits',
    ],
  },
  {
    title: '2. Information You Enter Into YetiWize',
    paragraphs: [
      'Depending on the features you use, you may enter financial records that you manually provide to the application.',
      'YetiWize does not independently verify whether the financial information you enter is accurate.',
    ],
    bullets: [
      'Transaction amounts, descriptions, income records, and expense records',
      'Expense categories, wallet names, and wallet balances',
      'Budget amounts, spending limits, savings goals, and savings progress',
      'Dates and notes associated with transactions',
      'Other financial records you choose to enter',
    ],
  },
  {
    title: '3. Local and Offline-First Data Storage',
    paragraphs: [
      'YetiWize is designed around an offline-first approach. Personal financial records created inside the app are intended to be stored locally on your device unless a feature explicitly informs you otherwise.',
      'Where information remains entirely on your device and is not transmitted by YetiWize to an external server, we do not receive or have access to that information.',
    ],
    bullets: [
      'Transactions, wallets, balances, budgets, and spending limits',
      'Savings goals, categories, preferences, and other app records',
    ],
  },
  {
    title: '4. Financial Information',
    paragraphs: [
      'YetiWize allows you to manually record information relating to your personal finances, including amounts you have earned, spent, saved, or allocated to wallets or budgets.',
      'You should never enter passwords, PINs, OTPs, recovery codes, or other banking security credentials into transaction descriptions, notes, or any other YetiWize field.',
    ],
    bullets: [
      'YetiWize does not require online banking passwords, debit card PINs, credit card PINs, ATM PINs, banking OTPs, or online banking authentication credentials',
    ],
  },
  {
    title: '5. Bank Accounts and Payment Processing',
    paragraphs: [
      'YetiWize is currently intended to operate as a personal financial record-keeping application rather than a banking service.',
      'A wallet shown inside YetiWize is a record used for organization and tracking. It does not represent a financial account held by YetiWize.',
    ],
    bullets: [
      'YetiWize does not hold your money, transfer your money, process banking transactions, issue payment cards, provide loans, execute investments, or guarantee financial returns',
    ],
  },
  {
    title: '6. Account Information',
    paragraphs: [
      'If the current version of YetiWize does not require an account, we do not require you to provide personal information such as your name, email address, or phone number simply to maintain your locally stored financial records.',
      'If account functionality, synchronization, backups, or other online services are introduced in the future, this Privacy Policy will be updated to explain what account information is collected and how it is handled.',
    ],
  },
  {
    title: '7. Device Permissions',
    paragraphs: [
      'Certain features may require access to device capabilities. YetiWize will only request permissions that are reasonably necessary for features available in the app.',
      'For example, if YetiWize provides a receipt or attachment feature, you may choose to select or capture an image associated with a transaction.',
      'Where possible, YetiWize should use platform-provided selectors that allow you to choose specific content rather than providing unrestricted access to your device.',
      'You can manage app permissions through your Android device settings. Disabling a permission may prevent the related feature from functioning but should not affect unrelated features.',
    ],
  },
  {
    title: '8. Automatically Collected Information',
    paragraphs: [
      'The current privacy design of YetiWize focuses on minimizing unnecessary data collection.',
      'However, software platforms or third-party components incorporated into an app may process certain technical information necessary to provide their services.',
      "YetiWize's Google Play Data Safety disclosure will reflect the behavior of the version of the app currently distributed.",
    ],
    bullets: [
      'Device type, operating system version, and app version',
      'Crash information, diagnostic information, technical identifiers, and performance information',
    ],
  },
  {
    title: '9. Analytics',
    paragraphs: [
      'YetiWize aims to minimize unnecessary tracking.',
      'If analytics services are introduced, this Privacy Policy will be updated to describe the analytics provider, information processed, why it is processed, whether information is linked to users, and applicable choices available to users.',
    ],
  },
  {
    title: '10. Advertising',
    paragraphs: [
      'The current Privacy Policy should reflect the version of YetiWize that you actually distribute.',
      'If YetiWize does not display advertising, no advertising SDK should be described as active.',
      'If advertising is introduced in the future, this Privacy Policy and the Google Play Data Safety declaration will be updated before or alongside that change.',
    ],
  },
  {
    title: '11. Crash Reporting',
    paragraphs: [
      'If YetiWize uses a crash-reporting service in a future or current release, limited technical information may be processed to identify crashes, diagnose technical problems, improve stability, and fix software bugs.',
      'The specific provider and data categories should be reflected in this policy whenever such a service is enabled.',
    ],
  },
  {
    title: '12. How We Use Information',
    paragraphs: [
      'Where YetiWize processes information, it is used only for legitimate application purposes.',
      'We do not intend to use personal financial records for unrelated advertising or profiling without appropriate disclosure and, where required, consent.',
    ],
    bullets: [
      'Providing requested app functionality and recording transactions',
      'Calculating balances, managing wallets, calculating budgets, and enforcing optional spending limits',
      'Tracking savings progress and saving application preferences',
      'Maintaining application functionality, diagnosing technical problems, and protecting against misuse',
      'Improving app reliability and performance',
    ],
  },
  {
    title: '13. Sharing of Information',
    paragraphs: [
      'We do not sell your personal financial information. We do not rent your transaction history to advertisers. We do not intentionally provide your locally stored financial records to data brokers.',
      'Any future service that requires transmission of your financial records will be disclosed appropriately.',
    ],
    bullets: [
      'With a service provider required to operate a feature you have chosen to use',
      'When required by applicable law or valid legal process',
      'To investigate fraud, abuse, or security threats',
      'To protect our legal rights or the safety of users',
      'As part of a merger, acquisition, restructuring, or transfer of the application, subject to applicable law',
    ],
  },
  {
    title: '14. Selling Personal Data',
    paragraphs: [
      'YetiWize does not sell users\' manually entered transaction, wallet, budget, or savings information.',
      'We also do not intend to exchange that information with third parties in return for monetary consideration.',
    ],
  },
  {
    title: '15. Data Retention',
    paragraphs: [
      'Locally stored application information generally remains on your device until you delete the relevant information within the app, clear the application\'s data, uninstall the application, your operating system removes application data, the device is reset, or another action removes the local database.',
      'If future YetiWize services store information on external servers, appropriate retention periods will be established and disclosed.',
    ],
  },
  {
    title: '16. Deleting Your Data',
    paragraphs: [
      'Because personal finance records are primarily designed to be stored locally, you can generally remove those records by deleting them through available app controls or by clearing or uninstalling the application.',
      'On Android, uninstalling an application generally removes its local application data, subject to Android backup settings and operating-system behavior.',
      'If YetiWize later introduces user accounts or cloud-stored personal information, we will provide appropriate account and data deletion mechanisms as required.',
    ],
  },
  {
    title: '17. Device Backups',
    paragraphs: [
      'Your operating system, device manufacturer, Google account settings, or another backup service may independently back up application information.',
      'Such backups may operate outside YetiWize\'s direct control. You should review the backup settings on your device if you do not want application information included in device backups.',
    ],
  },
  {
    title: '18. Data Security',
    paragraphs: [
      'We take reasonable measures when designing YetiWize to protect information handled by the application. However, no device, database, software system, or method of electronic storage can be guaranteed to be completely secure.',
      'You are responsible for maintaining the physical and digital security of your device. You should not use YetiWize as your only permanent record of important financial information.',
    ],
    bullets: [
      'Use a secure screen lock and strong device PIN or password',
      'Use biometric protection where available',
      'Keep your operating system up to date and install trusted applications only',
    ],
  },
  {
    title: '19. Data Loss',
    paragraphs: [
      'Because YetiWize may store records locally, information could be lost if you uninstall YetiWize, clear application storage, your device becomes damaged, is lost or stolen, the operating system corrupts application storage, you reset or replace the device, or a software failure occurs.',
      'YetiWize cannot guarantee recovery of locally stored records. Users should maintain appropriate independent records or backups of information they consider important.',
    ],
  },
  {
    title: '20. Children\'s Privacy',
    paragraphs: [
      'YetiWize is intended as a general personal finance utility and is not specifically designed to collect personal information from children.',
      'We do not knowingly seek to collect personal information from children in violation of applicable laws.',
      'If you believe a child has provided personal information to us improperly, contact casualcommmits@yetiwize.com. We will investigate reasonable requests and take appropriate action when required.',
    ],
  },
  {
    title: '21. International Users',
    paragraphs: [
      'YetiWize may be available to users in multiple countries. Privacy, consumer protection, and data protection laws differ by jurisdiction.',
      'Where applicable law provides users with mandatory rights that cannot be waived by this Privacy Policy, those rights continue to apply.',
    ],
  },
  {
    title: '22. Your Privacy Rights',
    paragraphs: [
      'Depending on where you live and whether YetiWize actually holds personal data about you, applicable law may give you rights to request access, correction, deletion, restriction, objection, or information about processing, or to withdraw consent where processing is based on consent.',
      'For information stored only on your own device, YetiWize may not have access to that information and therefore may not technically be able to retrieve it on your behalf.',
      'Privacy requests may be sent to casualcommmits@yetiwize.com.',
    ],
  },
  {
    title: '23. Third-Party Platforms',
    paragraphs: [
      'YetiWize may be downloaded through third-party distribution platforms such as Google Play. Those platforms operate under their own privacy policies and terms.',
      'This activity is controlled by the relevant platform and is separate from information controlled by YetiWize.',
    ],
  },
  {
    title: '24. External Links',
    paragraphs: [
      'YetiWize or the YetiWize website may contain links to external websites.',
      'We are not responsible for the content, security practices, or privacy policies of third-party websites. You should review their policies before providing information.',
    ],
  },
  {
    title: '25. Changes to This Privacy Policy',
    paragraphs: [
      'YetiWize may evolve over time. We may update this Privacy Policy when new features are introduced, data practices change, new third-party services are added, legal requirements change, or security or operational practices change.',
      'The updated Privacy Policy will display a revised Last Updated date. Material changes may also be communicated through the app or website where appropriate.',
    ],
  },
  {
    title: '26. Contact Us',
    paragraphs: [
      'If you have questions, requests, or concerns relating to privacy or YetiWize\'s handling of information, contact YetiWize at yetiwize.com or casualcommmits@yetiwize.com.',
    ],
  },
]
