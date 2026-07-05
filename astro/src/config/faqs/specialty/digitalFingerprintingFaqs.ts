import { FAQ } from '../../../types/faq';

export const digitalFingerprintingFaqs: FAQ[] = [
  {
    id: 'fingerprint-vs-namecheck',
    question: 'Why is a fingerprint-based background check better than a name search?',
    answer:
      'Fingerprint-based checks are the most reliable and comprehensive because they match directly against state and federal criminal records. Unlike name-only searches, fingerprints cannot be falsified, reducing the hiring risk and ensuring more accurate results.',
    category: 'Background Checks',
    tags: ['fingerprinting', 'background-checks', 'security'],
    isFeatured: true,
    order: 1,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'livescan-process',
    question: 'What is Live Scan fingerprinting and how does it work?',
    answer:
      'Live Scan is an electronic fingerprinting system that captures high-resolution digital prints in less than 5 minutes. Using SafePrintScan software and National WebCheck (NWC), FastFingerprints transmits your prints securely to state or federal agencies, avoiding errors and delays common with ink cards.',
    category: 'Technology',
    tags: ['livescan', 'safeprintscan', 'digital'],
    order: 2,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'safeprintscan',
    question: 'What is SafePrintScan?',
    answer:
      'SafePrintScan is FastFingerprints’ proprietary software used with Live Scan systems. It ensures secure, encrypted fingerprint submissions to state and federal databases, provides storage and retrieval for digital records, and virtually eliminates processing errors.',
    category: 'Technology',
    tags: ['safeprintscan', 'software', 'security'],
    order: 3,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'fingerprint-card-service',
    question: 'Do you provide fingerprint cards?',
    answer:
      'Yes. For $35.00, fingerprints can be captured electronically and printed onto FD-258 fingerprint cards. This is useful for applications that require mailing fingerprint cards instead of electronic submission.',
    category: 'Services',
    tags: ['fingerprint-cards', 'FD-258', 'electronic'],
    order: 4,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'ohio-pricing',
    question: 'What are the costs for Ohio background checks?',
    answer:
      'Ohio background checks start at $40.00 for BCI-only. FBI-only checks are $52.00, and combined BCI & FBI checks are $72.00. Results are delivered through the secure Web Results portal.',
    category: 'Pricing',
    tags: ['Ohio', 'BCI', 'FBI', 'pricing'],
    order: 5,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'florida-pricing',
    question: 'What are the costs for Florida Level 2 background checks?',
    answer:
      'Florida Level 2 checks cost $75.00. With the AHCA-required photo included, the cost is $94.00. These checks search both state and FBI databases and are required for many licensing and employment positions.',
    category: 'Pricing',
    tags: ['Florida', 'FDLE', 'AHCA', 'Level 2'],
    order: 6,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'ohio-bci',
    question: 'What is an Ohio BCI check?',
    answer:
      'An Ohio BCI check is a state-level background check conducted by the Attorney General’s Office. It is required for employment, volunteer work, or licensing in Ohio. Results are securely delivered through the Web Results portal.',
    category: 'State Services',
    tags: ['Ohio', 'BCI', 'background-check'],
    order: 7,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'florida-level2',
    question: 'What is a Florida Level 2 background check?',
    answer:
      'A Florida Level 2 check is a fingerprint-based search of FDLE state records and the FBI database. It is required for positions such as childcare, healthcare, and licensing in Florida. FastFingerprints is FDLE-approved to perform these checks.',
    category: 'State Services',
    tags: ['Florida', 'FDLE', 'Level 2'],
    order: 8,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'fbi-channeler',
    question: 'What does it mean that FastFingerprints is an FBI-approved Channeler?',
    answer:
      'As an FBI Channeler, FastFingerprints can securely submit fingerprints to the FBI on behalf of authorized recipients. This service is used for expedited non-criminal justice purposes such as personal review, housing, or federally regulated industries.',
    category: 'FBI Services',
    tags: ['FBI', 'channeler', 'criminal-records'],
    isFeatured: true,
    order: 9,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'personal-fbi-checks',
    question: 'Can I request my own FBI background check?',
    answer:
      'Yes. Individuals may request a copy of their FBI record for personal review or correction under Departmental Order 556-73. This cannot be used for employment or licensing in the U.S. Results must be sent to a U.S. address.',
    category: 'Personal Checks',
    tags: ['FBI', 'personal-records', 'departmental-order'],
    order: 10,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'channeler-restrictions',
    question: 'Are there restrictions on FBI Channeling?',
    answer:
      'Yes. FBI Channeling cannot be used for U.S. employment or licensing purposes. Results cannot be shipped overseas and an apostille cannot be processed by Channelers. Only U.S. citizens or lawful permanent residents are eligible.',
    category: 'FBI Services',
    tags: ['restrictions', 'channeler', 'FBI'],
    order: 11,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'other-services',
    question: 'Do you offer services besides fingerprinting?',
    answer:
      'Yes. FastFingerprints also provides drug screening and name search background checks in addition to electronic fingerprinting services.',
    category: 'Services',
    tags: ['drug-screening', 'name-search', 'background-checks'],
    order: 12,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'storage-reuse',
    question: 'Can fingerprints be stored and reused later?',
    answer:
      'Yes. Digital records can be securely stored, searched, and retrieved. This allows employers to capture prints during the interview process and only pay when a candidate is hired.',
    category: 'Technology',
    tags: ['recordkeeping', 'fingerprinting', 'digital'],
    order: 13,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'process-time',
    question: 'How long does the fingerprinting process take?',
    answer:
      'The actual fingerprint capture takes less than 5 minutes. Results are typically available quickly depending on the agency or recipient.',
    category: 'Process',
    tags: ['fingerprinting', 'time', 'livescan'],
    order: 14,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'security',
    question: 'How secure is the fingerprint submission process?',
    answer:
      'All fingerprints are submitted electronically through encrypted channels using the National WebCheck system. This ensures secure, confidential, and accurate processing.',
    category: 'Security',
    tags: ['security', 'encryption', 'safe'],
    order: 15,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'appointments',
    question: 'Do I need an appointment for fingerprinting?',
    answer:
      'Yes. Appointments must be made online at [register.fastfingerprints.com](https://register.fastfingerprints.com/account-entry). Walk-ins are not accepted.',
    category: 'Appointments',
    tags: ['appointments', 'fingerprinting', 'schedule'],
    isFeatured: true,
    order: 16,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'reschedule',
    question: 'Can I cancel or reschedule my appointment?',
    answer:
      'Yes. You can cancel or reschedule your fingerprinting appointment online at [fastfingerprints.com/cancel-appointment](https://www.fastfingerprints.com/cancel-appointment/).',
    category: 'Appointments',
    tags: ['appointments', 'cancel', 'reschedule'],
    order: 17,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'status-receipt',
    question: 'How can I check my background check status or get my receipt?',
    answer:
      'You can check the status of your background check or retrieve your receipt online at [fastfingerprints.com/check-my-status](https://www.fastfingerprints.com/check-my-status/).',
    category: 'Results',
    tags: ['status', 'receipt', 'results'],
    order: 18,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'out-of-state',
    question: 'Can out-of-state applicants use your services?',
    answer:
      'Yes. FastFingerprints has a nationwide network of Live Scan locations, making it possible for applicants outside Ohio or Florida to complete fingerprinting services.',
    category: 'Nationwide',
    tags: ['out-of-state', 'nationwide', 'fingerprinting'],
    order: 19,
    lastUpdated: '2025-10-03',
  },
  {
    id: 'location',
    question: 'Where is Mailbox Plus located for fingerprinting services?',
    answer:
      'We are located in Gristmill Village, next to Pub Frato in Concord Township, Ohio. Our store provides convenient access to FastFingerprints services for Lake County residents, including Mentor, Painesville, and Eastlake.',
    category: 'Local Info',
    tags: ['Concord Township', 'location', 'Lake County'],
    order: 20,
    lastUpdated: '2025-10-03',
  },
];
