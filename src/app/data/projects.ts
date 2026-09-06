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
    title: 'Query.ai',
    org: NEUROMOTION,
    domain: 'Enterprise data analytics & AI',
    role: 'Product Designer',
    contribution: 'Sole designer',
    outcome: '[What it made possible that was not possible before.]',
    year: YEAR,
    context:
      'A data platform for large enterprises. Organisations connect their databases — through more than 300 import methods — and build their own analytics on top: choosing how a dataset is visualised, which chart carries it, and how it should be analysed. It runs its own LLM, and role-based access control spans multiple departments and groups inside one organisation.',
    responsibility:
      'Designed the entire platform independently, working directly with the founder. The most complex thing I have designed.',
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
    outcome: '[What changed for the fleet owners, managers or drivers using it.]',
    year: YEAR,
    context:
      'Software for organisations running vehicle fleets at scale: challans, document validity, live vehicle location, and driver, manager and owner management — each user type in its own portal. It also manages the progressive pumps the company manufactures, streaming pump health, expiry and maintenance data in over IoT so owners can see which vehicles are fitted and act before something fails.',
    responsibility:
      'Sole designer across every portal and the driver app. [Add which parts you are proudest of.]',
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
      'A design system for the platform, designed and built from scratch. It ships as an npm package, so developers install it in any project and import components straight from it. It also generates a Markdown reference for a given project, which puts the rules for building consistently next to the code rather than in a document nobody opens. [Add its name.]',
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
    ownership: {
      whatIDid: [
        'Designed the entire platform independently, working directly with the founder',
        'Structured how organisations model departments and groups under role-based access',
        'Designed the analytics builder: how a dataset becomes a chart, and who chooses',
        '[Add how you approached designing for its LLM]',
      ],
      whatIDidNot: ['Did not write the production code', '[Anything else outside your scope]'],
    },
    context: {
      teamSize: 'Me and the founder, working closely',
      techLimitations: [
        'Had to accommodate data arriving through more than 300 different import methods',
        '[Another real constraint]',
      ],
      businessGoals: ['[Goal one]', '[Goal two]'],
    },
  },
  'fleet-management': {
    ownership: {
      whatIDid: [
        'All the design across every portal and the driver app — I was the only designer',
        'Designed for three distinct user types: owners, managers and drivers',
        'Designed the IoT pump telemetry views — health, expiry and maintenance',
        '[Add how you handled the driver safety alerts]',
      ],
      whatIDidNot: ['Did not write the production code', '[Anything else outside your scope]'],
    },
  },
  'design-system': {
    businessProblem:
      'Five portals built at different times, without a shared component layer. [Add what that was costing — duplicated work, inconsistent UI, slow delivery.]',
    ownership: {
      whatIDid: [
        'Designed and built the system from scratch — components, tokens and the library itself',
        'Published it as an npm package, so any project installs it and imports components directly',
        'Built the Markdown generation, so a project can produce its own consistency reference',
        '[Add how you decided what belonged in the system and what did not]',
      ],
      whatIDidNot: ['[Anything outside your scope]'],
    },
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
    timeline: project.ongoing ? `${project.started ?? 'Apr 2026'} — ongoing` : '[Start — end, and how long it ran]',
    screens: [...galleryFor(project), ...extraShots(project)],
  };
}
