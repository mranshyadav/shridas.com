/**
 * Portfolio content — real work.
 *
 * CLIENT CONFIDENTIALITY: never name a client or customer of an employer here.
 * Employer names (CheckMed, Nityom, Neuromotion Systems, SRIIO) are fine —
 * that is your own employment history and it is already public on your
 * profile. The names of *their* customers are not yours to publish, and that
 * includes naming them as examples of "the kind of company this is for", which
 * reads to any visitor as a client list. Two earlier drafts named customers
 * and both have been stripped.
 *
 * NO STOCK IMAGERY. Every project is presented through CSS device frames that
 * render your own screenshots:
 *
 *     public/work/<project-id>/desktop.png
 *     public/work/<project-id>/tablet.png
 *     public/work/<project-id>/mobile.png
 *
 * Copy convention: text in [square brackets] is a placeholder. It renders with
 * a dotted underline via <Copy> so unwritten copy cannot ship by accident.
 */

export type Platform = 'desktop' | 'tablet' | 'mobile';

/**
 * How you came to the product, from most to least ownership. Stating this per
 * project is the honest core of the portfolio — fourteen entries that all
 * implied equal ownership would be the easiest thing in the world for an
 * interviewer to take apart.
 *
 *   Built end to end     you designed AND built it
 *   Sole designer        all the design was yours; engineers built it
 *   Design contribution  you designed part of it, on a team
 *   Features & QA        it existed; you added features, tested, drove fixes
 */
export type Contribution = 'Built end to end' | 'Sole designer' | 'Design contribution' | 'Features & QA';

/** The two that carry the most weight get the accent colour on the badge. */
export const PROMINENT_CONTRIBUTIONS: Contribution[] = ['Built end to end', 'Sole designer'];

export interface Project {
  id: string;
  index: string;
  title: string;
  /** The employer the work was done at. Never a client of theirs. */
  org: string;
  /** Who the product is for. */
  domain: string;
  role: string;
  contribution: Contribution;
  ongoing?: boolean;
  /** When ongoing work started, for the case-study timeline. */
  started?: string;
  /** When finished work ended. With `started`, this gives a real timeline. */
  ended?: string;
  /** A public URL, if the work shipped somewhere a visitor can look at it. */
  liveUrl?: string;
  outcome: string;
  year: string;
  context: string;
  responsibility: string;
  category: string;
  tags: string[];
  platforms: Platform[];
  screens: Partial<Record<Platform, string>>;
  /** Optional second shot per platform, for the case-study gallery. */
  screensAlt?: Partial<Record<Platform, string>>;
  /** Further gallery shots, appended after the generated pairs. */
  screensExtra?: Array<{ platform: Platform; src: string }>;
}

const CHECKMED = 'CheckMed';
const NITYOM = 'Nityom';
const NEUROMOTION = 'Neuromotion Systems';
const SRIIO = 'SRIIO';

const YEAR = '[Year]';

