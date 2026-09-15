/**
 * Bank sign-off review: solo full-review queue over the OCR draft bank.
 * Decisions persist locally; approved records export to the reviewed-import
 * shape the Source library already accepts.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check, Download, Flag, ImageIcon, Upload, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loadOcrDraftQuestions, type OcrDraftQuestion } from "@/lib/ocrDraftSections";
import {
  approvalBlockers,
  buildApprovedExport,
  downloadJson,
  draftViewWithCorrections,
  loadReviewDecisions,
  orderDraftsForReview,
  REVIEW_SUBJECT_ORDER,
  saveReviewDecisions,
  summarizeProgress,
  type BankReviewCorrections,
  type BankReviewDecisionMap,
  type BankReviewDecisionValue,
} from "@/lib/bankReview";

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

function blankCorrections(): BankReviewCorrections {
  return {};
}

export default function BankReview() {
  const [drafts, setDrafts] = useState<OcrDraftQuestion[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<BankReviewDecisionMap>(() => loadReviewDecisions());
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [position, setPosition] = useState(0);
  const [edits, setEdits] = useState<BankReviewCorrections>(blankCorrections());
  const [rejectReason, setRejectReason] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadOcrDraftQuestions()
      .then((loaded) => setDrafts(orderDraftsForReview(loaded)))
      .catch((err) => setLoadError(String(err?.message ?? err)));
  }, []);

  useEffect(() => {
    try {
      saveReviewDecisions(decisions);
    } catch {
      setNotice("Browser storage is full; export a decisions backup before continuing.");
    }
  }, [decisions]);

  const queue = useMemo(
    () => (drafts ?? []).filter((draft) => !subjectFilter || draft.subject === subjectFilter),
    [drafts, subjectFilter],
  );

  const progress = useMemo(
    () => (drafts ? summarizeProgress(drafts, decisions) : null),
    [drafts, decisions],
  );

  const current = queue[Math.min(position, Math.max(queue.length - 1, 0))] ?? null;
  const currentDecision = current ? decisions[current.id] : undefined;

  useEffect(() => {
    setPosition(0);
  }, [subjectFilter]);

  useEffect(() => {
    setEdits(currentDecision?.corrected ?? blankCorrections());
    setRejectReason(currentDecision?.decision === "rejected" ? (currentDecision.reason ?? "") : "");
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const view = useMemo(
    () => (current ? draftViewWithCorrections(current, edits) : null),
    [current, edits],
  );
  const blockers = useMemo(() => (view ? approvalBlockers(view) : []), [view]);

  const move = useCallback(
    (direction: 1 | -1) => {
      setPosition((previous) => Math.min(Math.max(previous + direction, 0), Math.max(queue.length - 1, 0)));
    },
    [queue.length],
  );

  const jumpToNextUndecided = useCallback(() => {
    const start = position + 1;
    for (let offset = 0; offset < queue.length; offset += 1) {
      const index = (start + offset) % queue.length;
      if (!decisions[queue[index].id]) {
        setPosition(index);
        return;
      }
    }
    setNotice("Every item in this queue has a decision.");
  }, [decisions, position, queue]);

  function recordDecision(decision: BankReviewDecisionValue) {
    if (!current || !view) return;
    if (decision === "approved" && blockers.length > 0) {
      setNotice("Resolve the listed blockers before approving.");
      return;
    }
    if (decision === "rejected" && !rejectReason.trim()) {
      setNotice("Add a short reject reason so the item can be triaged later.");
      return;
    }
    setDecisions((previous) => ({
      ...previous,
      [current.id]: {
        questionId: current.id,
        decision,
        reason: decision === "rejected" ? rejectReason.trim() : undefined,
        corrected: { ...edits },
        reviewedAt: new Date().toISOString(),
      },
    }));
    setNotice(
      decision === "approved"
        ? `Approved ${current.id}.`
        : decision === "needs_image"
          ? `Marked ${current.id} as needs-image.`
          : `Rejected ${current.id}.`,
    );
    move(1);
  }

  function clearDecision() {
    if (!current) return;
    setDecisions((previous) => {
      const next = { ...previous };
      delete next[current.id];
      return next;
    });
    setEdits(blankCorrections());
    setRejectReason("");
  }

  function exportApproved() {
    if (!drafts) return;
    const exported = buildApprovedExport(drafts, decisions);
    if (!exported.length) {
      setNotice("No valid approved records to export yet.");
      return;
    }
    downloadJson("approved-questions.json", { questions: exported });
    setNotice(`Exported ${exported.length} approved questions for Source library import.`);
  }

  function exportDecisionsBackup() {
    downloadJson("bank-review-decisions.json", { version: 1, exportedAt: new Date().toISOString(), decisions });
    setNotice(`Backed up ${Object.keys(decisions).length} review decisions.`);
  }

  function importDecisionsBackup(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { decisions?: BankReviewDecisionMap };
        const incoming = parsed.decisions ?? (parsed as unknown as BankReviewDecisionMap);
        if (!incoming || typeof incoming !== "object") throw new Error("bad backup");
        setDecisions(incoming);
        setNotice(`Restored ${Object.keys(incoming).length} review decisions from backup.`);
      } catch {
        setNotice("This does not look like a bank-review decisions backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      if (!current) return;
      if (event.key >= "1" && event.key <= "5") {
        const index = Number(event.key) - 1;
        if (index < (view?.options.length ?? 0)) setEdits((previous) => ({ ...previous, correctOption: index }));
      } else if (event.key === "a") recordDecision("approved");
      else if (event.key === "i") recordDecision("needs_image");
      else if (event.key === "r") recordDecision("rejected");
      else if (event.key === "ArrowRight") move(1);
      else if (event.key === "ArrowLeft") move(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (loadError) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="font-serif text-2xl text-[#193d38]">Bank review failed to load</p>
        <p className="mt-2 text-sm text-[#506c65]">{loadError}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-[#087c77]">Back to study desk</Link>
      </main>
    );
  }

  if (!drafts || !progress || !current || !view) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="font-serif text-2xl text-[#193d38]">Loading 5,233-question review queue…</p>
        <p className="mt-2 text-sm text-[#506c65]">Fetching the OCR bank for offline sign-off.</p>
      </main>
    );
  }

  const percent = progress.total ? Math.round(((progress.approved + progress.needsImage + progress.rejected) / progress.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f6f5f0]">
      <header className="sticky top-0 z-20 border-b border-[#d8ded8]/80 bg-[#f6f5f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-[#345550] hover:text-[#087c77]">
            <ArrowLeft size={16} /> Study desk
          </Link>
          <h1 className="font-serif text-xl text-[#183432]">Bank sign-off</h1>
          <span className="text-xs font-semibold text-[#668079]">
            {position + 1} / {queue.length}{subjectFilter ? ` · ${subjectFilter}` : " · all subjects"}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportDecisionsBackup}><Download size={14} /> Decisions</Button>
            <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs font-semibold text-[#31544e] hover:bg-[#edf5f1]">
              <Upload size={14} /> Restore<input type="file" accept="application/json,.json" onChange={importDecisionsBackup} className="sr-only" />
            </label>
            <Button size="sm" onClick={exportApproved} className="bg-[#087c77] text-white hover:bg-[#066d69]">
              <Check size={14} /> Export approved ({progress.approved})
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-4 pb-3 sm:px-6">
          <div className="h-2 overflow-hidden rounded-full bg-[#e2ece8]">
            <div className="h-full rounded-full bg-[#087c77] transition-all" style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-[#668079]">
            {progress.approved} approved · {progress.needsImage} needs-image · {progress.rejected} rejected · {progress.remaining} remaining ({percent}%)
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="space-y-2 self-start rounded-2xl border border-[#d8e2dc] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#71857e]">Subjects in order</p>
          <button
            onClick={() => setSubjectFilter(null)}
            className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm", !subjectFilter ? "bg-[#087c77] font-semibold text-white" : "text-[#31544e] hover:bg-[#eff6f2]")}
          >
            All subjects <span className="text-xs">{progress.total - progress.remaining}/{progress.total}</span>
          </button>
          {REVIEW_SUBJECT_ORDER.map((subject) => {
            const entry = progress.perSubject[subject];
            if (!entry) return null;
            return (
              <button
                key={subject}
                onClick={() => setSubjectFilter(subject)}
                className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm", subjectFilter === subject ? "bg-[#087c77] font-semibold text-white" : "text-[#31544e] hover:bg-[#eff6f2]")}
              >
                {subject} <span className="text-xs">{entry.approved}/{entry.total}</span>
              </button>
            );
          })}
          <Button variant="outline" size="sm" className="mt-2 w-full" onClick={jumpToNextUndecided}>
            <Flag size={14} /> Next undecided
          </Button>
          <p className="pt-1 text-[11px] leading-5 text-[#7a8c86]">Keys 1–5 set the answer · A approve · I image · R reject · ←/→ move.</p>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-[#d8e2dc] bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em]">
              <span className="rounded-md bg-[#e6f4ef] px-2 py-1 text-[#087c77]">{current.subject}</span>
              <span className="rounded-md bg-[#f2f2ed] px-2 py-1 text-[#7d837d]">{view.topic}</span>
              <span className={cn("rounded-md px-2 py-1", current.askable ? "bg-[#eaf7f0] text-[#24704f]" : "bg-[#fdf3e7] text-[#9a6b1f]")}>
                {current.askable ? "Askable" : "Not askable"}
              </span>
              {currentDecision && (
                <span className={cn("rounded-md px-2 py-1", currentDecision.decision === "approved" ? "bg-[#eaf7f0] text-[#24704f]" : currentDecision.decision === "needs_image" ? "bg-[#eef4ff] text-[#2f54b8]" : "bg-[#fdeaea] text-[#b3372f]")}>
                  {currentDecision.decision.replace("_", " ")}
                </span>
              )}
              <span className="ml-auto font-mono normal-case tracking-normal text-[#7a8c86]">{current.id}</span>
            </div>

            <p className="mt-3 text-xs text-[#506c65]">
              Source: <span className="font-semibold">{current.source.sourceFile}</span> · p.{current.sourcePage} · Q{current.sourceQuestionNumber} · {current.source.markdownFile}
              {current.source.sourceLink ? <> · <a className="font-semibold text-[#087c77] underline" href={current.source.sourceLink} target="_blank" rel="noreferrer">open source</a></> : null}
            </p>
            {current.warnings.length > 0 && (
              <ul className="mt-3 space-y-1 rounded-xl bg-[#fdf6ec] p-3 text-xs leading-5 text-[#8a6414]">
                {current.warnings.map((warning) => <li key={warning}>⚠ {warning}</li>)}
              </ul>
            )}

            <label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Stem</label>
            <textarea
              value={view.stem}
              onChange={(event) => setEdits((previous) => ({ ...previous, stem: event.target.value }))}
              rows={4}
              className="mt-1 w-full rounded-xl border border-[#cbdad4] bg-white p-3 text-[15px] leading-7 text-[#1f3a36] focus:border-[#087c77] focus:outline-none"
            />

            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Options — click the letter to set the key</p>
            <div className="mt-2 space-y-2">
              {view.options.map((option, index) => (
                <div key={index} className={cn("flex items-start gap-2 rounded-xl border p-2", view.correctOption === index ? "border-[#087c77] bg-[#eef7f4]" : "border-[#dfe8e3] bg-white")}>
                  <button
                    onClick={() => setEdits((previous) => ({ ...previous, correctOption: index }))}
                    aria-label={`Set correct answer ${OPTION_LETTERS[index] ?? index + 1}`}
                    className={cn("mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg font-sans text-sm font-bold", view.correctOption === index ? "bg-[#087c77] text-white" : "bg-[#eef3f0] text-[#31544e] hover:bg-[#dcebe5]")}
                  >
                    {OPTION_LETTERS[index] ?? index + 1}
                  </button>
                  <textarea
                    value={option}
                    onChange={(event) =>
                      setEdits((previous) => {
                        const next = [...view.options];
                        next[index] = event.target.value;
                        return { ...previous, options: next };
                      })
                    }
                    rows={2}
                    className="w-full rounded-lg bg-transparent p-1 text-sm leading-6 text-[#1f3a36] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Explanation</label>
                <textarea
                  value={view.explanation}
                  onChange={(event) => setEdits((previous) => ({ ...previous, explanation: event.target.value }))}
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-[#cbdad4] p-3 text-sm leading-6 text-[#1f3a36] focus:border-[#087c77] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Learning note</label>
                <textarea
                  value={view.learningNote}
                  onChange={(event) => setEdits((previous) => ({ ...previous, learningNote: event.target.value }))}
                  rows={5}
                  className="mt-1 w-full rounded-xl border border-[#cbdad4] p-3 text-sm leading-6 text-[#1f3a36] focus:border-[#087c77] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Topic</label>
                <input
                  value={view.topic}
                  onChange={(event) => setEdits((previous) => ({ ...previous, topic: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#cbdad4] p-2.5 text-sm text-[#1f3a36] focus:border-[#087c77] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#71857e]">Tags (comma separated)</label>
                <input
                  value={view.tags.join(", ")}
                  onChange={(event) =>
                    setEdits((previous) => ({ ...previous, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) }))
                  }
                  className="mt-1 w-full rounded-xl border border-[#cbdad4] p-2.5 text-sm text-[#1f3a36] focus:border-[#087c77] focus:outline-none"
                />
              </div>
            </div>

            {blockers.length > 0 ? (
              <ul className="mt-4 space-y-1 rounded-xl bg-[#fdeaea] p-3 text-xs leading-5 text-[#9c3128]">
                {blockers.map((blocker) => <li key={blocker}>✕ {blocker}</li>)}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl bg-[#eaf7f0] p-3 text-xs font-semibold text-[#24704f]">✓ Ready to approve — all import checks pass.</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button onClick={() => recordDecision("approved")} disabled={blockers.length > 0} className="bg-[#087c77] text-white hover:bg-[#066d69]">
                <Check size={15} /> Approve (A)
              </Button>
              <Button variant="outline" onClick={() => recordDecision("needs_image")}>
                <ImageIcon size={15} /> Needs image (I)
              </Button>
              <input
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
                placeholder="Reject reason…"
                className="h-9 min-w-[180px] flex-1 rounded-lg border border-[#cbdad4] px-3 text-sm focus:border-[#087c77] focus:outline-none"
              />
              <Button variant="destructive" onClick={() => recordDecision("rejected")}>
                <XCircle size={15} /> Reject (R)
              </Button>
              {currentDecision && (
                <button onClick={clearDecision} className="text-xs font-semibold text-[#7a8c86] underline hover:text-[#b3372f]">
                  Clear decision
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => move(-1)} disabled={position === 0}>
              <ArrowLeft size={15} /> Previous
            </Button>
            <span className="text-xs font-semibold text-[#668079]">
              Check against the source PDF before deciding.
            </span>
            <Button variant="outline" onClick={() => move(1)} disabled={position >= queue.length - 1}>
              Next <ArrowRight size={15} />
            </Button>
          </div>
        </section>
      </div>

      {notice && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#103f3c] px-4 py-2.5 text-sm font-semibold text-white shadow-xl">
          {notice}
          <button onClick={() => setNotice(null)} className="ml-3 text-[#8cc8bb] hover:text-white">Dismiss</button>
        </div>
      )}
    </main>
  );
}
