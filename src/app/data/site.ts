/**
 * Single source of truth for identity, contact and navigation.
 *
 * Anything wrapped in `PLACEHOLDER` markers below is copy you still need to
 * write. It renders with a dotted underline on the site so it is impossible to
 * ship by accident — see components/site/Placeholder.tsx.
 */

export const site = {
  name: 'Ansh Yadav',
  shortName: 'Ansh',
  role: 'Product Designer',
  domain: 'shridas.com',
  location: 'New Delhi, India — working remotely',
  timezone: 'IST (UTC+5:30)',

  email: 'mranshyadav74@gmail.com',
  phone: '+91 96969 75512',
  phoneHref: '+919696975512',

  /** Shown next to the live dot in the header and on the contact page. */
  availability: {
    open: true,
    label: 'Open to product design roles',
  },

  resumeUrl: '/resume.pdf',

  socials: [
    { label: 'LinkedIn', handle: 'in/ansh001', url: 'https://www.linkedin.com/in/ansh001/' },
    { label: 'Behance', handle: 'anshyadav68', url: 'https://www.behance.net/anshyadav68' },
    { label: 'Dribbble', handle: 'Ansh_Yadav', url: 'https://dribbble.com/Ansh_Yadav' },
  ],
} as const;

export const nav = [
  { label: 'Work', to: '/work' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
] as const;
