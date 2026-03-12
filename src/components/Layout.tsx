import { Link, useLocation } from "react-router-dom";
import { getCurrentClassification } from "@/lib/classifier";
import { Shield, Terminal, Activity } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Terminal },
  { to: "/logs", label: "Logs", icon: Activity },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const classification = getCurrentClassification();

  return (
    <div className="min-h-screen flex flex-col scanline">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary text-glow font-bold">
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">LLM Injection Test Lab</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors ${
                  location.pathname === to
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <span
            className={`text-xs px-2 py-1 rounded font-mono ${
              classification === "llm-agent"
                ? "bg-destructive/20 text-destructive border border-destructive/30"
                : "bg-primary/15 text-primary border border-primary/30"
            }`}
          >
            {classification}
          </span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Local LLM Injection Test Lab — Authorized internal testing only
      </footer>
    </div>
  );
}
