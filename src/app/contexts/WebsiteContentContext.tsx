import React, { createContext, useContext, useState, useEffect } from "react";
import { WebsiteContent } from "../types/website-content";

interface WebsiteContentContextType {
  content: WebsiteContent;
  updateContent: (path: string, value: any) => void;
  resetContent: () => void;
}

const WebsiteContentContext = createContext<WebsiteContentContextType | undefined>(undefined);

// Default website content
const defaultContent: WebsiteContent = {
  home: {
    hero: {
      badge: "Available for select projects in 2026",
      title: "Designing products that",
      titleHighlight: "drive measurable results",
      subtitle: "Senior UX Designer helping B2B SaaS companies reduce churn by 40% and increase user activation through strategic, research-driven design.",
      primaryCTA: {
        text: "View case studies",
        link: "/work",
      },
      secondaryCTA: {
        text: "Book a call",
        link: "/contact",
      },
      stats: {
        projects: "50+",
        clients: "25+",
        experience: "8+",
      },
      images: {
        heroBackground: "",
        profileImage: "",
        decorativeImage: "",
      },
    },
  },
  about: {
    heroTitle: "Designing with Purpose, Building with Empathy",
    heroSubtitle: "A senior UX designer passionate about creating meaningful digital experiences that solve real problems.",
    mainImage: "",
    heroBackgroundImage: "",
    introduction: {
      title: "Hi, I'm a UX Designer",
      description: [
        "With over 8 years of experience, I specialize in designing user-centered digital products that balance business goals with user needs. My approach combines strategic thinking, deep user research, and elegant visual design.",
        "I've helped startups and established companies create products that users love and businesses can scale. From mobile apps to enterprise SaaS platforms, I bring clarity to complex problems through thoughtful design.",
      ],
    },
    philosophy: {
      title: "Design Philosophy",
      description: "Great design is invisible. It solves problems so elegantly that users don't even think about it. My approach is rooted in empathy, iteration, and measurable impact.",
      principles: [
        {
          title: "User-Centered",
          description: "Every decision starts and ends with the user. I believe in deep research, continuous testing, and letting data guide design choices.",
        },
        {
          title: "Strategic Thinking",
          description: "Good design isn't just beautiful—it achieves business goals. I align design decisions with company objectives and measure impact.",
        },
        {
          title: "Collaborative",
          description: "The best products come from diverse perspectives. I work closely with engineers, product managers, and stakeholders to build shared understanding.",
        },
        {
          title: "Iterative Process",
          description: "Design is never done. I embrace feedback, run experiments, and continuously improve based on real user behavior.",
        },
      ],
    },
    journey: {
      title: "Professional Journey",
      milestones: [
        {
          year: "2024-Present",
          title: "Senior UX Designer",
          description: "Leading design for enterprise SaaS products, focusing on reducing complexity and improving user activation.",
          company: "Enterprise Tech Co.",
        },
        {
          year: "2021-2024",
          title: "UX Designer",
          description: "Designed mobile-first experiences for fintech products, achieving 4.8 star rating on app stores.",
          company: "FinTech Startup",
        },
        {
          year: "2018-2021",
          title: "Product Designer",
          description: "Created design systems and led redesigns for multiple B2C products with millions of users.",
          company: "Digital Agency",
        },
        {
          year: "2016-2018",
          title: "Junior Designer",
          description: "Started my career designing websites and learning the fundamentals of user-centered design.",
          company: "Creative Studio",
        },
      ],
    },
    stats: {
      experience: "8+",
      projects: "50+",
      clients: "25+",
      awards: "12+",
    },
    skills: [
      {
        category: "Design",
        items: ["User Research", "Wireframing", "Prototyping", "Interaction Design", "Visual Design", "Design Systems"],
      },
      {
        category: "Strategy",
        items: ["Product Strategy", "User Testing", "Information Architecture", "Journey Mapping", "Competitive Analysis"],
      },
      {
        category: "Collaboration",
        items: ["Stakeholder Management", "Workshop Facilitation", "Design Critiques", "Agile/Scrum"],
      },
    ],
    tools: [
      {
        category: "Design Tools",
        items: ["Figma", "Sketch", "Adobe XD", "InVision", "Framer"],
      },
      {
        category: "Research Tools",
        items: ["Maze", "UserTesting", "Hotjar", "Lookback", "Optimal Workshop"],
      },
      {
        category: "Other",
        items: ["Jira", "Notion", "Miro", "FigJam", "Slack"],
      },
    ],
  },
  process: {
    heroTitle: "My Design Process",
    heroSubtitle: "A human-centered approach to solving complex problems",
    introduction: "Every project is unique, but my process remains consistent: understand deeply, explore broadly, design precisely, and validate continuously.",
    steps: [
      {
        id: "discover",
        number: "01",
        title: "Discover & Research",
        description: "I start by understanding the problem space, users, and business context through research and stakeholder interviews.",
        activities: [
          "Stakeholder interviews",
          "User interviews & surveys",
          "Competitive analysis",
          "Analytics review",
          "Heuristic evaluation",
        ],
        deliverables: [
          "Research findings report",
          "User personas",
          "Journey maps",
          "Problem statement",
        ],
      },
      {
        id: "define",
        number: "02",
        title: "Define & Strategize",
        description: "Synthesize research into clear insights and define the design strategy aligned with business goals.",
        activities: [
          "Insights synthesis",
          "Opportunity mapping",
          "Feature prioritization",
          "Success metrics definition",
          "Information architecture",
        ],
        deliverables: [
          "Strategy document",
          "Feature roadmap",
          "Site map",
          "User flows",
        ],
      },
      {
        id: "design",
        number: "03",
        title: "Design & Prototype",
        description: "Create solutions through iterative design, from low-fidelity concepts to high-fidelity prototypes.",
        activities: [
          "Sketching & ideation",
          "Wireframing",
          "Visual design",
          "Prototyping",
          "Design system creation",
        ],
        deliverables: [
          "Wireframes",
          "High-fidelity mockups",
          "Interactive prototypes",
          "Design specifications",
        ],
      },
      {
        id: "validate",
        number: "04",
        title: "Validate & Iterate",
        description: "Test designs with real users, gather feedback, and refine based on insights.",
        activities: [
          "Usability testing",
          "A/B testing setup",
          "Accessibility audit",
          "Stakeholder reviews",
          "Design iterations",
        ],
        deliverables: [
          "Testing reports",
          "Iteration recommendations",
          "Final designs",
          "Design handoff",
        ],
      },
      {
        id: "deliver",
        number: "05",
        title: "Deliver & Support",
        description: "Work closely with developers to ensure quality implementation and monitor post-launch performance.",
        activities: [
          "Developer collaboration",
          "QA support",
          "Launch monitoring",
          "Post-launch analysis",
          "Continuous improvement",
        ],
        deliverables: [
          "Development support",
          "Quality assurance",
          "Performance reports",
          "Optimization plan",
        ],
      },
    ],
    principles: [
      {
        title: "Empathy First",
        description: "Understanding users' needs, frustrations, and goals is the foundation of great design.",
      },
      {
        title: "Data-Informed",
        description: "Combine qualitative insights with quantitative data to make informed design decisions.",
      },
      {
        title: "Collaborative",
        description: "Involve stakeholders and team members throughout the process for better outcomes.",
      },
      {
        title: "Iterative",
        description: "Embrace feedback and continuously refine designs based on testing and real-world usage.",
      },
    ],
  },
  services: {
    heroTitle: "How I Can Help",
    heroSubtitle: "Comprehensive UX design services tailored to your needs",
    introduction: "Whether you need a complete product redesign or focused improvements to specific features, I offer flexible services to help your business succeed.",
    services: [
      {
        id: "product-design",
        title: "Product Design",
        description: "End-to-end product design from research to high-fidelity prototypes and design systems.",
        features: [
          "User research & insights",
          "Information architecture",
          "Wireframing & prototyping",
          "Visual design & UI",
          "Design system creation",
          "Developer handoff",
        ],
        pricing: {
          starting: "$8,000",
          note: "Per project, timeline varies",
        },
      },
      {
        id: "ux-audit",
        title: "UX Audit & Strategy",
        description: "Comprehensive evaluation of your product's user experience with actionable recommendations.",
        features: [
          "Heuristic evaluation",
          "User flow analysis",
          "Accessibility review",
          "Competitor analysis",
          "Prioritized recommendations",
          "Implementation roadmap",
        ],
        pricing: {
          starting: "$3,500",
          note: "2-3 week turnaround",
        },
      },
      {
        id: "user-research",
        title: "User Research",
        description: "Deep dive into your users' needs, behaviors, and pain points through qualitative and quantitative research.",
        features: [
          "User interviews",
          "Usability testing",
          "Surveys & analytics",
          "Persona development",
          "Journey mapping",
          "Insights report",
        ],
        pricing: {
          starting: "$4,000",
          note: "Customizable scope",
        },
      },
      {
        id: "design-system",
        title: "Design System",
        description: "Scalable design systems that maintain consistency and speed up development.",
        features: [
          "Component library",
          "Style guide",
          "Design tokens",
          "Documentation",
          "Figma file organization",
          "Developer collaboration",
        ],
        pricing: {
          starting: "$6,000",
          note: "Based on complexity",
        },
      },
      {
        id: "workshop",
        title: "Design Workshops",
        description: "Facilitated workshops to align teams, generate ideas, and solve design challenges collaboratively.",
        features: [
          "Design sprints",
          "Ideation sessions",
          "Journey mapping workshops",
          "Stakeholder alignment",
          "Problem framing",
          "Actionable outcomes",
        ],
        pricing: {
          starting: "$2,500",
          note: "Per workshop day",
        },
      },
      {
        id: "consulting",
        title: "UX Consulting",
        description: "Ongoing design guidance and support for your team on an hourly or retainer basis.",
        features: [
          "Design reviews",
          "Strategic guidance",
          "Team mentoring",
          "Process improvement",
          "Best practices",
          "Flexible engagement",
        ],
        pricing: {
          starting: "$150/hr",
          note: "Retainer discounts available",
        },
      },
    ],
    cta: {
      title: "Ready to work together?",
      description: "Let's discuss your project and find the right solution for your needs.",
      buttonText: "Schedule a free consultation",
    },
  },
  contact: {
    heroTitle: "Let's Work Together",
    heroSubtitle: "Have a project in mind? I'd love to hear about it.",
    email: "hello@designer.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/yourprofile",
      },
      {
        platform: "Dribbble",
        url: "https://dribbble.com/yourprofile",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/yourhandle",
      },
      {
        platform: "Behance",
        url: "https://behance.net/yourprofile",
      },
    ],
    availability: {
      status: "Available for select projects",
      description: "Currently accepting new projects starting Q2 2026. For urgent inquiries, please email directly.",
    },
    images: {
      heroBackground: "",
      decorativeImage: "",
      contactImage: "",
    },
  },
  work: {
    heroTitle: "Featured Work",
    heroSubtitle: "A selection of projects showcasing my design process and impact",
    featuredText: "Featured Projects",
    images: {
      heroBackground: "",
      decorativeImage: "",
    },
  },
  footer: {
    tagline: "Senior UX Designer crafting meaningful digital experiences with a focus on user-centered design and strategic thinking.",
    email: "hello@designer.com",
    phone: "+1 (555) 123-4567",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/yourprofile",
      },
      {
        platform: "Dribbble",
        url: "https://dribbble.com/yourprofile",
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/yourhandle",
      },
    ],
    copyright: "© 2026 All rights reserved.",
  },
  siteSettings: {
    siteName: "Portfolio",
    siteTagline: "Senior UX Designer",
    logo: "",
    favicon: "",
    ogImage: "",
    images: {
      lightLogo: "",
      darkLogo: "",
      mobileLogo: "",
    },
  },
};

export function WebsiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);

  // Load content from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("website_content");
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading website content:", error);
      }
    }
  }, []);

  // Save to localStorage whenever content changes
  useEffect(() => {
    localStorage.setItem("website_content", JSON.stringify(content));
  }, [content]);

  // Update nested content using dot notation path
  const updateContent = (path: string, value: any) => {
    setContent((prev) => {
      const newContent = { ...prev };
      const keys = path.split(".");
      let current: any = newContent;

      // Navigate to the parent of the target property
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        } else {
          current[keys[i]] = { ...current[keys[i]] };
        }
        current = current[keys[i]];
      }

      // Set the value
      current[keys[keys.length - 1]] = value;

      return newContent;
    });
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.setItem("website_content", JSON.stringify(defaultContent));
  };

  return (
    <WebsiteContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </WebsiteContentContext.Provider>
  );
}

export function useWebsiteContent() {
  const context = useContext(WebsiteContentContext);
  if (context === undefined) {
    throw new Error("useWebsiteContent must be used within a WebsiteContentProvider");
  }
  return context;
}