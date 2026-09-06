/**
 * Employment history.
 *
 * Titles, dates, durations and locations are taken verbatim from the LinkedIn
 * profile so the site and the profile never disagree — that mismatch is one of
 * the first things a recruiter notices.
 *
 * Nityom is modelled as one company with three roles because that is what it
 * was: an internship, a second internship, then a permanent job. Flattening it
 * into three separate entries would read as three short jobs rather than a
 * two-and-a-third-year progression at one employer.
 *
 * `note` is yours to write — one line on what you actually did there. Copy in
 * [square brackets] renders with a dotted underline until it is replaced.
 */

export interface Role {
  title: string;
  /** Full-time · Part-time · Internship */
  employment: string;
  /** e.g. "Jun 2026 — Present" */
  period: string;
  /** e.g. "4 mos" */
  duration: string;
  /** Remote · On-site · Hybrid. Omitted where it was never stated. */
  arrangement?: string;
  /** Named skills from the profile. Kept short — three at most. */
  skills?: string[];
  note: string;
}

export interface Position {
  company: string;
  /** Legal name, where it differs from how the company is known. */
  legalName?: string;
  location: string;
  /** Total time at the company, across all roles. */
  span: string;
  /** Total duration at the company. */
  duration: string;
  current?: boolean;
  roles: Role[];
}

export const experience: Position[] = [
  {
    company: 'SRIIO',
    location: 'Delhi, India',
    span: 'Jun 2026 — Present',
    duration: '4 mos',
    current: true,
    roles: [
      {
        title: 'Product Designer',
        employment: 'Part-time',
        period: 'Jun 2026 — Present',
        duration: '4 mos',
        arrangement: 'Remote',
        skills: ['User experience', 'Product design', 'Front-end'],
        note:
          'Designing and building the front end of four products, all in active development: a payment orchestration platform — both its internal command centre and its client-facing portal — an e-commerce storefront, and the central authentication system every product on the platform signs in through. The only designer on all of them.',
      },
    ],
  },
  {
    company: 'CheckMed',
    legalName: 'CheckMed Pvt Ltd',
    location: 'Remote',
    span: 'Apr 2026 — Present',
    duration: '6 mos',
    current: true,
    roles: [
      {
        title: 'Product Designer & Developer',
        employment: 'Part-time',
        period: 'Apr 2026 — Present',
        duration: '6 mos',
        arrangement: 'Remote',
        skills: ['Product design', 'QA & testing', 'Front-end'],
        note: 'Product design across five interconnected portals, plus testing, raising bugs and driving them to a fix with the developers who own the code — and fixing some myself. Four portals existed before I joined; Policy Creator and the platform’s design system I designed and built from scratch, the latter shipping as an npm package.',
      },
    ],
  },
  {
    company: 'Neuromotion Systems',
    legalName: 'Neuromotion Systems Pvt Ltd',
    location: 'Noida, Uttar Pradesh, India',
    span: 'Nov 2024 — Feb 2026',
    duration: '1 yr 4 mos',
    roles: [
      {
        title: 'UI/UX Designer · Product Designer',
        employment: 'Full-time',
        period: 'Nov 2024 — Feb 2026',
        duration: '1 yr 4 mos',
        arrangement: 'On-site',
        skills: ['Product design', 'Testing', 'Selenium'],
        note: 'The only designer in the product engineering team, so design was mine end to end. I owned testing alongside it: finding bugs, getting them fixed by the developers, and pushing improvements through to release. [Add what you shipped.]',
      },
    ],
  },
  {
    company: 'Nityom',
    legalName: 'Nityom Technology Pvt Ltd',
    location: 'New Delhi, Delhi, India',
    span: 'Aug 2022 — Nov 2024',
    duration: '2 yrs 4 mos',
    roles: [
      {
        title: 'Junior UI/UX Designer',
        employment: 'Full-time',
        period: 'Aug 2023 — Nov 2024',
        duration: '1 yr 4 mos',
        skills: ['Wireframing', 'Web application design'],
        note: '[One line: the products you worked on, and what you were trusted with by the end.]',
      },
      {
        title: 'UI/UX Designer',
        employment: 'Internship',
        period: 'Feb 2023 — Jul 2023',
        duration: '6 mos',
        arrangement: 'Remote',
        skills: ['Figma', 'Adobe XD'],
        note: '[One line: the move from graphics into interface work.]',
      },
      {
        title: 'Graphic Design',
        employment: 'Internship',
        period: 'Aug 2022 — Jan 2023',
        duration: '6 mos',
        skills: ['Adobe Illustrator', 'Adobe Photoshop'],
        note: '[One line: where you started.]',
      },
    ],
  },
];

/** Everything before the two current part-time roles, for the "Previously" line. */
export const previousCompanies = experience
  .filter((position) => !position.current)
  .map((position) => position.company);

/** Companies held right now. */
export const currentCompanies = experience
  .filter((position) => position.current)
  .map((position) => position.company);

/** First month of the first role — used for "designing since". */
export const careerStartYear = 2022;