export const projects: Project[] = [
  {
    id: 'query-ai',
    index: '01',
    title: 'Qwry.AI',
    org: NEUROMOTION,
    domain: 'AI-native data intelligence',
    role: 'Product Designer',
    contribution: 'Sole designer',
    liveUrl: 'https://qwry.ai',
    outcome:
      'A question asked in plain English, answered across databases that were never built to be read together — with the SQL behind the answer shown, so the answer can be checked rather than trusted.',
    year: '2025 — 2026',
    started: 'May 2025',
    ended: 'Feb 2026',
    context:
      'An enterprise data platform built on a premise that shapes every screen in it: unify the data without moving it. Organisations connect the systems they already run — SQL and NoSQL databases, spreadsheets, files, SaaS tools — and the platform infers the relationships between them, builds a governed warehouse across the lot, and answers questions asked in plain English. Nothing is replicated; the data stays on the customer’s own infrastructure. It runs its own LLM, every answer carries the SQL that produced it, and role-based access control spans departments and groups inside one organisation.',
    responsibility:
      'Sole designer on the platform that became Qwry.AI — I designed it independently, working directly with the founder, and it is the most complex thing I have designed. It shipped under an earlier name and has grown since I left it: the product sold today carries features I did not design. What follows is the part that was mine.',
    category: 'Sole designer',
    tags: ['Data visualisation', 'LLM', 'RBAC', 'Enterprise'],
    platforms: ['desktop'],
    /* desktop.jpg is a high-fidelity render of the dashboard, rebuilt from the
       product's own design language and data. Everything after it is a direct
       screenshot of the shipped product. */
    screens: { desktop: '/work/query-ai/desktop.jpg' },
    screensAlt: { desktop: '/work/query-ai/desktop-b.jpg' },
    screensExtra: [
      { platform: 'desktop', src: '/work/query-ai/desktop-c.jpg' },
      { platform: 'desktop', src: '/work/query-ai/desktop-d.jpg' },
    ],
  },
  {
    id: 'fleet-management',
    index: '02',
    title: 'Fleet Management',
    org: NEUROMOTION,
    domain: 'Fleet, IoT & driver safety',
    role: 'Product Designer',
    contribution: 'Sole designer',
    outcome:
      'A pump stopped disappearing the moment it left the factory — and the owner it was fitted to got back the three things costing more than the pump: the fines, the expiries and the Fastags, at a fleet size where nobody could add them up by hand.',
    year: '2024 — 2025',
    started: 'Nov 2024',
    ended: 'Mar 2025',
    context:
      'Software for organisations running vehicle fleets at scale: challans, document validity, live vehicle location, and driver, manager and owner management — each user type in its own portal. It also manages the progressive pumps the company manufactures, streaming pump health, expiry and maintenance data in over IoT so owners can see which vehicles are fitted and act before something fails.',
    responsibility:
      'Sole designer across every portal and the driver app. Every module here is work I would stand behind, but the one I am happiest with is the vehicle page — getting almost everything a vehicle is, the mechanical and the financial and the legal and the compliance, onto a single page and still having it read easily.',
    category: 'Sole designer',
    tags: ['Fleet operations', 'IoT telemetry', 'Multi-portal', 'Driver safety'],
    /* Desktop only until the driver-app screens arrive — pairing a real desktop
       shot with a synthetic mobile one in the same composition would read as
       though both were real. */
    platforms: ['desktop'],
    screens: { desktop: '/work/fleet-management/desktop.jpg' },
    screensAlt: { desktop: '/work/fleet-management/desktop-b.jpg' },
    screensExtra: [
      { platform: 'desktop', src: '/work/fleet-management/desktop-c.jpg' },
      { platform: 'desktop', src: '/work/fleet-management/desktop-d.jpg' },
    ],
  },
  {
    id: 'design-system',
    index: '03',
    title: 'Design System',
    org: CHECKMED,
    domain: 'Internal · Component library & tooling',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    outcome:
      'Published as an npm package — any project can install it and import components directly. [Add adoption: which projects use it, or what it replaced.]',
    year: '2026',
    context:
      'SRIIO UI — a design system designed and built from scratch, now at v2.0.0. Twenty-six components and more than forty UI blocks, fully typed, dark mode throughout, and no runtime dependencies at all: styling is Tailwind classes, so there is no CSS bundle to ship and nothing to pay for at runtime. It installs from npm as @sriio/ui and imports straight into any project. It also generates a Markdown reference for a given project, which puts the rules for building consistently next to the code rather than in a document nobody opens.',
    responsibility:
      'Designed and built end to end — the components, the library, the packaging and the docs generation. Still in active development.',
    category: 'Built end to end',
    tags: ['Component library', 'npm package', 'Docs generation', 'Design & build'],
    platforms: ['desktop', 'tablet', 'mobile'],
    /* Real screenshots, captured from the running project. */
    screens: {
      desktop: '/work/design-system/desktop.png',
      tablet: '/work/design-system/tablet.png',
      mobile: '/work/design-system/mobile.png',
    },
    screensAlt: {
      desktop: '/work/design-system/desktop-b.png',
      tablet: '/work/design-system/tablet-b.png',
      mobile: '/work/design-system/mobile-b.png',
    },
  },
  {
    id: 'policy-creator',
    index: '04',
    title: 'Policy Creator',
    org: CHECKMED,
    domain: 'Internal · Rules & service configuration',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    outcome:
      'The portal the rest of the platform runs on — and the one I was asked to present during a major enterprise onboarding. [Add what else it unlocked.]',
    year: '2026',
    context:
      'Where the rules and services that apply to each client are defined, and every service-related setting is configured. Most flows across the other four portals depend on what is set here, which makes it the heart of the platform.',
    responsibility:
      'Designed and built end to end — the only portal in the platform I made from nothing. Still in active development.',
    category: 'Built end to end',
    tags: ['Rules engine', 'Configuration UI', 'Design & build'],
    /* Desktop only — every capture is a real screenshot of the running portal,
       and there is no tablet shot to pair with them. */
    platforms: ['desktop'],
    screens: { desktop: '/work/policy-creator/desktop.jpg' },
    screensAlt: { desktop: '/work/policy-creator/desktop-b.jpg' },
    screensExtra: [
      { platform: 'desktop', src: '/work/policy-creator/desktop-c.jpg' },
      { platform: 'desktop', src: '/work/policy-creator/desktop-d.jpg' },
      { platform: 'desktop', src: '/work/policy-creator/desktop-e.jpg' },
      { platform: 'desktop', src: '/work/policy-creator/desktop-f.jpg' },
      { platform: 'desktop', src: '/work/policy-creator/desktop-g.jpg' },
    ],
  },
  {
    id: 'payment-command-centre',
    index: '05',
    title: 'Command Centre',
    org: SRIIO,
    domain: 'Payment orchestration · Internal operations',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    started: 'Jun 2026',
    outcome: '[What the operations team can now see or do that they could not before.]',
    year: '2026',
    context:
      'The operator side of a payment orchestration platform — where payment traffic is watched and controlled rather than transacted. [Add what is actually configured and monitored here: routing between providers, failures and retries, reconciliation, settlement.] Its counterpart is the Client Portal, and the two are designed as one system.',
    responsibility:
      'Designed and built both portals — the only designer on the platform, and the front end is mine as well. Still in active development. [Add the parts of the command centre you are proudest of.]',
    category: 'Built end to end',
    tags: ['Payments', 'Operations console', 'Monitoring', 'Design & build'],
    platforms: ['desktop'],
    screens: {},
  },
  {
    id: 'payment-client-portal',
    index: '06',
    title: 'Client Portal',
    org: SRIIO,
    domain: 'Payment orchestration · Client-facing',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    started: 'Jun 2026',
    outcome: '[What it lets clients do for themselves that previously needed the operations team.]',
    year: '2026',
    context:
      'The client side of the same payment orchestration platform — where the businesses using it see their own payment activity and manage their own account. [Add what they can do here: transactions, refunds, payouts, reports, keys and settings.] Designed alongside the Command Centre so an operator and a client are looking at the same truth from two sides.',
    responsibility:
      'Designed and built both portals. Still in active development. [Add what you had to solve to make the same data legible to a client rather than an operator.]',
    category: 'Built end to end',
    tags: ['Payments', 'Self-service', 'Reporting', 'Design & build'],
    platforms: ['desktop'],
    screens: {},
  },
  {
    id: 'commerce-storefront',
    index: '07',
    title: 'Commerce Storefront',
    org: SRIIO,
    domain: 'E-commerce · Shopper-facing',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    started: 'Jun 2026',
    outcome: '[What it changed for the people buying — a number, or a specific thing the store now does well.]',
    year: '2026',
    context:
      'An online store, designed shopper-first: browsing and search, the product page, cart and checkout, and everything after the order is placed. [Add what is sold and who buys it — the catalogue shape drives most of the design decisions.] Phone traffic is the majority case, so the small screen is the one the layout is decided on.',
    responsibility:
      'Designed and built the storefront front end on my own. Still in active development. [Add the flow you spent the most on, and why it needed it.]',
    category: 'Built end to end',
    tags: ['E-commerce', 'Checkout', 'Catalogue & search', 'Design & build'],
    platforms: ['desktop', 'mobile'],
    screens: {},
  },
  {
    id: 'central-auth-system',
    index: '08',
    title: 'Central Authentication System',
    org: SRIIO,
    domain: 'Identity · Shared platform service',
    role: 'Product Designer & Developer',
    contribution: 'Built end to end',
    ongoing: true,
    started: 'Jun 2026',
    outcome: '[What it replaced — separate logins per product, or an access model that could not be governed.]',
    year: '2026',
    context:
      'One identity layer for every product on the platform, so a person signs in once rather than once per portal. Sign-in and sign-up, session and device handling, recovery, second factors, and the roles and permissions each product reads from. [Add which products sit behind it.] Almost none of it is a screen anyone wants to spend time on, which is the whole design problem: it has to be exact and it has to be quick.',
    responsibility:
      'Designed and built the system front end on my own. Still in active development. [Add the hardest state you had to design for — a failure, a lockout, an edge case in recovery.]',
    category: 'Built end to end',
    tags: ['Authentication', 'SSO', 'RBAC', 'Design & build'],
    platforms: ['desktop', 'mobile'],
    screens: {},
  },
  {
    id: 'role-app',
    index: '09',
    title: 'Role',
    org: NITYOM,
    domain: 'Film industry hiring',
    role: 'UI/UX Designer',
    contribution: 'Sole designer',
    outcome: '[What it changed for the people on either side of the hire.]',
    year: YEAR,
    context:
      'A hiring app for the film industry. Job seekers show what they can do through reels and posts; filmmakers, directors and producers hire from that. Jobs get posted, candidates apply, and the whole hiring process runs inside the app — LinkedIn-shaped, but built around showing rather than telling.',
    responsibility: 'Designed individually — the whole app was mine.',
    category: 'Sole designer',
    tags: ['Reels & posts', 'Job marketplace', 'Applications'],
    platforms: ['mobile'],
    screens: {},
  },
  {
    id: 'meetx',
    index: '10',
    title: 'MeetX',
    org: NITYOM,
    domain: 'Meetings',
    role: 'UI/UX Designer',
    contribution: 'Sole designer',
    outcome: '[What it made possible, and for whom.]',
    year: YEAR,
    context: 'A mobile app for running offline meetings. [Add who used it and what problem it solved for them.]',
    responsibility: 'Designed end to end on my own — every screen was mine. Built by the development team.',
    category: 'Sole designer',
    tags: ['Meetings', 'Mobile app', 'End-to-end design'],
    platforms: ['mobile'],
    screens: {},
  },
  {
    id: 'roll-shop-management',
    index: '11',
    title: 'Roll Shop Management',
    org: NEUROMOTION,
    domain: 'Manufacturing operations',
    role: 'Product Designer',
    contribution: 'Design contribution',
    outcome: '[What it changed for the plant running on it.]',
    year: YEAR,
    context:
      'Operations software for a large manufacturing plant. Every individual process is tracked in detail, with role-based access across the teams involved, covering the range of processes and operational requirements a plant of that complexity runs on.',
    responsibility:
      'One of two designers. We each owned separate parts of the system outright rather than sharing screens. [Add which parts were mine.]',
    category: 'Design contribution',
    tags: ['Process tracking', 'RBAC', 'Industrial'],
    platforms: ['desktop'],
    screens: {},
  },
  {
    id: 'kaamhai',
    index: '12',
    title: 'KaamHai',
    org: NITYOM,
    domain: 'Blue-collar hiring & workforce management',
    role: 'UI/UX Designer',
    contribution: 'Design contribution',
    outcome: '[What the platform changed for the employers or workers using it.]',
    year: YEAR,
    context:
      'A platform for hiring blue-collar workers and managing them once they are on: workforce management, salary, leave and the rest of the day-to-day. It ships as a mobile app for workers and an admin portal for the people managing them.',
    responsibility:
      'Worked across both the mobile app and the admin portal. [Add which parts of each you owned.]',
    category: 'Design contribution',
    tags: ['Hiring', 'Workforce management', 'Payroll & leave'],
    platforms: ['desktop', 'mobile'],
    screens: {},
  },
  {
    id: 'user-portal',
    index: '13',
    title: 'User Portal',
    org: CHECKMED,
    domain: 'Employee-facing',
    role: 'Product Designer & Developer',
    contribution: 'Features & QA',
    outcome: '[What improved — a number, or a specific thing employees can now do.]',
    year: '2026',
    context:
      'Where employees book the services their organisation provides, read their reports, and track their health over time. Built before I joined; my work has been new features, finding bugs and getting them fixed.',
    responsibility:
      'Feature design and the front-end work on those features, QA across the flows, and driving bug fixes through the developers who own the code — often fixing them myself.',
    category: 'Features & QA',
    tags: ['Booking', 'Reports', 'Health tracking'],
    platforms: ['desktop', 'tablet', 'mobile'],
    screens: {},
  },
  {
    id: 'business-portal',
    index: '14',
    title: 'Business Portal',
    org: CHECKMED,
    domain: 'HR & organisation-facing',
    role: 'Product Designer & Developer',
    contribution: 'Features & QA',
    outcome: '[What improved for the HR teams using it.]',
    year: '2026',
    context:
      'Where HR teams monitor their employees’ services and the overall health of the organisation, and run health activities for staff. Built before I joined; my work has been features, bugs and improvements.',
    responsibility: 'Feature design and front-end work on what I added, QA, and driving fixes and improvements through the development team.',
    category: 'Features & QA',
    tags: ['Org health', 'Monitoring', 'Programme management'],
    platforms: ['desktop'],
    /* Real screens. Tablet and mobile to follow. */
    screens: { desktop: '/work/business-portal/desktop.jpg' },
    screensAlt: { desktop: '/work/business-portal/desktop-b.jpg' },
    screensExtra: [{ platform: 'desktop', src: '/work/business-portal/desktop-c.jpg' }],
  },
  {
    id: 'vendor-portal',
    index: '15',
    title: 'Vendor Portal',
    org: CHECKMED,
    domain: 'Partner-facing',
    role: 'Product Designer & Developer',
    contribution: 'Features & QA',
    outcome: '[What improved for vendors fulfilling bookings.]',
    year: '2026',
    context:
      'Where vendor partners receive bookings and fulfil services for patients, and where all vendor-side activity is managed. Built before I joined; my work has been features, bugs and improvements.',
    responsibility: 'Feature design and front-end work on what I added, QA, and driving fixes and improvements through the development team.',
    category: 'Features & QA',
    tags: ['Bookings', 'Fulfilment', 'Partner operations'],
    platforms: ['desktop', 'mobile'],
    screens: {},
  },
  {
    id: 'control-panel',
    index: '16',
    title: 'Control Panel',
    org: CHECKMED,
    domain: 'Internal operations',
    role: 'Product Designer & Developer',
    contribution: 'Features & QA',
    outcome: '[What improved for the team operating the platform.]',
    year: '2026',
    context:
      'The portal the business is run from — where every other portal is operated and managed. Built before I joined; my work has been features, bugs and improvements.',
    responsibility: 'Feature design and front-end work on what I added, QA, and driving fixes and improvements through the development team.',
    category: 'Features & QA',
    tags: ['Admin', 'Operations', 'Platform management'],
    platforms: ['desktop'],
    /* Real screens. */
    screens: { desktop: '/work/control-panel/desktop.jpg' },
    screensAlt: { desktop: '/work/control-panel/desktop-b.jpg' },
    screensExtra: [{ platform: 'desktop', src: '/work/control-panel/desktop-c.jpg' }],
  },
  {
    id: 'neuromotion-website',
    index: '17',
    title: 'Company Website',
    org: NEUROMOTION,
    domain: 'Marketing site',
    role: 'Product Designer',
    contribution: 'Sole designer',
    liveUrl: 'https://nmspl.co/',
    outcome: 'Live at nmspl.co.',
    year: YEAR,
    context: 'The company’s public website. [Add what it needed to do — explain the hardware, generate leads, both.]',
    responsibility: 'Designed entirely by me.',
    category: 'Sole designer',
    tags: ['Marketing site', 'Responsive', 'Brand'],
    platforms: ['desktop', 'mobile'],
    /* Real screenshots, captured from the live site. */
    screens: {
      desktop: '/work/neuromotion-website/desktop.jpg',
      mobile: '/work/neuromotion-website/mobile.jpg',
    },
  },
  {
    id: 'investor-site',
    index: '18',
    title: 'Investor-Facing Site',
    org: NEUROMOTION,
    domain: 'Marketing site',
    role: 'Product Designer',
    contribution: 'Sole designer',
    outcome: '[What it needed to achieve with investors.]',
    year: YEAR,
    context:
      'A portfolio site built for an investor audience rather than a general one — the reader is deciding whether to back something, not whether to buy it. [Add what that changed about the structure.]',
    responsibility: 'Designed entirely by me.',
    category: 'Sole designer',
    tags: ['Marketing site', 'Investor audience', 'Responsive'],
    platforms: ['desktop', 'mobile'],
    screens: {},
  },

];

