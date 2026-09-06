import React, { useState, useEffect } from "react";
import { useWebsiteContent } from "../../contexts/WebsiteContentContext";
import { ArrowLeft, Save, RotateCcw, Image, Type, Link as LinkIcon, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

type Section = "home" | "about" | "process" | "services" | "contact" | "work" | "footer" | "settings";

export function WebsiteContentEditor() {
  const { content, updateContent, resetContent } = useWebsiteContent();
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [hasChanges, setHasChanges] = useState(false);

  // Debug: Log content structure on mount
  useEffect(() => {
    console.log("Website Content Structure:", {
      hasHomeHeroImages: !!content.home?.hero?.images,
      hasContactImages: !!content.contact?.images,
      hasWorkImages: !!content.work?.images,
      hasSiteSettingsImages: !!content.siteSettings?.images,
    });
  }, []);

  const sections = [
    { id: "home" as Section, label: "Home Page", icon: "🏠" },
    { id: "about" as Section, label: "About Page", icon: "👤" },
    { id: "process" as Section, label: "Process Page", icon: "⚙️" },
    { id: "services" as Section, label: "Services Page", icon: "💼" },
    { id: "contact" as Section, label: "Contact Page", icon: "📧" },
    { id: "work" as Section, label: "Work Page", icon: "💼" },
    { id: "footer" as Section, label: "Footer", icon: "📄" },
    { id: "settings" as Section, label: "Site Settings", icon: "⚙️" },
  ];

  const handleUpdate = (path: string, value: any) => {
    console.log("Updating content:", { path, value });
    updateContent(path, value);
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Content saved successfully!");
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all content to defaults? This cannot be undone.")) {
      resetContent();
      toast.success("Content reset to defaults");
      setHasChanges(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <div
        className="border-b sticky top-0 z-10"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-opacity-10 transition-all duration-200"
                style={{ backgroundColor: "var(--accent-subtle)" }}
              >
                <ArrowLeft size={20} style={{ color: "var(--text-primary)" }} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  Website Content Manager
                </h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Edit all content across your portfolio website
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg border transition-all duration-200 hover:bg-opacity-10 flex items-center gap-2"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                style={{
                  backgroundColor: hasChanges ? "var(--accent-primary)" : "var(--accent-subtle)",
                  color: hasChanges ? "#fff" : "var(--text-secondary)",
                }}
              >
                <Save size={16} />
                {hasChanges ? "Save Changes" : "Saved"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Section Navigation */}
          <div className="lg:col-span-1">
            <div
              className="rounded-lg border p-4 sticky top-24"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-secondary)" }}>
                SECTIONS
              </h3>
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3"
                    style={{
                      backgroundColor: activeSection === section.id ? "var(--accent-subtle)" : "transparent",
                      color: activeSection === section.id ? "var(--accent-primary)" : "var(--text-primary)",
                    }}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div
              className="rounded-lg border p-8"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              {activeSection === "home" && <HomeEditor content={content.home} onUpdate={handleUpdate} />}
              {activeSection === "about" && <AboutEditor content={content.about} onUpdate={handleUpdate} />}
              {activeSection === "contact" && <ContactEditor content={content.contact} onUpdate={handleUpdate} />}
              {activeSection === "work" && <WorkEditor content={content.work} onUpdate={handleUpdate} />}
              {activeSection === "footer" && <FooterEditor content={content.footer} onUpdate={handleUpdate} />}
              {activeSection === "settings" && <SettingsEditor content={content.siteSettings} onUpdate={handleUpdate} />}
              {(activeSection === "process" || activeSection === "services") && (
                <ComingSoonMessage section={activeSection} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home Editor Component
function HomeEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Home Page - Hero Section
        </h2>
      </div>

      <div className="space-y-6">
        <InputField
          label="Badge Text"
          value={content.hero.badge}
          onChange={(value) => onUpdate("home.hero.badge", value)}
          placeholder="Available for select projects in 2026"
        />

        <InputField
          label="Main Title"
          value={content.hero.title}
          onChange={(value) => onUpdate("home.hero.title", value)}
          placeholder="Designing products that"
        />

        <InputField
          label="Title Highlight"
          value={content.hero.titleHighlight}
          onChange={(value) => onUpdate("home.hero.titleHighlight", value)}
          placeholder="drive measurable results"
          hint="This text will be highlighted with accent color"
        />

        <TextAreaField
          label="Subtitle"
          value={content.hero.subtitle}
          onChange={(value) => onUpdate("home.hero.subtitle", value)}
          placeholder="Your value proposition..."
          rows={3}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Primary CTA Text"
            value={content.hero.primaryCTA.text}
            onChange={(value) => onUpdate("home.hero.primaryCTA.text", value)}
            placeholder="View case studies"
          />
          <InputField
            label="Primary CTA Link"
            value={content.hero.primaryCTA.link}
            onChange={(value) => onUpdate("home.hero.primaryCTA.link", value)}
            placeholder="/work"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Secondary CTA Text"
            value={content.hero.secondaryCTA.text}
            onChange={(value) => onUpdate("home.hero.secondaryCTA.text", value)}
            placeholder="Book a call"
          />
          <InputField
            label="Secondary CTA Link"
            value={content.hero.secondaryCTA.link}
            onChange={(value) => onUpdate("home.hero.secondaryCTA.link", value)}
            placeholder="/contact"
          />
        </div>

        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Stats
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <InputField
              label="Projects Completed"
              value={content.hero.stats.projects}
              onChange={(value) => onUpdate("home.hero.stats.projects", value)}
              placeholder="50+"
            />
            <InputField
              label="Happy Clients"
              value={content.hero.stats.clients}
              onChange={(value) => onUpdate("home.hero.stats.clients", value)}
              placeholder="25+"
            />
            <InputField
              label="Years Experience"
              value={content.hero.stats.experience}
              onChange={(value) => onUpdate("home.hero.stats.experience", value)}
              placeholder="8+"
            />
          </div>
        </div>

        {/* Image Management Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            Hero Images
          </h3>
          <ImageField
            label="Hero Background Image"
            value={content.hero.images?.heroBackground || ""}
            onChange={(value) => onUpdate("home.hero.images.heroBackground", value)}
            hint="Full-width background image (recommended: 1920x1080px)"
          />
          <ImageField
            label="Profile Image"
            value={content.hero.images?.profileImage || ""}
            onChange={(value) => onUpdate("home.hero.images.profileImage", value)}
            hint="Your professional photo (recommended: 600x600px)"
          />
          <ImageField
            label="Decorative Image"
            value={content.hero.images?.decorativeImage || ""}
            onChange={(value) => onUpdate("home.hero.images.decorativeImage", value)}
            hint="Optional decorative element (recommended: 800x800px)"
          />
        </div>
      </div>
    </div>
  );
}

// About Editor Component
function AboutEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          About Page Content
        </h2>
      </div>

      <div className="space-y-6">
        <InputField
          label="Hero Title"
          value={content.heroTitle}
          onChange={(value) => onUpdate("about.heroTitle", value)}
          placeholder="Designing with Purpose, Building with Empathy"
        />

        <TextAreaField
          label="Hero Subtitle"
          value={content.heroSubtitle}
          onChange={(value) => onUpdate("about.heroSubtitle", value)}
          rows={2}
        />

        {/* Image Management Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            About Page Images
          </h3>
          <ImageField
            label="Main Profile Image"
            value={content.mainImage}
            onChange={(value) => onUpdate("about.mainImage", value)}
            hint="Your main about page photo (recommended: 800x1000px)"
          />
          <ImageField
            label="Hero Background Image"
            value={content.heroBackgroundImage || ""}
            onChange={(value) => onUpdate("about.heroBackgroundImage", value)}
            hint="Optional background image for the hero section (recommended: 1920x600px)"
          />
        </div>

        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Introduction Section
          </h3>
          <InputField
            label="Title"
            value={content.introduction.title}
            onChange={(value) => onUpdate("about.introduction.title", value)}
          />
          <TextAreaField
            label="Description Paragraph 1"
            value={content.introduction.description[0]}
            onChange={(value) => {
              const newDesc = [...content.introduction.description];
              newDesc[0] = value;
              onUpdate("about.introduction.description", newDesc);
            }}
            rows={3}
          />
          <TextAreaField
            label="Description Paragraph 2"
            value={content.introduction.description[1]}
            onChange={(value) => {
              const newDesc = [...content.introduction.description];
              newDesc[1] = value;
              onUpdate("about.introduction.description", newDesc);
            }}
            rows={3}
          />
        </div>

        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Stats
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <InputField
              label="Experience"
              value={content.stats.experience}
              onChange={(value) => onUpdate("about.stats.experience", value)}
            />
            <InputField
              label="Projects"
              value={content.stats.projects}
              onChange={(value) => onUpdate("about.stats.projects", value)}
            />
            <InputField
              label="Clients"
              value={content.stats.clients}
              onChange={(value) => onUpdate("about.stats.clients", value)}
            />
            <InputField
              label="Awards"
              value={content.stats.awards}
              onChange={(value) => onUpdate("about.stats.awards", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Editor Component
function ContactEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Contact Page Content
        </h2>
      </div>

      <div className="space-y-6">
        <InputField
          label="Hero Title"
          value={content.heroTitle}
          onChange={(value) => onUpdate("contact.heroTitle", value)}
        />

        <TextAreaField
          label="Hero Subtitle"
          value={content.heroSubtitle}
          onChange={(value) => onUpdate("contact.heroSubtitle", value)}
          rows={2}
        />

        <InputField
          label="Email"
          value={content.email}
          onChange={(value) => onUpdate("contact.email", value)}
          icon={<Mail size={18} />}
          type="email"
        />

        <InputField
          label="Phone"
          value={content.phone}
          onChange={(value) => onUpdate("contact.phone", value)}
          icon={<Phone size={18} />}
        />

        <InputField
          label="Location"
          value={content.location}
          onChange={(value) => onUpdate("contact.location", value)}
          icon={<MapPin size={18} />}
        />

        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Availability Status
          </h3>
          <InputField
            label="Status"
            value={content.availability.status}
            onChange={(value) => onUpdate("contact.availability.status", value)}
            placeholder="Available for select projects"
          />
          <TextAreaField
            label="Description"
            value={content.availability.description}
            onChange={(value) => onUpdate("contact.availability.description", value)}
            rows={2}
          />
        </div>

        {/* Image Management Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            Contact Page Images
          </h3>
          <ImageField
            label="Hero Background Image"
            value={content.images?.heroBackground || ""}
            onChange={(value) => onUpdate("contact.images.heroBackground", value)}
            hint="Background image for the contact hero section (recommended: 1920x600px)"
          />
          <ImageField
            label="Decorative Image"
            value={content.images?.decorativeImage || ""}
            onChange={(value) => onUpdate("contact.images.decorativeImage", value)}
            hint="Optional decorative element (recommended: 800x800px)"
          />
          <ImageField
            label="Contact Image"
            value={content.images?.contactImage || ""}
            onChange={(value) => onUpdate("contact.images.contactImage", value)}
            hint="Photo for contact section (recommended: 600x600px)"
          />
        </div>
      </div>
    </div>
  );
}

// Work Editor Component
function WorkEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Work Page Content
        </h2>
      </div>

      <div className="space-y-6">
        <InputField
          label="Hero Title"
          value={content.heroTitle}
          onChange={(value) => onUpdate("work.heroTitle", value)}
        />

        <TextAreaField
          label="Hero Subtitle"
          value={content.heroSubtitle}
          onChange={(value) => onUpdate("work.heroSubtitle", value)}
          rows={2}
        />

        <InputField
          label="Featured Section Text"
          value={content.featuredText}
          onChange={(value) => onUpdate("work.featuredText", value)}
        />

        {/* Image Management Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            Work Page Images
          </h3>
          <ImageField
            label="Hero Background Image"
            value={content.images?.heroBackground || ""}
            onChange={(value) => onUpdate("work.images.heroBackground", value)}
            hint="Background image for the work hero section (recommended: 1920x600px)"
          />
          <ImageField
            label="Decorative Image"
            value={content.images?.decorativeImage || ""}
            onChange={(value) => onUpdate("work.images.decorativeImage", value)}
            hint="Optional decorative element (recommended: 800x800px)"
          />
        </div>
      </div>
    </div>
  );
}

// Footer Editor Component
function FooterEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Footer Content
        </h2>
      </div>

      <div className="space-y-6">
        <TextAreaField
          label="Tagline"
          value={content.tagline}
          onChange={(value) => onUpdate("footer.tagline", value)}
          rows={2}
        />

        <InputField
          label="Email"
          value={content.email}
          onChange={(value) => onUpdate("footer.email", value)}
          icon={<Mail size={18} />}
        />

        <InputField
          label="Phone"
          value={content.phone}
          onChange={(value) => onUpdate("footer.phone", value)}
          icon={<Phone size={18} />}
        />

        <InputField
          label="Copyright Text"
          value={content.copyright}
          onChange={(value) => onUpdate("footer.copyright", value)}
        />
      </div>
    </div>
  );
}

// Settings Editor Component
function SettingsEditor({ content, onUpdate }: any) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Site Settings
        </h2>
      </div>

      <div className="space-y-6">
        <InputField
          label="Site Name"
          value={content.siteName}
          onChange={(value) => onUpdate("siteSettings.siteName", value)}
        />

        <InputField
          label="Site Tagline"
          value={content.siteTagline}
          onChange={(value) => onUpdate("siteSettings.siteTagline", value)}
        />

        {/* Brand Images Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            Brand & Logo Images
          </h3>
          <ImageField
            label="Primary Logo"
            value={content.logo || ""}
            onChange={(value) => onUpdate("siteSettings.logo", value)}
            hint="Main website logo (recommended: 200x200px, transparent PNG)"
          />
          <ImageField
            label="Light Mode Logo"
            value={content.images?.lightLogo || ""}
            onChange={(value) => onUpdate("siteSettings.images.lightLogo", value)}
            hint="Logo for light theme (recommended: 200x200px, transparent PNG)"
          />
          <ImageField
            label="Dark Mode Logo"
            value={content.images?.darkLogo || ""}
            onChange={(value) => onUpdate("siteSettings.images.darkLogo", value)}
            hint="Logo for dark theme (recommended: 200x200px, transparent PNG)"
          />
          <ImageField
            label="Mobile Logo"
            value={content.images?.mobileLogo || ""}
            onChange={(value) => onUpdate("siteSettings.images.mobileLogo", value)}
            hint="Compact logo for mobile (recommended: 100x100px, transparent PNG)"
          />
        </div>

        {/* SEO & Social Images Section */}
        <div
          className="rounded-lg border p-6 space-y-4"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Image size={20} />
            SEO & Social Media Images
          </h3>
          <ImageField
            label="Favicon"
            value={content.favicon || ""}
            onChange={(value) => onUpdate("siteSettings.favicon", value)}
            hint="Website favicon (recommended: 64x64px, square)"
          />
          <ImageField
            label="Open Graph Image"
            value={content.ogImage || ""}
            onChange={(value) => onUpdate("siteSettings.ogImage", value)}
            hint="Social media preview image (recommended: 1200x630px)"
          />
        </div>
      </div>
    </div>
  );
}

// Coming Soon Message
function ComingSoonMessage({ section }: { section: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🚧</div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {section.charAt(0).toUpperCase() + section.slice(1)} Editor Coming Soon
      </h3>
      <p style={{ color: "var(--text-secondary)" }}>
        This section editor is currently under development.
      </p>
    </div>
  );
}

// Reusable Input Field Component
function InputField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }}>
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            paddingLeft: icon ? "2.5rem" : "1rem",
          }}
        />
      </div>
      {hint && (
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// Reusable TextArea Field Component
function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}

// Reusable Image Field Component
function ImageField({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || ""}
              className="w-full px-4 py-3 rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-2 hover:bg-opacity-10"
              style={{
                backgroundColor: showPreview ? "var(--accent-subtle)" : "var(--bg-primary)",
                borderColor: "var(--border-color)",
                color: showPreview ? "var(--accent-primary)" : "var(--text-secondary)",
              }}
            >
              <Image size={16} />
              {showPreview ? "Hide" : "Preview"}
            </button>
          )}
        </div>
        {showPreview && value && (
          <div
            className="rounded-lg border p-4 flex items-center justify-center"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-color)",
              minHeight: "200px",
            }}
          >
            <img
              src={value}
              alt={`Preview of ${label}`}
              className="max-w-full max-h-64 object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23ddd' width='200' height='200'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        )}
      </div>
      {hint && (
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}