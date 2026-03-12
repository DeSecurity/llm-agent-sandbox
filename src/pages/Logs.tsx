import { useSyncExternalStore } from "react";
import { getLogs, clearLogs, subscribe } from "@/lib/logger";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Logs() {
  const logs = useSyncExternalStore(subscribe, getLogs);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Request Logs</h1>
        <button
          onClick={() => { clearLogs(); toast.success("Logs cleared"); }}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear Logs
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground">No logs yet. Navigate to stage pages to generate entries.</p>
      ) : (
        <div className="rounded border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary text-secondary-foreground">
                <th className="text-left p-2 font-medium">Time</th>
                <th className="text-left p-2 font-medium">Path</th>
                <th className="text-left p-2 font-medium">Classification</th>
                <th className="text-left p-2 font-medium hidden lg:table-cell">User-Agent</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="p-2 text-muted-foreground whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="p-2 font-mono text-foreground">{log.path}</td>
                  <td className="p-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${
                        log.classification === "llm-agent"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      {log.classification}
                    </span>
                  </td>
                  <td className="p-2 text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                    {log.userAgent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