/** Counts used in page copy, derived so the copy can never drift. */
export const builtEndToEndCount = projects.filter((p) => p.contribution === 'Built end to end').length;
export const soleDesignerCount = projects.filter((p) => p.contribution === 'Sole designer').length;
export const ownedOutrightCount = builtEndToEndCount + soleDesignerCount;
export const orgCount = new Set(projects.map((p) => p.org)).size;

/* -------------------------------------------------------------------------- */
/*  Preview screenshots — TEMPORARY                                           */
/* -------------------------------------------------------------------------- */

/**
 * Fills any empty `screens` with the synthetic UI mockups in
 * `public/work/_preview/`. Those SVGs are abstract interface layouts generated
 * only to show how the device frames look with content in them.
 *
 * THEY ARE NOT YOUR WORK AND MUST NOT SHIP AS IF THEY WERE.
 *
 * Flip this to `false` to remove every one of them at once. Real screenshots
 * you add to a project's `screens` always win over the preview.
 */
export const USE_PREVIEW_SCREENS = true;

if (USE_PREVIEW_SCREENS) {
  for (const project of projects) {
    for (const platform of project.platforms) {
      if (!project.screens[platform]) {
        project.screens[platform] = `/work/_preview/${project.id}-${platform}.svg`;
      }
    }
  }
}

