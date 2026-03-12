import { type Stage } from "@/lib/stages";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  stage: Stage;
  children: React.ReactNode;
}

export default function StageLayout({ stage, children }: Props) {
  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Stage {stage.id}</span>
          <span>·</span>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            {stage.technique}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold text-foreground">{stage.title}</h1>
        <p className="text-muted-foreground">{stage.description}</p>
      </header>

      <div className="rounded border border-border bg-card p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <div className="text-sm">
          <span className="text-muted-foreground">SUCCESS_TOKEN: </span>
          <code className="text-warning font-mono">{stage.token}</code>
        </div>
      </div>

      <div className="prose-invert space-y-4">{children}</div>

      <div className="rounded border border-border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="w-4 h-4 text-info" />
          Why this matters
        </div>
        <p className="text-sm text-muted-foreground">{stage.whyMatters}</p>
      </div>

      {stage.viewSourceTip && (
        <p className="text-xs text-muted-foreground italic">
          💡 View source tip: {stage.viewSourceTip}
        </p>
      )}
    </article>
  );
}
