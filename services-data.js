// FreshStart — Service content data
// Each entry: id, name, icon tag, blurb, requirements[], steps[], office{}

const SERVICES_DATA = [
  {
    id: "barangay-clearance",
    name: "Barangay Clearance",
    tag: "BH",
    blurb: "A basic clearance from your barangay confirming residency and good standing. Often required for school enrollment, jobs, and other local applications.",
    requirements: [
      "Valid government-issued ID (school ID accepted in many barangays)",
      "Proof of residency (utility bill, lease contract, or barangay residency record)",
      "Community Tax Certificate (Cedula) — some barangays issue this on the spot",
      "Accomplished barangay clearance application form",
      "Clearance fee (varies per barangay, usually small)"
    ],
    steps: [
      "Go to your barangay hall during office hours and ask for the clearance application form.",
      "Fill out the form with your complete name, address, and purpose of the clearance.",
      "Present your valid ID and proof of residency to the barangay staff.",
      "Pay the clearance fee at the counter or designated payment window.",
      "Wait for processing — this is usually released the same day.",
      "Claim your signed and sealed barangay clearance."
    ],
    office: {
      label: "Your local Barangay Hall",
      hours: "Typically Monday–Friday, 8:00 AM – 5:00 PM (hours vary per barangay)",
      note: "Bring your own ID and proof of residency. Confirm exact hours and fees with your barangay, since these differ by city and barangay.",
      link: "https://www.dilg.gov.ph",
      linkLabel: "DILG — Local Government Directory"
    }
  },
  {
    id: "philhealth",
    name: "PhilHealth Membership",
    tag: "PH",
    blurb: "National health insurance coverage. As a new member you'll get a PhilHealth Identification Number (PIN) used for hospital and clinic benefits.",
    requirements: [
      "PhilHealth Member Registration Form (PMRF) — downloadable from the PhilHealth website",
      "One valid government-issued ID",
      "PSA-issued Birth Certificate (for first-time registrants without an existing ID)",
      "Certificate of Enrollment or School ID (to register under the student/voluntary category, if applicable)"
    ],
    steps: [
      "Download and print the PMRF from the official PhilHealth website, or get a copy at any PhilHealth branch.",
      "Fill out the form completely and accurately — this becomes your permanent record.",
      "Submit the form with your valid ID at a PhilHealth branch, or register through the official Member Portal online.",
      "Receive your PhilHealth Identification Number (PIN) — this is your lifetime membership number.",
      "Keep your registration confirmation or Member Data Record (MDR) for future hospital or clinic visits."
    ],
    office: {
      label: "Nearest PhilHealth Local Health Insurance Office (LHIO)",
      hours: "Monday–Friday, 8:00 AM – 5:00 PM",
      note: "Online registration is also available through the PhilHealth Member Portal, which can save you a trip.",
      link: "https://www.philhealth.gov.ph",
      linkLabel: "PhilHealth Official Website"
    }
  },
  {
    id: "nbi-clearance",
    name: "NBI Clearance",
    tag: "NB",
    blurb: "A national police-record clearance, often required for employment, scholarships, travel documents, or government transactions.",
    requirements: [
      "Online NBI Clearance account (registered at the official NBI Clearance website)",
      "One valid government-issued ID for verification on appointment day",
      "Clearance fee, payable online or over the counter",
      "Confirmed appointment schedule and reference number"
    ],
    steps: [
      "Create an account on the official NBI Clearance website.",
      "Fill out your personal information accurately — this is matched against national records.",
      "Choose your preferred NBI branch and select an available appointment date and time.",
      "Pay the clearance fee online (or at accredited payment centers, depending on the option chosen).",
      "Go to the branch on your scheduled appointment with a valid ID for biometrics and photo capture.",
      "If there is no 'hit' (no matching record requiring further verification), claim your clearance the same day. If there is a hit, you may need to return for verification."
    ],
    office: {
      label: "Nearest NBI Clearance Center",
      hours: "Varies by branch; many operate Monday–Saturday",
      note: "Always book your appointment online first — walk-ins are limited or unavailable in many branches.",
      link: "https://clearance.nbi.gov.ph",
      linkLabel: "NBI Clearance Online Portal"
    }
  },
  {
    id: "sss",
    name: "SSS Registration",
    tag: "SS",
    blurb: "Social Security System coverage for working students and young professionals — covers sickness, maternity, disability, retirement, and other benefits.",
    requirements: [
      "PSA-issued Birth Certificate",
      "One valid government-issued ID",
      "Accomplished SSS Personal Record form (SS Form E-1) for first-time registrants",
      "My.SSS online account (for digital registration and tracking)"
    ],
    steps: [
      "Create a My.SSS account on the official SSS website if you don't have one yet.",
      "Accomplish the SS Form E-1 (Personal Record) if registering for the first time.",
      "Submit your form and documents at an SSS branch, or complete registration through the online portal where available.",
      "Receive your SSS number — this is your permanent identifier across employers and benefits.",
      "Keep your registration confirmation for future employment or benefit claims."
    ],
    office: {
      label: "Nearest SSS Branch",
      hours: "Monday–Friday, 8:00 AM – 5:00 PM",
      note: "Most first-time registrations can now be started online through My.SSS before any branch visit.",
      link: "https://www.sss.gov.ph",
      linkLabel: "SSS Official Website"
    }
  },
  {
    id: "tin",
    name: "TIN / BIR Registration",
    tag: "TN",
    blurb: "A Taxpayer Identification Number (TIN) is required for employment, business, and many government transactions, even for students taking on part-time work.",
    requirements: [
      "One valid government-issued ID",
      "PSA-issued Birth Certificate",
      "BIR Form 1904 (for one-time taxpayers or those registering without employment) or BIR Form 1902 (if employed)",
      "Proof of address (for determining your assigned Revenue District Office)"
    ],
    steps: [
      "Determine the Revenue District Office (RDO) that has jurisdiction over your home address.",
      "Accomplish the correct BIR form — Form 1904 for first-time/one-time registration, or Form 1902 if you have an employer.",
      "Submit your form and documents at your assigned RDO.",
      "Receive your Taxpayer Identification Number (TIN).",
      "Keep your TIN card or confirmation slip — you'll need this number for any future government or employment transaction."
    ],
    office: {
      label: "Your assigned BIR Revenue District Office (RDO)",
      hours: "Monday–Friday, 8:00 AM – 5:00 PM",
      note: "A TIN is issued only once per person for life — never apply for a second one, even if you switch jobs or schools.",
      link: "https://www.bir.gov.ph",
      linkLabel: "Bureau of Internal Revenue Website"
    }
  },
  {
    id: "voters-id",
    name: "Voter's Registration",
    tag: "VR",
    blurb: "Registering to vote lets incoming college students participate in local and national elections, and the registration record can also serve as a valid ID.",
    requirements: [
      "One valid government-issued or school ID",
      "Proof of residency in the city or municipality where you're registering",
      "Accomplished voter registration form (available at the COMELEC office)",
      "Personal appearance — biometrics (photo, signature, fingerprints) are captured on-site"
    ],
    steps: [
      "Check the official COMELEC website for the current registration schedule, since registration closes ahead of every election.",
      "Go to your local COMELEC Office of the Election Officer with your ID and proof of residency.",
      "Fill out the voter registration form on-site.",
      "Have your biometrics captured (photo, signature, and fingerprints).",
      "Wait for your application to be processed and approved by the Election Registration Board.",
      "Verify your registration status online once available."
    ],
    office: {
      label: "Local COMELEC Office of the Election Officer (city/municipal hall)",
      hours: "Monday–Friday, 8:00 AM – 5:00 PM (subject to registration period cut-offs)",
      note: "Registration is suspended close to election periods — check COMELEC announcements for current openings.",
      link: "https://comelec.gov.ph",
      linkLabel: "COMELEC Official Website"
    }
  },
  {
    id: "scholarship",
    name: "Scholarship Application",
    tag: "SC",
    blurb: "National (CHED) and local government scholarships can cover tuition and provide allowances for qualified incoming and continuing college students.",
    requirements: [
      "Certificate of Registration or Enrollment from your college",
      "Income Tax Return of parents/guardians, or Certificate of Indigency if unemployed",
      "Form 138 (Report Card) or latest transcript of records",
      "Certificate of Good Moral Character",
      "Accomplished scholarship application form",
      "Recommendation letter, if required by the specific program"
    ],
    steps: [
      "Check eligibility and open application periods on the CHED Scholarship portal or your local government's (city/provincial) scholarship office.",
      "Gather all required documents ahead of the deadline — income proof and school records take the longest to process.",
      "Submit your complete application within the posted deadline, either online or in person depending on the program.",
      "Wait for evaluation and, if required, attend an interview or submit additional documents.",
      "Monitor announcements for results and the schedule for fund or stipend release."
    ],
    office: {
      label: "CHED Regional Office or your City/Provincial Scholarship Office",
      hours: "Monday–Friday, 8:00 AM – 5:00 PM",
      note: "Application windows are seasonal — apply as early as the period opens, since slots are often limited.",
      link: "https://ched.gov.ph",
      linkLabel: "CHED Official Website"
    }
  }
];