export function getProject(id: string | undefined): Project | undefined {
  return projects.find((p) => p.id === id);
}

/* -------------------------------------------------------------------------- */
/*  Case studies                                                              */
/* -------------------------------------------------------------------------- */

export interface CaseStudyScreen {
  platform: Platform;
  src?: string;
  caption: string;
  /** Full-measure shot. Reserved for the lead desktop view of each platform. */
  wide?: boolean;
}

export interface CaseStudy {
  id: string;
  projectName: string;
  productType: string;
  role: string;
  timeline: string;
  screens: CaseStudyScreen[];
  businessProblem: string;
  userProblem: string;
  context: {
    teamSize: string;
    techLimitations: string[];
    businessGoals: string[];
  };
  ownership: {
    whatIDid: string[];
    whatIDidNot: string[];
  };
  research: {
    keyFindings: string[];
    painPoints: string[];
  };
  designDecisions: Array<{
    problem: string;
    optionChosen: string;
    whyOthersRejected: string;
  }>;
  impact: {
    metrics: string[];
    outcomes: string[];
    learnings: string[];
  };
  reflection: {
    improvements: string[];
    learnings: string[];
  };
}

type CaseStudyBody = Omit<
  CaseStudy,
  'id' | 'projectName' | 'productType' | 'role' | 'timeline' | 'screens'
