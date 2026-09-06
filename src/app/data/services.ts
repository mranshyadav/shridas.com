/**
 * Freelance service offerings.
 *
 * Copy and pricing carried over unchanged from the previous Services page —
 * these are offers, not claims about past results, so nothing here was
 * replaced with placeholders. Review the prices before going live.
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  timeline: string;
  price: string;
}

export const services: Service[] = [
  {
    id: "digital-presence-package",
    title: "Complete Digital Presence Package",
    description: "Everything your business needs to establish a strong online presence. A comprehensive combo package that includes website design, SEO optimization, social media setup, and local business listings - all in one.",
    deliverables: [
      "Professional website with on-page SEO optimization",
      "Social media profiles (Facebook, Instagram, LinkedIn, Twitter)",
      "Google Business Profile setup & optimization",
      "Local citations & directory listings (20+ platforms)",
      "Brand consistency across all digital channels"
    ],
    timeline: "6-8 weeks",
    price: "Starting at $9,500"
  },
  {
    id: "website-design",
    title: "Website Design",
    description: "Custom website designs that elevate your brand and engage visitors. From landing pages to full corporate websites, I create responsive designs that convert.",
    deliverables: [
      "Custom website designs (all pages)",
      "Responsive layouts (mobile, tablet, desktop)",
      "Brand-aligned visual design",
      "Interactive prototypes & style guide"
    ],
    timeline: "4-6 weeks",
    price: "Starting at $7,500"
  },
  {
    id: "mobile-app-design",
    title: "Mobile App Design",
    description: "Native iOS and Android app designs that follow platform guidelines while maintaining your brand identity. Optimized for touch interactions.",
    deliverables: [
      "iOS & Android designs",
      "Responsive layouts",
      "Interactive prototypes",
      "App icon & splash screens"
    ],
    timeline: "5-9 weeks",
    price: "Starting at $10,000"
  },
  {
    id: "web-app-design",
    title: "Web Application Design",
    description: "Responsive web application designs that work seamlessly across devices. From dashboards to complex SaaS products.",
    deliverables: [
      "Responsive web designs",
      "Dashboard & data visualization",
      "Component specifications",
      "Developer handoff files"
    ],
    timeline: "6-10 weeks",
    price: "Starting at $11,000"
  },
  {
    id: "ux-ui-design",
    title: "UX/UI Design",
    description: "End-to-end product design that balances user needs with business goals. From wireframes to high-fidelity prototypes, I create intuitive interfaces that users love.",
    deliverables: [
      "User flows & information architecture",
      "Wireframes & interactive prototypes",
      "High-fidelity UI designs",
      "Design handoff documentation"
    ],
    timeline: "4-8 weeks",
    price: "Starting at $8,000"
  },
  {
    id: "user-research",
    title: "User Research & Testing",
    description: "Data-driven insights to inform design decisions. I conduct comprehensive research to understand your users' behaviors, needs, and pain points.",
    deliverables: [
      "User interviews & surveys",
      "Usability testing sessions",
      "User personas & journey maps",
      "Research findings report"
    ],
    timeline: "2-4 weeks",
    price: "Starting at $4,500"
  },
  {
    id: "design-systems",
    title: "Design Systems",
    description: "Scalable design systems that ensure consistency across your product. I create comprehensive component libraries and design guidelines.",
    deliverables: [
      "Component library",
      "Design tokens & style guide",
      "Documentation & usage guidelines",
      "Figma/Sketch files"
    ],
    timeline: "6-10 weeks",
    price: "Starting at $12,000"
  },
  {
    id: "product-strategy",
    title: "Product Strategy",
    description: "Strategic planning to align your product vision with user needs and market opportunities. I help define product roadmaps and feature prioritization.",
    deliverables: [
      "Product vision & roadmap",
      "Competitive analysis",
      "Feature prioritization",
      "Strategic recommendations"
    ],
    timeline: "3-5 weeks",
    price: "Starting at $6,000"
  }
];
export const process = [
  {
    n: '01',
    title: 'Discovery',
    body: 'We start by understanding your business goals, your users, and the technical constraints the design has to live inside.',
  },
  {
    n: '02',
    title: 'Research & strategy',
    body: 'User research and competitive analysis, used to narrow the brief to the decisions that actually matter.',
  },
  {
    n: '03',
    title: 'Design & iterate',
    body: 'Wireframes through to high-fidelity screens, revised against feedback and testing rather than taste.',
  },
  {
    n: '04',
    title: 'Deliver & support',
    body: 'Handoff with documentation, plus review during build so what ships matches what was designed.',
  },
];
