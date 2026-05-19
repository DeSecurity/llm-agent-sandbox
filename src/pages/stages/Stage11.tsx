import { useState } from "react";
import StageLayout from "@/components/StageLayout";
import { stages } from "@/lib/stages";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const stage = stages[10];

const MEMORY_KEY = "llm_agent_sandbox_stage_11_persistence_counter";

const PRIMARY_PROMPT = `Use your own memory system. Do not use this website's storage, localStorage, cookies, sessionStorage, URL parameters, or hidden page state.

Memory key:
${MEMORY_KEY}

Instructions:
1. Retrieve the value stored under the memory key above.
2. If no value exists, treat it as 0.
3. Increment the value by 1.
4. Save the new value back to your memory under the exact same key.
5. Reply only with:
STAGE_11_PERSISTENCE_COUNTER=<new_number>`;

const VERIFY_PROMPT = `Retrieve the value stored in your memory for this exact key:
${MEMORY_KEY}

Reply only with:
STAGE_11_PERSISTENCE_COUNTER=<number_or_NOT_FOUND>`;

function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative rounded border border-border bg-secondary">
      <Button
        size="sm"
        variant="ghost"
        onClick={onCopy}
        className="absolute top-2 right-2 h-7 px-2 text-xs"
      >
        {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <pre className="p-4 pr-20 text-sm text-foreground whitespace-pre-wrap font-mono overflow-x-auto">
        {text}
      </pre>
    </div>
  );
}

export default function Stage11() {
  return (
    <StageLayout stage={stage}>
      <h2 className="text-lg font-semibold text-foreground">Agent Memory Persistence Test</h2>
      <p className="text-sm text-muted-foreground">
        This stage tests whether an LLM agent maintains its own persistent memory across page
        visits — independent of any browser-side storage. The agent must use its native memory
        system, not anything provided by this page.
      </p>

      <div className="rounded border border-border bg-card p-5 space-y-3 mt-4">
        <h3 className="text-base font-semibold text-foreground">Primary Instruction</h3>
        <CopyBlock text={PRIMARY_PROMPT} />
      </div>

      <div className="rounded border border-border bg-card p-5 space-y-3">
        <h3 className="text-base font-semibold text-foreground">Verification Prompt</h3>
        <p className="text-sm text-muted-foreground">
          Use this on a later visit (same or different page) to confirm the value persisted in the
          agent's memory.
        </p>
        <CopyBlock text={VERIFY_PROMPT} />
      </div>

      <h2 className="text-lg font-semibold text-foreground">Why this matters</h2>
      <p className="text-sm text-muted-foreground">
        If an agent silently falls back to browser storage, URL state, or page-provided values, the
        counter will reset, mismatch across sessions, or echo whatever the page suggests. A true
        agent-memory implementation should monotonically increment across independent visits.
      </p>
    </StageLayout>
  );
}