>;

const base: CaseStudyBody = {
  businessProblem: '[What was costing the business money or momentum, stated plainly.]',
  userProblem: '[What the people using it were actually struggling to do.]',
  context: {
    teamSize: '[Who was on the team, including you]',
    techLimitations: ['[Constraint that shaped the design]', '[Another real constraint]'],
    businessGoals: ['[Goal one]', '[Goal two]'],
  },
  ownership: {
    whatIDid: ['[A thing you personally did — be specific about method and volume]', '[Another thing you owned]'],
    whatIDidNot: ['[Something outside your scope — this honesty reads as senior]'],
  },
  research: {
    keyFindings: ['[A finding that changed your mind]', '[A finding with a number behind it]'],
    painPoints: ['[Pain point]', '[Pain point]'],
  },
  designDecisions: [
    {
      problem: '[The specific problem this decision solved]',
      optionChosen: '[What you shipped]',
      whyOthersRejected: '[The alternatives you considered and why each lost]',
    },
    {
      problem: '[The specific problem this decision solved]',
      optionChosen: '[What you shipped]',
      whyOthersRejected: '[The alternatives you considered and why each lost]',
    },
  ],
  impact: {
    metrics: ['[Measured change, with the before and after]'],
    outcomes: ['[What it unlocked for the business or team]'],
    learnings: ['[What you would tell someone starting the same project]'],
  },
  reflection: {
    improvements: ['[What you would do differently]'],
    learnings: ['[What this project taught you]'],
  },
};

/** Ownership wording for the four CheckMed portals that predate you. */
const improvementOwnership = {
  whatIDid: [
    'Feature design on an existing product',
    'Front-end work on the features I designed, and on the fixes I picked up myself',
    'Testing and QA across the flows',
    'Raising bugs and driving them to a fix with the developers who own the code',
  ],
  whatIDidNot: ['Did not design or build the original portal — it existed before I joined'],
};

/** Ownership wording for the Neuromotion work, where you were the only designer. */
const soleDesignerOwnership = {
  whatIDid: [
    'All the design — I was the only designer on the product',
    'Testing and QA across the flows',
    'Raising bugs and driving them to a fix with the developers, and pushing improvements through to release',
  ],
  whatIDidNot: ['Did not write the production code', '[Anything else outside your scope]'],
};

