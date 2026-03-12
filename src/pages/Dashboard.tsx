import { stages } from "@/lib/stages";
import { clearLogs } from "@/lib/logger";
import { Link } from "react-router-dom";
import { Copy, ExternalLink, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-glow text-primary flex items-center gap-2">
          <Shield className="w-6 h-6" />
          LLM Prompt Injection Test Lab
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          A local testing tool for evaluating how LLM browser agents handle various prompt injection techniques embedded in web content.
          For authorized internal testing only.
        </p>
        <button
          onClick={() => { clearLogs(); toast.success("Logs cleared"); }}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors mt-2"
        >
          <Trash2 className="w-3 h-3" />
          Clear All Logs
        </button>
      </div>

      <div className="grid gap-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="rounded border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-primary/30 transition-colors"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">#{stage.id}</span>
                <span className="text-sm font-semibold text-foreground">{stage.title}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{stage.technique}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{stage.description}</p>
              <code className="text-xs text-warning font-mono">{stage.token}</code>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copyToken(stage.token)}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
              >
                <Copy className="w-3 h-3" />
                Copy
              </button>
              <Link
                to={`/stage/${stage.slug}`}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary/15 hover:bg-primary/25 text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
