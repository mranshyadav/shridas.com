import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  Image, 
  Settings, 
  LogOut,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";

export function CMSLayout() {
  const { user, hasRole, logout, isLoading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // The stored session is restored in an effect, so the first render always has
  // user === null. Redirecting during that frame logged you out on every
  // refresh of an /admin page — wait for the check to finish first.
  if (isLoading) {
    return null;
  }

  // Send anyone without a role to the admin sign-in page. It is not linked from
  // the public site.
  if (!user || !hasRole(["admin", "editor", "viewer"])) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      roles: ["admin", "editor", "viewer"],
    },
    {
      name: "Content",
      path: "/admin/content",
      icon: FileText,
      roles: ["admin", "editor", "viewer"],
    },
    {
      name: "Media",
      path: "/admin/media",
      icon: Image,
      roles: ["admin", "editor"],
    },
    {
      name: "Chatbot Analytics",
      path: "/admin/chatbot",
      icon: MessageCircle,
      roles: ["admin"],
    },
  ];

  const filteredNavigation = navigation.filter(item =>
    item.roles.some(role => hasRole([role as any]))
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
          }}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 transition-transform duration-300 z-40 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRight: "1px solid var(--border-default)",
        }}
      >
        <div className="p-6">
          {/* Logo/Title */}
          <Link to="/">
            <h2 
              className="text-2xl mb-2"
              style={{ color: "var(--text-primary)", fontWeight: 600 }}
            >
              CMS
            </h2>
          </Link>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Content Management
          </p>
        </div>

        {/* User Info */}
        <div 
          className="mx-6 p-4 rounded-lg mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-default)",
          }}
        >
          <p 
            className="text-sm mb-1"
            style={{ color: "var(--text-primary)", fontWeight: 500 }}
          >
            {user.name}
          </p>
          <p 
            className="text-xs"
            style={{ color: "var(--text-tertiary)" }}
          >
            {user.email}
          </p>
          <div className="mt-2">
            <span
              className="inline-block px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "white",
                opacity: 0.8,
              }}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: isActive 
                    ? "var(--accent-primary)" 
                    : "transparent",
                  color: isActive 
                    ? "white" 
                    : "var(--text-primary)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "var(--bg-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                <span style={{ fontWeight: isActive ? 500 : 400 }}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: "transparent",
              color: "var(--text-primary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}