const CASE_STUDY_OVERRIDES: Record<string, Partial<CaseStudyBody>> = {
  'query-ai': {
    businessProblem:
      'A large organisation typically runs three sources of truth and none of them agree — the finance system, the spreadsheets operations actually works from, and customer data somewhere else again. Reconciling them is manual, so the answer arrives after the decision needed it. The existing fix was to move all of it into a lakehouse, which is a project, not a product.',
    userProblem:
      'The people who need an answer are not the people who can write the query. Analysts could describe the question but not express it against half a dozen unlike databases; the ones who could write SQL had to learn each source’s shape first. And an AI that answers in confident prose is no use against governed data — if the answer cannot be checked, it cannot be acted on.',
    ownership: {
      whatIDid: [
        'Designed the entire platform independently, working directly with the founder',
        'Structured how organisations model departments and groups under role-based access',
        'Designed the analytics builder: how a dataset becomes a chart, and who chooses',
        'Designed how the LLM behaves for enterprise use — the dataset-scoped prompt path, and the confidence ladder that decides whether an answer ships plainly, with a reference, with a warning, or to a human reviewer first',
        'Tested the flows, drove the improvements that came out of testing, and put the suggestions behind them to the founder',
      ],
      whatIDidNot: ['Did not write the production code — the design was mine end to end, the build was not'],
    },
    context: {
      teamSize: 'Me and the founder, working closely',
      techLimitations: [
        'Data arrived through scores of unlike import paths — the platform lists more than 120 connectors — and no two of them presented the same shape',
        'Token cost set the shape of the AI. At this data volume a model allowed to search the whole estate made a single small question expensive, so the design had to narrow what it could see before it answered',
        'Every workspace had to stay governable — model and version, query access level, execution limits, export format and size, and logging all had to be an administrator’s choice rather than a default',
      ],
      /* Empty on purpose. The founder's commercial goals were his, and stating
         them second-hand would be guesswork on the one page where guesswork is
         least affordable. The section hides itself rather than showing a
         heading over nothing. */
      businessGoals: [],
    },
    designDecisions: [
      {
        problem:
          'The first design put every imported database into one file-explorer tree and let people build their datasets inside it. That holds for a handful of sources. It does not hold for an organisation running fifty or a hundred databases across teams of thousands, where no two people should see the same slice of the estate.',
        optionChosen:
          'A module above the file explorer, where imported sources are managed as sources — connections, schemas, tables — and where datasets are created. Access is assigned there, per team and per employee, so who can see what is settled when data enters the platform rather than when someone queries it.',
        whyOthersRejected:
          'The file-explorer-only version was built first and it was the more elegant idea: one tree, one habit, every source in it. It lost because it made everything equally visible to anyone who could open the tree — workable for a small team, disqualifying at enterprise scale, where the access question is the whole point.',
      },
      {
        problem:
          'The intent was our own LLM that a user could query directly and work with the data freely. At enterprise data volumes that breaks on cost before it breaks on anything else: one small question burns an enormous number of tokens when the model has the entire estate to search.',
        optionChosen:
          'Datasets scoped to the person asking. A prompt begins by choosing a dataset, and the model works inside it — narrowing to the related table, then the column, then the row, before it answers.',
        whyOthersRejected:
          'Letting the model range over everything was the original plan and the easier product to explain. It lost on token cost at the data sizes this is built for. Scoping turned out to carry the access model too: a person queries what they have been given, not what exists.',
      },
      {
        problem:
          'A public LLM being wrong is an annoyance. An enterprise LLM being wrong about a number someone then acts on is a liability. The model could not answer in one register regardless of how sure it was.',
        optionChosen:
          'The answer changes shape with the model’s own confidence. Sure, and it answers. Slight doubt, and it answers but says to check. Lower, and the answer carries a badge and the reference it came from. Lower still, and a warning goes with it. Below that it does not answer yet — it re-runs its own process two or three times to see whether it converges. If it still cannot get there, the question escalates to a review manager, and the user sees it only after a person has approved it.',
        whyOthersRejected:
          'Our own model answering directly, the way a public one does, was the first intent and the thing the final design was built against. At enterprise stakes a confident wrong answer is worse than a held one, so uncertainty had to be visible on the answer itself and, past a threshold, had to stop being the model’s decision at all.',
      },
    ],
    research: {
      keyFindings: [
        'The file-explorer model I had designed did not survive the real case. An enterprise runs fifty or a hundred databases, not a handful, and its teams are large enough that who sees which slice is the first question rather than the last',
        'Token cost, not model quality, was going to decide whether the AI was usable at this volume — a model free to search the whole estate made one small question expensive',
      ],
      painPoints: [
        'Teams needed different slices of the same estate, and nothing in the first design could express that',
        'An answer a person could not trace back to a source was an answer they would not act on',
      ],
    },
    impact: {
      /* What the product became, not a claim that this design produced it.
         The work shipped and the product has grown past it — that is the
         honest signal, and it is a good one. Anything the design itself
         moved belongs in metrics, and only Ansh has those. */
      metrics: [],
      outcomes: [
        'The work shipped, and the product it became sells publicly at qwry.ai across power and distribution, manufacturing, supply chain, e-commerce and procurement',
        'The connect-and-unify flow I designed now carries forty-plus source integrations, from Postgres and MongoDB through spreadsheets, files and SaaS tools',
        'The spine of the product is still the path this design was built around — raw source to a verified answer you can check, with the SQL always in reach',
      ],
      learnings: [],
    },
    reflection: {
      /* Empty on purpose — see businessGoals above. */
      improvements: [],
      learnings: [
        'To research narrowly and precisely rather than broadly. The two findings that redirected this product were specific questions asked properly, not a survey of the field',
        'That designing a product in depth is a different craft from designing screens. What mattered here sat underneath the interface — what the system does when it is unsure, and who it turns to',
        'To go at the critical problem rather than around it. The file-explorer version was the comfortable design; the scale and access problem was the real one, and it had to be met head on',
      ],
    },
  },
  'fleet-management': {
    businessProblem:
      'The company manufactures progressive pumps, and once a pump left the factory it disappeared. Nobody could say which vehicles carried one, what condition it was in, or when it was next due for service — not the manufacturer, and not the owner of the vehicle it was fitted to. Both of them paid for that blindness in the same event: the service slipped, the pump failed, and a vehicle stopped in critical condition. The owner lost the vehicle and the work it was doing. The manufacturer lost its name to a service call that arrived after the breakdown instead of before it.',
    userProblem:
      'Interviewing vehicle owners changed what the product was. Running one or two thousand vehicles, the pump was not their largest problem. Nobody could total the fines — how many, how much, raised where. Nobody could say which documents had expired or were about to, or which Fastags were blocked, empty, or nearly empty. At that fleet size the arithmetic simply cannot be done by hand, so owners did not know where money had to go next, and large sums went to penalties that a week of notice would have prevented.',
    ownership: {
      whatIDid: [
        'All the design across every portal and the driver app — I was the only designer',
        'Interviewed vehicle owners before designing, and the findings redrew the product’s scope from the pump to the vehicle',
        'Designed for three distinct user types: owners, managers and drivers',
        'Designed the IoT pump telemetry views — health, expiry and maintenance',
        'Designed driver safety around evidence rather than a score alone: every incident lands on the trip’s traced route with cabin, front and rear camera stills attached to it',
      ],
      whatIDidNot: ['Did not write the production code', '[Anything else outside your scope]'],
    },
    designDecisions: [
      {
        problem:
          'The brief was one thing: track our pumps in the field. That was a real problem and a solvable one — but it was the manufacturer’s problem, and the person who would have to open this software every day was the vehicle owner.',
        optionChosen:
          'We interviewed owners before designing, and the product grew from the pump to the vehicle. One page per vehicle now carries pump health off the IoT stream, the Fastag balance and its last transaction, pending challans with the overdue ones flagged, and every document with its expiry — registration, permit, fitness, insurance — beside the chassis number and the driver.',
        whyOthersRejected:
          'Building the pump tracker as briefed was faster, and it was what had been asked for. It lost because an owner will not open a tool daily for the pump alone — and a tool nobody opens does not get the pump serviced either. The manufacturer’s own goal turned out to depend on solving the owner’s problem first.',
      },
      {
        problem:
          'A reading on a dashboard prevents nothing unless it reaches the person who can act on it, and that person changes with what is wrong and how soon it matters.',
        optionChosen:
          'The pump’s condition decides who hears about it and how loudly. Ordinary conditions notify; urgent ones place a call. A service date coming up reaches the manager and the driver, with a location suggested to have it done. A pump approaching end of life reaches the manufacturer as well as the owner, because replacing it is the manufacturer’s job, not the owner’s.',
        whyOthersRejected:
          'The first plan was a system for the owner alone. Managers came second, and drivers got a mobile application of their own after that. Owner-only lost to the size of the fleet it was built for — someone running a thousand vehicles is not the person who takes one of them in for a service. Each portal exists because the person who can act on a given condition is a different person, and the driver’s is an app because he is the only one of the three who is never at a desk.',
      },
      {
        problem:
          'A fleet dashboard usually reports what exists: how many vehicles, how far they ran, how much fuel. None of that tells an owner where to spend the next hour.',
        optionChosen:
          'The dashboard opens on what is about to fail. Pumps that have reached end of life, pumps approaching it, pumps low on grease — then unhealthy pumps broken down by fault type and by vehicle type, so a pattern in the machines is visible next to a pattern in the fleet.',
        whyOthersRejected:
          'The first version was a more conventional dashboard and it widened as the platform did. What pushed it was the thing this product exists for: every loss in this business — the stopped vehicle, the service call that came late, the fine nobody saw coming — happens because something was not noticed in time. A dashboard that reports what exists cannot serve that. One that opens on whatever is closest to failing can.',
      },
      {
        problem:
          'Once the vehicles were on a map the questions changed from maintenance to what happened. An accident is disputed and a claim needs proof. A driver’s habits at the wheel are visible to nobody but the driver. And a safety score on its own is only an accusation — the driver argues with it, the manager cannot check it, and the number stops being used.',
        optionChosen:
          'Cameras and sensors on the vehicle, and the trip drawn as its actual route against the intended one. Every incident carries its time and stills from the cabin, front and rear, so an accident can be reconstructed afterwards and the footage carries the insurance claim. The same channel surfaces what a manager could never otherwise see — drinking, smoking at the wheel, driving past the permitted hours — as events with evidence attached rather than as a figure to be argued about.',
        whyOthersRejected:
          'Nothing was weighed against this one, and it would be tidier to pretend otherwise. The tracking, the telemetry and the three portals already existed, so the question was never which approach to take — it was how far the platform should reach. Having the whole system in place, the answer was as far as the vehicle itself. The cameras and sensors were the reach, not the choice.',
      },
    ],
    research: {
      keyFindings: [
        'The brief was a pump tracker. The owners we interviewed had larger problems than the pump — unpaid challans, expiring documents, blocked or empty Fastags — and none of it was visible at fleet scale',
        'At one to two thousand vehicles, arithmetic is the product. How much is owed, what expires this month, which cards are empty: every question an owner has is impossible to answer by hand',
      ],
      painPoints: [
        'An owner learned about a pump when the vehicle stopped, not before — and by then the vehicle and the work it was doing were both lost',
        'Fines surfaced as a total after the fact, when a week of notice would have prevented most of them',
      ],
    },
  },
  'design-system': {
    businessProblem:
      'Five portals built at different times, without a shared component layer. [Add what that was costing — duplicated work, inconsistent UI, slow delivery.]',
    userProblem:
      'The people this had to serve were the developers building the next screen. Without a system, a button is a decision every time — someone rebuilds it, slightly differently, and the drift only becomes visible once it is expensive to undo.',
    ownership: {
      whatIDid: [
        'Designed and built the system from scratch — components, tokens and the library itself',
        'Published it as an npm package, so any project installs it and imports components directly',
        'Built the Markdown generation, so a project can produce its own consistency reference',
        'Wrote the documentation site that ships with it — installation, theming, and every component with its variants, live',
        '[Add how you decided what belonged in the system and what did not]',
      ],
      whatIDidNot: ['[Anything outside your scope]'],
    },
    designDecisions: [
      {
        problem:
          'A component library that arrives with its own runtime is a tax on every project that installs it — a CSS bundle to ship, a theme layer to learn, and a dependency that has to be kept alive.',
        optionChosen:
          'Zero runtime dependencies. Every component is styled with Tailwind classes the host project already compiles, so nothing extra ships and a team themes it with the tools it uses anyway. Fully typed, dark mode throughout, and each component copy-pasteable as well as importable.',
        whyOthersRejected:
          '[Which alternatives you weighed here — CSS-in-JS, a bundled stylesheet, building on an existing library — and why each lost]',
      },
      {
        problem:
          'A design system is only adopted if using it is easier than not using it. Documentation that lives away from the code loses that race immediately.',
        optionChosen:
          'Two routes to the same rules. A documentation site with every component and variant rendered live, and a Markdown reference the system generates into the project itself — so the rules sit beside the code, where the next person and the tools they use will actually meet them.',
        whyOthersRejected:
          '[Which alternatives you weighed here — a Figma-only source of truth, a wiki, Storybook — and why each lost]',
      },
    ],
  },
  'roll-shop-management': {
    ownership: {
      whatIDid: [
        'Owned my areas of the system outright — the two of us split it by area rather than sharing screens',
        '[Name the parts that were yours]',
      ],
      whatIDidNot: ['Another designer owned the rest of the system', 'Did not write the production code'],
    },
  },
  'policy-creator': {
    ownership: {
      whatIDid: [
        'Designed and built the portal end to end — the only one in the platform I made from nothing',
        'Defined how rules and services are configured, and how those settings propagate to the other portals',
        'Presented the portal during a major enterprise onboarding',
        'Testing, QA and bug fixing on my own code',
      ],
      whatIDidNot: ['[Anything you did not own here — backend, infra, a teammate’s area]'],
    },
    context: {
      teamSize: '[Who else was involved, and in what capacity]',
      techLimitations: [
        'Had to fit the platform the other four portals were already built on',
        '[Another real constraint]',
      ],
      businessGoals: ['Make client rules and services configurable without an engineer', '[Another goal]'],
    },
  },
  'user-portal': { ownership: improvementOwnership },
  'business-portal': { ownership: improvementOwnership },
  'vendor-portal': { ownership: improvementOwnership },
  'control-panel': { ownership: improvementOwnership },
  meetx: {
    ownership: {
      whatIDid: [
        'Designed the app end to end, on my own — research through to final UI',
        '[Break that down — the flows, the screens, the decisions]',
      ],
      whatIDidNot: ['Did not build it — the development team did'],
    },
  },
  'role-app': {
    ownership: {
      whatIDid: [
        'Designed the app individually — the whole product was mine',
        '[Break that down — the candidate side, the hiring side, the reel-based profile]',
      ],
      whatIDidNot: ['Did not write the production code'],
    },
  },
  kaamhai: {
    ownership: {
      whatIDid: [
        'Worked across both the worker-facing mobile app and the admin portal',
        '[Name the specific flows or areas you owned in each]',
      ],
      whatIDidNot: ['[What other designers or teams owned]'],
    },
  },
  'payment-command-centre': {
    businessProblem:
      '[What was wrong before — payments spread across providers with no single place to see or steer them.]',
    ownership: {
      whatIDid: [
        'Designed and built both portals — the only designer on the platform, and the front end is mine too',
        '[Name the command-centre areas that were yours: routing, monitoring, reconciliation]',
        'Kept the operator and client views consistent, since they describe the same payments',
      ],
      whatIDidNot: ['Did not build the back end — the payment engine and provider integrations are engineering’s', '[Anything else outside your scope]'],
    },
    context: {
      teamSize: '[Who else was involved, and in what capacity]',
      techLimitations: ['[A real constraint — provider APIs, latency, what the platform could report on]'],
      businessGoals: ['[Goal one]', '[Goal two]'],
    },
  },
  'payment-client-portal': {
    ownership: {
      whatIDid: [
        'Designed and built both portals — the design and the front end are both mine',
        '[Name the client-facing flows that were yours]',
        'Decided how much of the operational picture a client should see, and in what language',
      ],
      whatIDidNot: ['Did not build the back end', '[Anything else outside your scope]'],
    },
  },
  'commerce-storefront': {
    ownership: {
      whatIDid: [
        'Designed and built the storefront front end on my own',
        'Designed the buying path end to end: browse, search, product, cart, checkout, post-order',
        '[Add what you did about the states that lose sales — out of stock, failed payment, empty search]',
      ],
      whatIDidNot: ['Did not build the back end — catalogue, orders and payments are engineering’s', '[Anything else outside your scope]'],
    },
  },
  'central-auth-system': {
    businessProblem:
      '[What it fixed — separate credentials per product, or no single place to govern who can reach what.]',
    ownership: {
      whatIDid: [
        'Designed and built the system front end on my own',
        'Designed sign-in, sign-up, recovery, sessions and the second-factor flows',
        'Designed how roles and permissions are expressed, since every product reads them',
        '[Add how you handled the failure and lockout states]',
      ],
      whatIDidNot: ['Did not build the auth back end', 'Security decisions owned by engineering'],
    },
    context: {
      teamSize: '[Who else was involved, and in what capacity]',
      techLimitations: ['[A real constraint — what the auth provider allowed, what existing products expected]'],
      businessGoals: ['[Goal one]', '[Goal two]'],
    },
  },
  'neuromotion-website': { ownership: soleDesignerOwnership },
  'investor-site': { ownership: soleDesignerOwnership },
};

/** Two shots per platform: a lead view, and the state that makes it interesting. */
function galleryFor(project: Project): CaseStudyScreen[] {
  return project.platforms.flatMap((platform) => [
    {
      platform,
      src: project.screens[platform],
      /* Only the lead desktop shot takes the full measure. A gallery of
         identical full-width frames has no hierarchy and reads as a wall. */
      wide: platform === 'desktop',
      caption: '[Screen name] — [what it does, and the decision it reflects]',
    },
    {
      platform,
      /* A real second shot if there is one; otherwise a distinct preview
         variant, so the two gallery slots are never the same picture twice. */
      src:
        project.screensAlt?.[platform] ??
        (USE_PREVIEW_SCREENS ? `/work/_preview/${project.id}-${platform}-b.svg` : undefined),
      caption: '[A second state — empty, error, loading, or an edge case you designed for]',
    },
  ]);
}

/** Extra shots a project supplies beyond the generated pairs. */
function extraShots(project: Project): CaseStudyScreen[] {
  return (project.screensExtra ?? []).map((shot) => ({
    platform: shot.platform,
    src: shot.src,
    wide: shot.platform === 'desktop',
    caption: '[Screen name] — [what it does, and the decision it reflects]',
  }));
}

/**
 * Ongoing work reads from its start; finished work reads start to end, with
 * the run length worked out rather than typed, so it cannot drift from the
 * dates beside it. Only a project with neither falls back to a placeholder.
 */
function caseStudyTimeline(project: Project): string {
  if (project.ongoing) return `${project.started ?? '[Start]'} — ongoing`;
  if (!project.started || !project.ended) return '[Start — end, and how long it ran]';

  const span = `${project.started} — ${project.ended}`;
  const from = new Date(`${project.started} 1`);
  const to = new Date(`${project.ended} 1`);
  if (Number.isNaN(from.valueOf()) || Number.isNaN(to.valueOf())) return span;

  const months =
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
  return months > 0 ? `${span} · ${months} months` : span;
}

export function getCaseStudy(id: string | undefined): CaseStudy | undefined {
  const project = getProject(id);
  if (!project) return undefined;

  return {
    ...base,
    ...CASE_STUDY_OVERRIDES[project.id],
    id: project.id,
    projectName: project.title,
    productType: project.domain,
    role: project.role,
    timeline: caseStudyTimeline(project),
    screens: [...galleryFor(project), ...extraShots(project)],
  };
}
