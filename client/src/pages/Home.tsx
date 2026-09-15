/**
 * Clinical Field Notes style: asymmetric clinical workbench, warm chart-paper surfaces,
 * petrol navigation, Meridian Teal for active study, Source Serif for dense learning text.
 * Metric strips and subject folders use ruled clinical-record traces; Meridian Teal and the compass
 * are reserved for active study, primary actions, and verified provenance rather than decoration.
 */
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArchiveRestore,
  ArrowLeft,
  ArrowRight,
  Brain,
  Bookmark,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CircleHelp,
  Clock3,
  Download,
  Dices,
  FileText,
  Flag,
  FolderOpen,
  LayoutDashboard,
  Menu,
  RefreshCcw,
  Search,
  Settings2,
  Target,
  Upload,
  X,
} from "lucide-react";
import { availableSubjects, pilotQuestions, Question } from "@/lib/questionBank";
import { loadReviewedQuestions, saveReviewedQuestions } from "@/lib/questionBankStorage";
import { loadOcrDraftQuestions, ocrDraftReport, type OcrDraftQuestion } from "@/lib/ocrDraftSections";
import { approvedQuestionsForMock, blueprintCoverageFor, buildPrimaryMockPlan, formatMockTime, PrimaryMockPlan } from "@/lib/mockExam";
import { isPrimaryBlueprintCategory } from "@/lib/primaryBlueprint";
import { hasCompleteMemoryAid, memoryAidEligibleQuestions } from "@/lib/memoryAids";
import { eligibleQuestionBank, isRevisionEligible } from "@/lib/questionEligibility";
import { buildDailyQueue, localDateKey, RecallRating, ReviewSchedule, scheduleRating } from "@/lib/spacedRepetition";
import { filterStudyBank, hasAnswerKey, isMissedAttempt, isThinNote, shuffleQuestions, topicsFor, topicShortName, type StudyMode } from "@/lib/studySession";
import { useOfflineApp } from "@/hooks/useOfflineApp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type View = "dashboard" | "practice" | "recall" | "mock" | "review" | "library" | "settings";
type MemoryRecallRecord = {
  attempts: number;
  lastReviewed?: string;
  lastRating?: RecallRating;
  schedule?: ReviewSchedule;
};
type Attempt = {
  attempts: number;
  correct: number;
  lastAnswer?: number;
  bookmarked?: boolean;
  lastAttempted?: string;
  schedule?: ReviewSchedule;
  memoryRecall?: MemoryRecallRecord;
};
type StudyStore = {
  version: 3;
  updatedAt: string;
  activityDates: string[];
  questions: Record<string, Attempt>;
};
type MockExamSession = {
  plan: PrimaryMockPlan;
  startedAt: number;
  answerByQuestionId: Record<string, number>;
  flaggedQuestionIds: string[];
  completedAt?: number;
};

const STORE_KEY = "meridian-revision-study-store-v3";
const PREVIOUS_STORE_KEY = "meridian-revision-study-store-v2";
const LEGACY_STORE_KEY = "meridian-revision-study-store-v1";
const LEARNING_AID_VISIBILITY_KEY = "meridian-revision-show-learning-aids";
const LEARNING_AID_DEFAULT_HIDDEN_KEY = "meridian-revision-default-learning-aids-hidden";
const EMOJI_CUE_VISIBILITY_KEY = "meridian-revision-show-emoji-cues";
const RECALL_CUE_FIRST_KEY = "meridian-revision-recall-cue-first";
const INCLUDE_MEMORY_RECALL_DAILY_KEY = "meridian-revision-include-memory-recall-daily";
const PRIMARY_MOCK_SESSION_KEY = "meridian-revision-primary-mock-v1";
const emptyStore: StudyStore = { version: 3, updatedAt: "", activityDates: [], questions: {} };

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void, threshold = 50) {
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    tracking.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!tracking.current) return;
    tracking.current = false;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    }
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd };
}

const subjectMeta: Record<string, { code: string; tone: string; description: string }> = {
  "Evidence-based medicine": {
    code: "EBM",
    tone: "bg-white text-[#103f3c] border-[#c8d7d1]",
    description: "Statistics, study design, and critical appraisal.",
  },
  Anatomy: { code: "ANA", tone: "bg-white text-[#103f3c] border-[#c8d7d1]", description: "Regional anatomy and applied structures." },
  Physiology: { code: "PHY", tone: "bg-white text-[#103f3c] border-[#c8d7d1]", description: "Systems physiology and interpretation." },
  Pathology: { code: "PAT", tone: "bg-white text-[#103f3c] border-[#c8d7d1]", description: "Mechanisms of disease and tissue response." },
  Microbiology: { code: "MIC", tone: "bg-white text-[#103f3c] border-[#c8d7d1]", description: "Organisms, antimicrobial therapy, and infection." },
  Pharmacology: { code: "PHR", tone: "bg-white text-[#103f3c] border-[#c8d7d1]", description: "Drug mechanisms, adverse effects, and prescribing." },
};

function loadStore(): StudyStore {
  try {
    const saved = window.localStorage.getItem(STORE_KEY) ?? window.localStorage.getItem(PREVIOUS_STORE_KEY) ?? window.localStorage.getItem(LEGACY_STORE_KEY);
    if (!saved) return emptyStore;
    const parsed = JSON.parse(saved) as Partial<StudyStore>;
    if (!parsed.questions || !Array.isArray(parsed.activityDates)) return emptyStore;
    return { version: 3, updatedAt: parsed.updatedAt ?? "", activityDates: parsed.activityDates, questions: parsed.questions };
  } catch {
    return emptyStore;
  }
}

function todayIso() {
  return localDateKey();
}

function formatDate(value?: string) {
  if (!value) return "Not attempted";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(value));
}

function accuracy(record?: Attempt) {
  if (!record?.attempts) return 0;
  return Math.round((record.correct / record.attempts) * 100);
}

function ocrDraftToQuestion(draft: OcrDraftQuestion): Question {
  return {
    id: draft.id,
    source: draft.source.sourceFile || draft.source.markdownFile || "unknown-source",
    sourcePage: draft.sourcePage,
    subject: draft.subject,
    topic: draft.topic,
    stem: draft.stem,
    options: draft.options,
    correctOption: draft.correctOption,
    explanation: draft.explanation,
    learningNote: draft.learningNote,
    highYieldNote: draft.highYieldNote,
    mnemonic: draft.mnemonic,
    memoryAid: draft.memoryAid,
    tags: draft.tags,
    isOcrDraft: true,
    ocrStatus: draft.status,
    ocrWarnings: draft.warnings,
    needsImage: draft.needsImage,
    sourceMarkdown: draft.source.markdownFile,
    sourceLink: draft.source.sourceLink,
  };
}

const ocrQuestions: Question[] = [];
let _ocrLoadFailed = false;

export async function reloadOcrForce(): Promise<Question[]> {
  ocrQuestions.length = 0;
  _ocrLoadFailed = false;
  const { clearOcrCache } = await import("@/lib/ocrDraftSections");
  clearOcrCache();
  return ensureOcrLoaded();
}

async function ensureOcrLoaded(): Promise<Question[]> {
  if (_ocrLoadFailed) throw new Error("Previous OCR load failed");
  if (ocrQuestions.length > 0) return ocrQuestions;
  const drafts = await loadOcrDraftQuestions();
  ocrQuestions.length = 0;
  for (const draft of drafts) {
    try {
      ocrQuestions.push(ocrDraftToQuestion(draft));
    } catch (err) {
      console.warn("Skipping bad OCR question:", draft.id, err);
    }
  }
  return ocrQuestions;
}

function mergeQuestionBanks(imported: Question[], extra: Question[] = []) {
  const merged = new Map(eligibleQuestionBank(pilotQuestions).map((question) => [question.id, question]));
  eligibleQuestionBank(ocrQuestions).forEach((question) => merged.set(question.id, question));
  eligibleQuestionBank(extra).forEach((question) => merged.set(question.id, question));
  eligibleQuestionBank(imported).forEach((question) => merged.set(question.id, question));
  return Array.from(merged.values());
}

function isReviewedQuestion(value: unknown): value is Question {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return !item.needsReview && !item.needs_review && typeof item.id === "string" && item.id.trim().length > 0 && typeof item.subject === "string" && item.subject.trim().length > 0 && typeof item.topic === "string" && item.topic.trim().length > 0 && typeof item.stem === "string" && item.stem.trim().length > 0 && Array.isArray(item.options) && item.options.length >= 2 && item.options.every((option) => typeof option === "string" && option.trim().length > 0) && typeof item.correctOption === "number" && Number.isInteger(item.correctOption) && item.correctOption >= 0 && item.correctOption < item.options.length && typeof item.explanation === "string" && item.explanation.trim().length > 0 && typeof item.learningNote === "string" && item.learningNote.trim().length > 0 && (!Object.hasOwn(item, "highYieldNote") || typeof item.highYieldNote === "string") && (!Object.hasOwn(item, "mnemonic") || typeof item.mnemonic === "string") && (!Object.hasOwn(item, "memoryAid") || hasCompleteMemoryAid(item.memoryAid as Question["memoryAid"])) && (!Object.hasOwn(item, "primaryBlueprintCategory") || isPrimaryBlueprintCategory(item.primaryBlueprintCategory)) && (!Object.hasOwn(item, "primaryBlueprintSubcategory") || typeof item.primaryBlueprintSubcategory === "string")     && Array.isArray(item.tags) && item.tags.every((tag) => typeof tag === "string" && tag.trim().length > 0) && typeof item.source === "string" && item.source.trim().length > 0 && typeof item.sourcePage === "number" && Number.isInteger(item.sourcePage) && item.sourcePage > 0 && isRevisionEligible(item as unknown as Question);

}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [store, setStore] = useState<StudyStore>(emptyStore);
  const [questionBank, setQuestionBank] = useState<Question[]>(() => mergeQuestionBanks([]));
  const [incorrectReviewSession, setIncorrectReviewSession] = useState<Question[] | null>(null);
  const [scheduledSession, setScheduledSession] = useState<Question[] | null>(null);
  const [memoryRecallSession, setMemoryRecallSession] = useState<Question[] | null>(null);
  const [memoryRecallIndex, setMemoryRecallIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showLearningAids, setShowLearningAids] = useState(() => window.localStorage.getItem(LEARNING_AID_VISIBILITY_KEY) !== "false");
  const [hideLearningAidsByDefault, setHideLearningAidsByDefault] = useState(() => window.localStorage.getItem(LEARNING_AID_DEFAULT_HIDDEN_KEY) === "true");
  const [showEmojiCues, setShowEmojiCues] = useState(() => window.localStorage.getItem(EMOJI_CUE_VISIBILITY_KEY) !== "false");
  const [cueFirstMode, setCueFirstMode] = useState(() => window.localStorage.getItem(RECALL_CUE_FIRST_KEY) !== "false");
  const [includeMemoryRecallWithDaily, setIncludeMemoryRecallWithDaily] = useState(() => window.localStorage.getItem(INCLUDE_MEMORY_RECALL_DAILY_KEY) === "true");
  const [memoryAidRevealed, setMemoryAidRevealed] = useState(false);
  const [mockSession, setMockSession] = useState<MockExamSession | null>(() => {
    try {
      const saved = window.localStorage.getItem(PRIMARY_MOCK_SESSION_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved) as MockExamSession;
      return Array.isArray(parsed.plan?.questionIds) && typeof parsed.startedAt === "number" ? parsed : null;
    } catch {
      return null;
    }
  });
  const [mockIndex, setMockIndex] = useState(0);
  const [mockNow, setMockNow] = useState(Date.now());
  const [reviewFilter, setReviewFilter] = useState<"all" | "missed" | "bookmarked" | "unanswered">("all");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>("keyed");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [ocrLoadStatus, setOcrLoadStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [ocrLoadCount, setOcrLoadCount] = useState(0);
  const [ocrLoadError, setOcrLoadError] = useState<string | null>(null);
  const offlineApp = useOfflineApp();

  useEffect(() => setStore(loadStore()), []);

  useEffect(() => {
    let mounted = true;
    ensureOcrLoaded().then((ocr) => {
      if (mounted) {
        setQuestionBank(mergeQuestionBanks([], ocr));
        setOcrLoadStatus("loaded");
        setOcrLoadCount(ocr.length);
      }
    }).catch((err) => {
      console.error("OCR load failed:", err);
      if (mounted) {
        setOcrLoadStatus("error");
        setOcrLoadError(String(err?.message ?? err));
      }
    });
    loadReviewedQuestions().then((questions) => {
      if (mounted && questions?.length) setQuestionBank(mergeQuestionBanks(questions, ocrQuestions));
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!store.updatedAt) return;
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    window.localStorage.setItem(LEARNING_AID_VISIBILITY_KEY, String(showLearningAids));
  }, [showLearningAids]);

  useEffect(() => {
    window.localStorage.setItem(LEARNING_AID_DEFAULT_HIDDEN_KEY, String(hideLearningAidsByDefault));
  }, [hideLearningAidsByDefault]);

  useEffect(() => {
    window.localStorage.setItem(EMOJI_CUE_VISIBILITY_KEY, String(showEmojiCues));
  }, [showEmojiCues]);

  useEffect(() => {
    window.localStorage.setItem(RECALL_CUE_FIRST_KEY, String(cueFirstMode));
  }, [cueFirstMode]);

  useEffect(() => {
    window.localStorage.setItem(INCLUDE_MEMORY_RECALL_DAILY_KEY, String(includeMemoryRecallWithDaily));
  }, [includeMemoryRecallWithDaily]);

  useEffect(() => {
    if (mockSession) window.localStorage.setItem(PRIMARY_MOCK_SESSION_KEY, JSON.stringify(mockSession));
    else window.localStorage.removeItem(PRIMARY_MOCK_SESSION_KEY);
  }, [mockSession]);

  useEffect(() => {
    if (activeView !== "mock" || !mockSession || mockSession.completedAt) return;
    const interval = window.setInterval(() => setMockNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [activeView, mockSession]);

  const keyedBank = useMemo(() => filterStudyBank(questionBank, { mode: "keyed" }), [questionBank]);
  const qualityBank = useMemo(() => filterStudyBank(questionBank, { mode: "all" }), [questionBank]);
  const filteredStudyBank = useMemo(
    () => filterStudyBank(questionBank, { mode: studyMode, subject: subjectFilter, topic: topicFilter, query: searchQuery }),
    [questionBank, studyMode, subjectFilter, topicFilter, searchQuery],
  );
  const basePracticeBank = incorrectReviewSession ?? scheduledSession ?? filteredStudyBank;
  const activePracticeBank = basePracticeBank;
  const currentQuestion = activePracticeBank[questionIndex] ?? activePracticeBank[0];
  const currentStatus = currentQuestion ? store.questions[currentQuestion.id] : undefined;
  const attemptedCount = keyedBank.filter((question) => (store.questions[question.id]?.attempts ?? 0) > 0).length;
  const totalAttempts = keyedBank.reduce((sum, question) => sum + (store.questions[question.id]?.attempts ?? 0), 0);
  const correctAttempts = keyedBank.reduce((sum, question) => sum + (store.questions[question.id]?.correct ?? 0), 0);
  const overallAccuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const bookmarks = questionBank.filter((question) => Boolean(store.questions[question.id]?.bookmarked)).length;
  const dailyQueue = useMemo(() => buildDailyQueue(keyedBank.map((question) => question.id), store.questions), [keyedBank, store.questions]);
  const dueReviewCount = dailyQueue.dueIds.length;
  const newReviewCount = dailyQueue.newIds.length;
  const memoryRecallBank = useMemo(() => memoryAidEligibleQuestions(questionBank), [questionBank]);
  const memoryRecallSchedules = useMemo(() => Object.fromEntries(memoryRecallBank.map((question) => [question.id, { schedule: store.questions[question.id]?.memoryRecall?.schedule }])), [memoryRecallBank, store.questions]);
  const memoryRecallQueue = useMemo(() => buildDailyQueue(memoryRecallBank.map((question) => question.id), memoryRecallSchedules, undefined, 10), [memoryRecallBank, memoryRecallSchedules]);

  useEffect(() => {
    setMemoryAidRevealed(!cueFirstMode);
  }, [currentQuestion?.id, cueFirstMode]);

  const reviewQuestions = useMemo(() => {
    const pool = reviewFilter === "bookmarked" ? questionBank : qualityBank;
    return pool.filter((question) => {
      const record = store.questions[question.id];
      if (reviewFilter === "missed") return isMissedAttempt(question, record);
      if (reviewFilter === "bookmarked") return Boolean(record?.bookmarked);
      if (reviewFilter === "unanswered") return hasAnswerKey(question) && !record?.attempts;
      return true;
    });
  }, [qualityBank, questionBank, reviewFilter, store.questions]);

  useEffect(() => {
    if (questionIndex >= activePracticeBank.length) setQuestionIndex(0);
  }, [activePracticeBank.length, questionIndex]);

  function switchView(view: View) {
    if (view === "practice") setShowLearningAids(!hideLearningAidsByDefault);
    setActiveView(view);
    setMenuOpen(false);
  }

  function resetPracticeCursor() {
    setQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
  }

  function startVerifiedRevision() {
    setIncorrectReviewSession(null);
    setScheduledSession(null);
    setSubjectFilter(null);
    setTopicFilter(null);
    setStudyMode("keyed");
    setSearchQuery("");
    resetPracticeCursor();
    switchView("practice");
  }

  function startSubjectRevision(subject: string) {
    setIncorrectReviewSession(null);
    setScheduledSession(null);
    setSubjectFilter(subject);
    setTopicFilter(null);
    setStudyMode("keyed");
    setSearchQuery("");
    resetPracticeCursor();
    const count = filterStudyBank(questionBank, { mode: "keyed", subject }).length;
    setNotice(count ? `${subject}: ${count} keyed question${count === 1 ? "" : "s"} ready.` : `${subject} has no keyed items yet. Showing source records instead.`);
    if (!count) setStudyMode("all");
    switchView("practice");
  }

  function startTopicRevision(subject: string, topic: string) {
    setIncorrectReviewSession(null);
    setScheduledSession(null);
    setSubjectFilter(subject);
    setTopicFilter(topic);
    setStudyMode("keyed");
    setSearchQuery("");
    resetPracticeCursor();
    const keyed = filterStudyBank(questionBank, { mode: "keyed", subject, topic }).length;
    if (!keyed) setStudyMode("all");
    setNotice(`${topicShortName(topic, subject)}: ${keyed || filterStudyBank(questionBank, { mode: "all", subject, topic }).length} items.`);
    switchView("practice");
  }

  function startQuickSet(count = 20) {
    const pool = filterStudyBank(questionBank, { mode: "keyed", subject: subjectFilter });
    if (!pool.length) {
      setNotice("No keyed questions are available for a quick set yet.");
      return;
    }
    const queue = shuffleQuestions(pool, Date.now()).slice(0, Math.min(count, pool.length));
    setIncorrectReviewSession(null);
    setScheduledSession(queue);
    setTopicFilter(null);
    setSearchQuery("");
    resetPracticeCursor();
    setNotice(`Quick set: ${queue.length} shuffled keyed question${queue.length === 1 ? "" : "s"}.`);
    switchView("practice");
  }

  function updateStore(updater: (previous: StudyStore) => StudyStore) {
    setStore((previous) => ({ ...updater(previous), updatedAt: new Date().toISOString() }));
  }

  function startPrimaryMock() {
    const plan = buildPrimaryMockPlan(questionBank, Date.now());
    if (!plan.questionIds.length) {
      setNotice("A Primary mock needs at least one approved question. Import reviewed questions first; OCR drafts are excluded from mock exams.");
      return;
    }
    setMockSession({ plan, startedAt: Date.now(), answerByQuestionId: {}, flaggedQuestionIds: [] });
    setMockIndex(0);
    setMockNow(Date.now());
    switchView("mock");
  }

  function startMemoryRecall() {
    const ids = [...memoryRecallQueue.dueIds, ...memoryRecallQueue.newIds];
    const byId = new Map(memoryRecallBank.map((question) => [question.id, question]));
    const queue = ids.map((id) => byId.get(id)).filter((question): question is Question => Boolean(question));
    if (!queue.length) {
      setNotice("No source-supported high-yield recall aids are available yet. Review or import verified questions first.");
      return;
    }
    setIncorrectReviewSession(null);
    setScheduledSession(null);
    setMemoryRecallSession(queue);
    setMemoryRecallIndex(0);
    setNotice(`${memoryRecallQueue.dueIds.length} due recall prompt${memoryRecallQueue.dueIds.length === 1 ? "" : "s"} and ${memoryRecallQueue.newIds.length} new prompt${memoryRecallQueue.newIds.length === 1 ? "" : "s"} are ready.`);
    switchView("recall");
  }

  function rateMemoryRecall(rating: RecallRating) {
    const question = memoryRecallSession?.[memoryRecallIndex];
    if (!question || !memoryRecallSession) return;
    updateStore((previous) => {
      const existing = previous.questions[question.id] ?? { attempts: 0, correct: 0 };
      const memoryRecall = existing.memoryRecall ?? { attempts: 0 };
      return {
        ...previous,
        questions: {
          ...previous.questions,
          [question.id]: {
            ...existing,
            memoryRecall: {
              ...memoryRecall,
              attempts: memoryRecall.attempts + 1,
              lastRating: rating,
              lastReviewed: new Date().toISOString(),
              schedule: scheduleRating(memoryRecall.schedule, rating),
            },
          },
        },
      };
    });
    const nextIndex = memoryRecallIndex + 1;
    if (nextIndex >= memoryRecallSession.length) {
      setMemoryRecallSession(null);
      setMemoryRecallIndex(0);
      setNotice("High-yield recall is complete. Recall dates were saved separately from answer accuracy.");
      switchView("dashboard");
      return;
    }
    setMemoryRecallIndex(nextIndex);
  }

  function finishPrimaryMock() {
    if (!mockSession || mockSession.completedAt) return;
    const completedAt = Date.now();
    const byId = new Map(questionBank.map((question) => [question.id, question]));
    updateStore((previous) => {
      const questions = { ...previous.questions };
      for (const [questionId, answer] of Object.entries(mockSession.answerByQuestionId)) {
        const question = byId.get(questionId);
        if (!question) continue;
        const existing = questions[questionId] ?? { attempts: 0, correct: 0 };
        questions[questionId] = { ...existing, attempts: existing.attempts + 1, correct: existing.correct + (answer === question.correctOption ? 1 : 0), lastAnswer: answer, lastAttempted: new Date(completedAt).toISOString() };
      }
      return { ...previous, activityDates: previous.activityDates.includes(todayIso()) ? previous.activityDates : [...previous.activityDates, todayIso()], questions };
    });
    setMockSession((current) => current ? { ...current, completedAt } : null);
    setNotice("Primary mock submitted. Your completed answers were added to local progress.");
  }

  function discardPrimaryMock() {
    setMockSession(null);
    setMockIndex(0);
    switchView("dashboard");
  }

  function submitAnswer() {
    if (selectedOption === null || submitted || !currentQuestion) return;
    const keyed = hasAnswerKey(currentQuestion);
    const isCorrect = keyed && selectedOption === currentQuestion.correctOption;
    updateStore((previous) => {
      const existing = previous.questions[currentQuestion.id] ?? { attempts: 0, correct: 0 };
      const activityDates = previous.activityDates.includes(todayIso())
        ? previous.activityDates
        : [...previous.activityDates, todayIso()];
      return {
        ...previous,
        activityDates,
        questions: {
          ...previous.questions,
          [currentQuestion.id]: {
            ...existing,
            attempts: keyed ? existing.attempts + 1 : existing.attempts,
            correct: existing.correct + (isCorrect ? 1 : 0),
            lastAnswer: selectedOption,
            lastAttempted: new Date().toISOString(),
          },
        },
      };
    });
    setSubmitted(true);
  }

  function moveQuestion(direction: 1 | -1) {
    if (!activePracticeBank.length) return;
    const nextIndex = (questionIndex + direction + activePracticeBank.length) % activePracticeBank.length;
    setQuestionIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(false);
  }

  function jumpToQuestion(index: number) {
    if (index < 0 || index >= activePracticeBank.length) return;
    setQuestionIndex(index);
    setSelectedOption(null);
    setSubmitted(false);
  }

  function openQuestion(question: Question) {
    setIncorrectReviewSession(null);
    setScheduledSession(null);
    setMemoryRecallSession(null);
    setSubjectFilter(question.subject);
    setTopicFilter(question.topic);
    setStudyMode(hasAnswerKey(question) ? "keyed" : "all");
    setSearchQuery("");
    const pool = filterStudyBank(questionBank, {
      mode: hasAnswerKey(question) ? "keyed" : "all",
      subject: question.subject,
      topic: question.topic,
    });
    const index = pool.findIndex((item) => item.id === question.id);
    setQuestionIndex(index >= 0 ? index : 0);
    setSelectedOption(null);
    setSubmitted(false);
    switchView("practice");
  }

  function openSourceLibrary(_subject?: string) {
    switchView("library");
  }

  function startDailyReview() {
    const ids = [...dailyQueue.dueIds, ...dailyQueue.newIds];
    const byId = new Map(keyedBank.map((question) => [question.id, question]));
    const queue = ids.map((id) => byId.get(id)).filter((question): question is Question => Boolean(question));
    if (!queue.length) {
      if (includeMemoryRecallWithDaily && memoryRecallQueue.total) {
        startMemoryRecall();
        return;
      }
      setNotice("No keyed questions are due today. Continue revision or return when the next interval is due.");
      return;
    }
    setIncorrectReviewSession(null);
    setScheduledSession(queue);
    setMemoryRecallSession(null);
    setQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setNotice(`${dailyQueue.dueIds.length} due review${dailyQueue.dueIds.length === 1 ? "" : "s"} and ${dailyQueue.newIds.length} new approved question${dailyQueue.newIds.length === 1 ? "" : "s"} are in today’s queue.`);
    switchView("practice");
  }

  function startIncorrectAnswerReview() {
    const queue = keyedBank.filter((question) => isMissedAttempt(question, store.questions[question.id]));
    if (!queue.length) {
      setNotice("No previously incorrect keyed questions are available yet. Continue revision and missed items will appear here.");
      return;
    }
    setScheduledSession(null);
    setMemoryRecallSession(null);
    setIncorrectReviewSession(queue);
    setQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setShowLearningAids(!hideLearningAidsByDefault);
    setNotice(`${queue.length} previously incorrect approved question${queue.length === 1 ? " is" : "s are"} ready for focused review.`);
    switchView("practice");
  }

  function rateScheduledReview(rating: RecallRating) {
    if (!scheduledSession || !currentQuestion) return;
    const currentIndex = questionIndex;
    updateStore((previous) => {
      const existing = previous.questions[currentQuestion.id] ?? { attempts: 0, correct: 0 };
      return {
        ...previous,
        questions: {
          ...previous.questions,
          [currentQuestion.id]: { ...existing, schedule: scheduleRating(existing.schedule, rating) },
        },
      };
    });
    const nextIndex = currentIndex + 1;
    if (nextIndex >= scheduledSession.length) {
      setScheduledSession(null);
      setQuestionIndex(0);
      setSelectedOption(null);
      setSubmitted(false);
      if (includeMemoryRecallWithDaily && memoryRecallQueue.total) {
        startMemoryRecall();
        return;
      }
      setNotice("Today’s scheduled queue is complete. Your next due dates were saved locally.");
      switchView("dashboard");
      return;
    }
    setQuestionIndex(nextIndex);
    setSelectedOption(null);
    setSubmitted(false);
  }

  function toggleBookmark(questionId: string) {
    updateStore((previous) => {
      const existing = previous.questions[questionId] ?? { attempts: 0, correct: 0 };
      return {
        ...previous,
        questions: {
          ...previous.questions,
          [questionId]: { ...existing, bookmarked: !existing.bookmarked },
        },
      };
    });
  }

  function exportBackup() {
    const payload = JSON.stringify({ ...store, recallPreferences: { showEmojiCues, cueFirstMode, includeMemoryRecallWithDaily } }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meridian-revision-backup-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Study progress exported as a local JSON file.");
  }

  function importBackup(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(String(reader.result)) as Omit<Partial<StudyStore>, "version"> & { version?: number; recallPreferences?: { showEmojiCues?: boolean; cueFirstMode?: boolean; includeMemoryRecallWithDaily?: boolean } };
        if ((incoming.version !== 1 && incoming.version !== 2 && incoming.version !== 3) || !incoming.questions || !Array.isArray(incoming.activityDates)) {
          throw new Error("Unsupported file");
        }
        setStore({ version: 3, questions: incoming.questions, activityDates: incoming.activityDates, updatedAt: new Date().toISOString() });
        if (typeof incoming.recallPreferences?.showEmojiCues === "boolean") setShowEmojiCues(incoming.recallPreferences.showEmojiCues);
        if (typeof incoming.recallPreferences?.cueFirstMode === "boolean") setCueFirstMode(incoming.recallPreferences.cueFirstMode);
        if (typeof incoming.recallPreferences?.includeMemoryRecallWithDaily === "boolean") setIncludeMemoryRecallWithDaily(incoming.recallPreferences.includeMemoryRecallWithDaily);
        setNotice("Study progress restored from backup.");
      } catch {
        setNotice("This does not appear to be a Meridian Revision backup file.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetProgress() {
    if (!window.confirm("Reset all local progress, bookmarks, and study dates? This cannot be undone without an exported backup.")) return;
    setStore({ ...emptyStore, updatedAt: new Date().toISOString() });
    setNotice("Local study progress has been reset.");
  }

  function importReviewedQuestionBank(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown;
        const candidates = Array.isArray(parsed) ? parsed : (parsed as { questions?: unknown[] }).questions;
        if (!Array.isArray(candidates) || !candidates.length || !candidates.every(isReviewedQuestion)) throw new Error("Unreviewed source data");
        const imported = candidates as Question[];
        void saveReviewedQuestions(imported).then(() => {
          setQuestionBank(mergeQuestionBanks(imported));
          setQuestionIndex(0);
          setSelectedOption(null);
          setSubmitted(false);
          setNotice(`${imported.length} reviewed question${imported.length === 1 ? "" : "s"} imported for offline use.`);
        }).catch(() => setNotice("The reviewed bank could not be saved locally in this browser."));
      } catch {
        setNotice("Import requires reviewed question JSON with a stem, options, correct answer, explanation, source, and source page.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function retryOcrLoad() {
    setOcrLoadStatus("loading");
    setOcrLoadError(null);
    reloadOcrForce().then((ocr) => {
      setQuestionBank(mergeQuestionBanks([], ocr));
      setOcrLoadStatus("loaded");
      setOcrLoadCount(ocr.length);
    }).catch((err) => {
      console.error("OCR retry failed:", err);
      setOcrLoadStatus("error");
      setOcrLoadError(String(err?.message ?? err));
    });
  }

  const content =
    activeView === "dashboard" ? (
      <DashboardView
        attemptedCount={attemptedCount}
        overallAccuracy={overallAccuracy}
        bookmarks={bookmarks}
        activityDays={store.activityDates.length}
        dueReviewCount={dueReviewCount}
        newReviewCount={newReviewCount}
        store={store}
        questionBank={questionBank}
        keyedCount={keyedBank.length}
        qualityCount={qualityBank.length}
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
        onPractice={startVerifiedRevision}
        onPracticeSubject={startSubjectRevision}
        onPracticeTopic={startTopicRevision}
        onQuickSet={() => startQuickSet(20)}
        onOpenQuestion={openQuestion}
        onOpenDraftSubject={openSourceLibrary}
        onStartDailyReview={startDailyReview}
        memoryAidCount={memoryRecallBank.length}
        memoryRecallDueCount={memoryRecallQueue.dueIds.length}
        memoryRecallNewCount={memoryRecallQueue.newIds.length}
        onStartMemoryRecall={startMemoryRecall}
        ocrLoadStatus={ocrLoadStatus}
        ocrLoadCount={ocrLoadCount}
        ocrLoadError={ocrLoadError}
        onRetryOcrLoad={retryOcrLoad}
      />
    ) : activeView === "practice" ? (
      <PracticeView
        question={currentQuestion}
        questionBank={activePracticeBank}
        index={questionIndex}
        selectedOption={selectedOption}
        submitted={submitted}
        record={currentStatus}
        onSelect={setSelectedOption}
        onSubmit={submitAnswer}
        onMove={moveQuestion}
        onJump={jumpToQuestion}
        onBookmark={() => currentQuestion && toggleBookmark(currentQuestion.id)}
        incorrectReviewSession={Boolean(incorrectReviewSession)}
        scheduledSession={Boolean(scheduledSession)}
        onRate={rateScheduledReview}
        showLearningAids={showLearningAids}
        onToggleLearningAids={() => setShowLearningAids((visible) => !visible)}
        showEmojiCues={showEmojiCues}
        memoryAidRevealed={memoryAidRevealed}
        onRevealMemoryAid={() => setMemoryAidRevealed(true)}
        subjectFilter={subjectFilter}
        topicFilter={topicFilter}
        studyMode={studyMode}
        onSubjectFilterChange={(subject) => { setSubjectFilter(subject); setTopicFilter(null); setScheduledSession(null); setIncorrectReviewSession(null); resetPracticeCursor(); }}
        onTopicFilterChange={(topic) => { setTopicFilter(topic); setScheduledSession(null); setIncorrectReviewSession(null); resetPracticeCursor(); }}
        onStudyModeChange={(mode) => { setStudyMode(mode); setScheduledSession(null); setIncorrectReviewSession(null); resetPracticeCursor(); }}
        onQuickSet={() => startQuickSet(20)}
        subjects={availableSubjects}
        topics={topicsFor(qualityBank, subjectFilter)}
      />
    ) : activeView === "recall" ? (
      <MemoryRecallView
        session={memoryRecallSession}
        index={memoryRecallIndex}
        showEmojiCues={showEmojiCues}
        cueFirstMode={cueFirstMode}
        onStart={startMemoryRecall}
        onRate={rateMemoryRecall}
        onExit={() => { setMemoryRecallSession(null); setMemoryRecallIndex(0); switchView("dashboard"); }}
      />
    ) : activeView === "mock" ? (
      <PrimaryMockView
        session={mockSession}
        questions={questionBank}
        index={mockIndex}
        now={mockNow}
        onStart={startPrimaryMock}
        onMove={setMockIndex}
        onAnswer={(questionId, answer) => setMockSession((current) => current ? { ...current, answerByQuestionId: { ...current.answerByQuestionId, [questionId]: answer } } : null)}
        onToggleFlag={(questionId) => setMockSession((current) => current ? { ...current, flaggedQuestionIds: current.flaggedQuestionIds.includes(questionId) ? current.flaggedQuestionIds.filter((id) => id !== questionId) : [...current.flaggedQuestionIds, questionId] } : null)}
        onFinish={finishPrimaryMock}
        onDiscard={discardPrimaryMock}
      />
    ) : activeView === "review" ? (
      <ReviewView
        filter={reviewFilter}
        questions={reviewQuestions}
        store={store}
        onFilter={setReviewFilter}
        onOpenQuestion={openQuestion}
        onBookmark={toggleBookmark}
        incorrectCount={keyedBank.filter((question) => isMissedAttempt(question, store.questions[question.id])).length}
        onStartIncorrectReview={startIncorrectAnswerReview}
      />
    ) : activeView === "library" ? (
      <DraftLibraryView questionBank={questionBank} keyedCount={keyedBank.length} onPractice={startVerifiedRevision} onImportBank={importReviewedQuestionBank} />
    ) : (
      <SettingsView
        online={offlineApp.online}
        offlineReady={offlineApp.offlineReady}
        installed={offlineApp.installed}
        canInstall={offlineApp.canInstall}
        iosHint={offlineApp.iosHint}
        onInstall={() => void offlineApp.install()}
        onExport={exportBackup}
        onImport={importBackup}
        onReset={resetProgress}
        hideLearningAidsByDefault={hideLearningAidsByDefault}
        showEmojiCues={showEmojiCues}
        cueFirstMode={cueFirstMode}
        includeMemoryRecallWithDaily={includeMemoryRecallWithDaily}
        onToggleEmojiCues={() => setShowEmojiCues((visible) => !visible)}
        onToggleCueFirstMode={() => setCueFirstMode((enabled) => !enabled)}
        onToggleIncludeMemoryRecallWithDaily={() => setIncludeMemoryRecallWithDaily((enabled) => !enabled)}
        onToggleLearningAidDefault={() => {
          setHideLearningAidsByDefault((hidden) => {
            const nextHidden = !hidden;
            setShowLearningAids(!nextHidden);
            return nextHidden;
          });
        }}
      />
    );

  return (
    <main className="min-h-screen bg-[#f6f5f0] text-[#183432]">
      <div className="fixed inset-0 pointer-events-none chart-grain opacity-50" aria-hidden="true" />
      <div className="relative flex min-h-screen">
        <SideRail activeView={activeView} isOpen={menuOpen} onClose={() => setMenuOpen(false)} onSelect={switchView} />
        <section className="min-w-0 flex-1">
          <TopBar activeView={activeView} onMenu={() => setMenuOpen(true)} onNavigate={switchView} onExport={exportBackup} online={offlineApp.online} offlineReady={offlineApp.offlineReady} canInstall={offlineApp.canInstall} onInstall={() => void offlineApp.install()} />
          <div className="mx-auto max-w-[1500px] px-4 pb-12 pt-6 sm:px-7 lg:px-10 lg:pt-9">{content}</div>
        </section>
      </div>
      {notice && <Toast notice={notice} onClose={() => setNotice(null)} />}
    </main>
  );
}

function SideRail({ activeView, isOpen, onClose, onSelect }: { activeView: View; isOpen: boolean; onClose: () => void; onSelect: (view: View) => void }) {
  const navItems: { view: View; label: string; icon: typeof LayoutDashboard }[] = [
    { view: "dashboard", label: "Study desk", icon: LayoutDashboard },
    { view: "practice", label: "Revise", icon: BookOpenCheck },
    { view: "recall", label: "Recall aids", icon: Brain },
    { view: "mock", label: "Mock exams", icon: ClipboardCheck },
    { view: "review", label: "Review queue", icon: Flag },
    { view: "library", label: "Source library", icon: FolderOpen },
    { view: "settings", label: "Local data", icon: Settings2 },
  ];

  return (
    <>
      {isOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-[#102d2b]/35 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-white/10 bg-[#103f3c] px-4 py-5 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center border border-[#8cc8bb]/60 bg-[#e7eee9] shadow-[inset_0_0_0_3px_rgba(16,63,60,0.08)]">
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#103f3c] px-1 font-mono text-[8px] font-bold tracking-[0.18em] text-[#b9e3d9]">N</span>
              <img src="./manus-storage/meridian-mark_f22f4c75.png" alt="Meridian compass mark" className="h-8 w-8 p-0.5" />
            </div>
            <div className="border-l border-[#6fa99e]/65 pl-3">
              <p className="font-sans text-[10px] font-black uppercase tracking-[0.3em] text-[#b7e0d5]">Meridian</p>
              <p className="mt-0.5 font-serif text-[18px] leading-none tracking-[-0.055em] text-white">Revision</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close navigation" className="rounded-lg p-2 text-[#a6d6cc] hover:bg-white/10 lg:hidden"><X size={18} /></button>
        </div>

        <div className="mt-9 flex items-end justify-between px-2">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#91c6bc]">Workspace</p><p className="mt-1 font-serif text-[17px] text-white">Clinical desk</p></div>
          <span className="rounded-md border border-[#75b8ac]/35 bg-[#1b5955] px-1.5 py-1 text-[9px] font-bold tracking-[0.14em] text-[#bde8df]">LOCAL</span>
        </div>
        <nav className="mt-3 space-y-1" aria-label="Study navigation">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => onSelect(view)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition",
                activeView === view ? "bg-[#087c77] text-white shadow-[0_10px_28px_rgba(0,0,0,0.14)]" : "text-[#d5ebe6] hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon size={17} strokeWidth={activeView === view ? 2.3 : 1.8} />
              <span>{label}</span>
              {view === "review" && <span className="ml-auto rounded-md bg-white/14 px-1.5 py-0.5 text-[10px] font-semibold text-[#dff7f0]">QUEUE</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/12 bg-white/7 p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a6d6cc]">Offline first</p>
            <ArchiveRestore size={15} className="text-[#a6d6cc]" />
          </div>
          <p className="mt-2 text-sm font-medium text-white">Your progress stays on this device.</p>
          <p className="mt-1 text-xs leading-5 text-[#bcd8d2]">Export a JSON backup before moving to another browser or computer.</p>
        </div>
      </aside>
    </>
  );
}

function TopBar({ activeView, onMenu, onNavigate, onExport, online, offlineReady, canInstall, onInstall }: { activeView: View; onMenu: () => void; onNavigate: (view: View) => void; onExport: () => void; online: boolean; offlineReady: boolean; canInstall: boolean; onInstall: () => void }) {
  const title: Record<View, string> = {
    dashboard: "Study desk",
    practice: "Revision session",
    recall: "High-yield recall",
    mock: "Primary mock exam",
    review: "Review queue",
    library: "Source library",
    settings: "Local data",
  };
  return (
    <header className="sticky top-0 z-20 border-b border-[#d8ded8]/80 bg-[#f6f5f0]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} aria-label="Open navigation" className="rounded-lg p-2 text-[#173a37] hover:bg-[#e6efeb] lg:hidden"><Menu size={21} /></button>
          <div className="hidden items-center gap-2.5 border-r border-[#d6dfda] pr-4 md:flex">
            <div className="relative grid h-8 w-8 place-items-center border border-[#8abdaf] bg-[#e2efe9]"><span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#f6f5f0] px-0.5 font-mono text-[6px] font-bold text-[#31534e]">N</span><img src="./manus-storage/meridian-mark_f22f4c75.png" alt="" className="h-6 w-6 p-0.5" /></div>
            <div className="border-l border-[#c8d7d1] pl-2"><p className="font-sans text-[8px] font-black uppercase tracking-[0.25em] text-[#31534e]">Meridian</p><p className="font-serif text-[14px] leading-none tracking-[-0.05em] text-[#264b46]">Revision</p></div>
          </div>
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#67817c]">MRCEM Primary</p>
            <h1 className="font-serif text-[23px] leading-6 tracking-[-0.02em] text-[#183432]">{title[activeView]}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={cn("hidden rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:inline-flex", !online ? "border-[#e3c78f] bg-[#fff9ea] text-[#8a6420]" : offlineReady ? "border-[#9ac7b8] bg-[#eaf6f0] text-[#087c77]" : "border-[#d5e0da] bg-white text-[#5d7770]")}>{!online ? "Offline" : offlineReady ? "On this device" : "Online"}</span>
          {canInstall && <button onClick={onInstall} className="hidden h-9 items-center rounded-lg bg-[#103f3c] px-3 text-xs font-bold text-white hover:bg-[#0b322f] sm:flex">Install app</button>}
          <button onClick={() => onNavigate("review")} className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#345550] hover:bg-[#e6efeb] sm:flex"><Flag size={15} /> Review items</button>
          <Button onClick={onExport} variant="outline" className="hidden h-9 border-[#cad8d2] bg-white px-3 text-xs text-[#234943] shadow-none hover:bg-[#edf5f1] sm:flex"><Download size={14} /> Backup</Button>
          <button onClick={() => onNavigate("settings")} aria-label="Open local data settings" className="grid h-9 w-9 place-items-center rounded-full bg-[#e4ece8] text-[#31534e] transition hover:bg-[#d7e3de]"><Settings2 size={16} /></button>
        </div>
      </div>
    </header>
  );
}

function DashboardView({ attemptedCount, overallAccuracy, bookmarks, activityDays, dueReviewCount, newReviewCount, store, questionBank, keyedCount, qualityCount, searchQuery, onSearchQuery, onPractice, onPracticeSubject, onPracticeTopic, onQuickSet, onOpenQuestion, onOpenDraftSubject, onStartDailyReview, memoryAidCount, memoryRecallDueCount, memoryRecallNewCount, onStartMemoryRecall, ocrLoadStatus, ocrLoadCount, ocrLoadError, onRetryOcrLoad }: { attemptedCount: number; overallAccuracy: number; bookmarks: number; activityDays: number; dueReviewCount: number; newReviewCount: number; store: StudyStore; questionBank: Question[]; keyedCount: number; qualityCount: number; searchQuery: string; onSearchQuery: (value: string) => void; onPractice: () => void; onPracticeSubject: (subject: string) => void; onPracticeTopic: (subject: string, topic: string) => void; onQuickSet: () => void; onOpenQuestion: (question: Question) => void; onOpenDraftSubject: (subject: string) => void; onStartDailyReview: () => void; memoryAidCount: number; memoryRecallDueCount: number; memoryRecallNewCount: number; onStartMemoryRecall: () => void; ocrLoadStatus: "loading" | "loaded" | "error"; ocrLoadCount: number; ocrLoadError: string | null; onRetryOcrLoad: () => void }) {
  const keyedBank = filterStudyBank(questionBank, { mode: "keyed" });
  const nextQuestion = keyedBank.find((question) => !store.questions[question.id]?.attempts) ?? keyedBank[0] ?? questionBank[0];
  const searchHits = searchQuery.trim().length >= 2 ? filterStudyBank(questionBank, { mode: "all", query: searchQuery }).slice(0, 8) : [];
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[22px] border border-[#cfdcd6] bg-white shadow-[0_10px_28px_rgba(22,54,49,0.045)]">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-[#087c77]" />
        <div className="absolute inset-0 clinical-rules opacity-70" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1.5 rounded-md bg-[#e6f4ef] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#087c77]"><span className="h-1.5 w-1.5 rounded-full bg-[#087c77]" /> Private study desk</span>{ocrLoadStatus === "loading" ? <span className="text-[11px] font-semibold text-[#70847e]">Loading question bank...</span> : ocrLoadStatus === "error" ? <span className="text-[11px] font-semibold text-red-600">Failed to load questions</span> : <span className="text-[11px] font-semibold text-[#70847e]">{keyedCount} keyed · {qualityCount} studyable · {ocrLoadCount} source records</span>}</div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="section-kicker">Next keyed question</p><h2 className="mt-1 max-w-2xl font-serif text-[28px] leading-[1.15] tracking-[-0.028em] text-[#193d38] sm:text-[33px]">{nextQuestion?.stem ?? "Your MRCEM Primary bank is loading."}</h2></div>{nextQuestion && <div className="shrink-0 border-l-2 border-[#31534e] pl-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6a817a]">Source trace</p><p className="mt-1 text-sm font-bold text-[#345750]">{nextQuestion.source} · p.{nextQuestion.sourcePage}</p></div>}</div>
            <label className="mt-5 flex items-center gap-2 rounded-xl border border-[#c9d8d1] bg-[#f7fbf9] px-3 py-2.5">
              <Search size={16} className="shrink-0 text-[#5f7c74]" />
              <input value={searchQuery} onChange={(event) => onSearchQuery(event.target.value)} placeholder="Search stems, topics, or options" className="w-full bg-transparent text-sm text-[#244642] outline-none placeholder:text-[#8aa097]" />
            </label>
            {searchHits.length > 0 && (
              <div className="mt-3 divide-y divide-[#e1ebe6] overflow-hidden rounded-xl border border-[#d5e3dc] bg-white">
                {searchHits.map((question) => (
                  <button key={question.id} onClick={() => onOpenQuestion(question)} className="flex w-full items-start gap-3 px-3 py-2.5 text-left hover:bg-[#f3f8f5]">
                    <span className="mt-0.5 rounded bg-[#e7f3ee] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#087c77]">{question.subject === "Evidence-based medicine" ? "EBM" : question.subject.slice(0, 3)}</span>
                    <span className="min-w-0"><span className="block truncate font-serif text-sm text-[#244642]">{question.stem}</span><span className="text-[11px] text-[#6d827b]">{topicShortName(question.topic, question.subject)} · {hasAnswerKey(question) ? "Keyed" : "Ungraded"}</span></span>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#dfe8e3] pt-5"><Button onClick={onPractice} className="h-10 bg-[#087c77] px-5 text-sm text-white shadow-[0_8px_20px_rgba(0,124,119,0.18)] hover:bg-[#066d69]">Resume keyed revision <ArrowRight size={16} /></Button><Button onClick={onQuickSet} variant="outline" className="h-10 border-[#bfd1ca] bg-white px-4 text-sm text-[#31554e] hover:bg-[#eff6f2]"><Dices size={15} /> Quick 20</Button>{nextQuestion && <button onClick={() => onOpenQuestion(nextQuestion)} className="flex h-10 items-center gap-2 rounded-lg border border-[#bfd1ca] bg-white px-4 text-sm font-semibold text-[#31554e] hover:bg-[#eff6f2]">Open item <ChevronRight size={16} /></button>}<span className="ml-auto hidden text-[11px] font-semibold text-[#668079] sm:inline">Answer first · explanation follows</span></div>
          </div>
          <div className="relative overflow-hidden border-t border-[#dfe8e3] bg-[#e9f0ec] p-6 lg:border-l lg:border-t-0">
            <img src="./manus-storage/meridian-study-moment_2d138b66.jpg" alt="Study desk" className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply" />
            <div className="relative"><div className="flex items-center justify-between"><p className="section-kicker">Desk status</p><span className="rounded-md bg-[#103f3c] px-2 py-1 text-[9px] font-bold tracking-[0.14em] text-[#c4e4dc]">OFFLINE</span></div><div className="mt-6 space-y-4"><CommandMetric label="Keyed for marking" value={`${keyedCount}`} note="Answer keys present · used for scoring" />{ocrLoadStatus === "loaded" ? <CommandMetric label="Studyable records" value={`${qualityCount}`} note="Private source catalogue, including ungraded" /> : ocrLoadStatus === "error" ? <div><CommandMetric label="Bank failed" value="--" note={ocrLoadError?.slice(0, 40) ?? "Unknown error"} /><button onClick={onRetryOcrLoad} className="mt-2 w-full rounded-lg bg-[#087c77] px-3 py-2 text-xs font-bold text-white hover:bg-[#066d69]">Retry load</button></div> : <CommandMetric label="Loading bank" value="..." note="Fetching the 6.7 MB source catalogue" />}<CommandMetric label="Local backup" value="Ready" note={bookmarks ? `${bookmarks} saved bookmark${bookmarks === 1 ? "" : "s"}` : "Export from header"} /></div></div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard recordNo="01" label="Questions attempted" value={`${attemptedCount}/${keyedCount || questionBank.length}`} detail={ocrLoadStatus === "loaded" ? "Keyed items only" : ocrLoadStatus === "loading" ? "Loading..." : "Pilot only"} trace="LOCAL · STUDY LOG" icon={BookOpenCheck} tone="teal" />
        <MetricCard recordNo="02" label="Answer accuracy" value={totalLabel(overallAccuracy)} detail={attemptedCount ? "Across saved attempts" : "Starts after your first answer"} trace="LOCAL · ATTEMPTS" icon={Target} tone="ink" />
        <MetricCard recordNo="03" label="Due today" value={String(dueReviewCount)} detail={dueReviewCount ? "Scheduled approved reviews" : "No review items due"} trace="SCHEDULE · VERIFIED" icon={Clock3} tone="clay" />
        <MetricCard recordNo="04" label="Study days" value={String(activityDays)} detail={activityDays ? "Recorded on this device" : "No study dates yet"} trace="LOCAL · ACTIVITY" icon={Clock3} tone="sage" />
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-[#cddfd7] bg-[#f1f7f4] p-5 shadow-[0_8px_22px_rgba(22,54,49,0.035)]"><div className="absolute inset-y-0 left-0 w-1 bg-[#087c77]" /><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="section-kicker">Daily review</p><h2 className="mt-1 font-sans text-xl font-semibold tracking-[-0.025em] text-[#244642]">{dueReviewCount ? `${dueReviewCount} approved review${dueReviewCount === 1 ? "" : "s"} are due` : "Build your first review cycle"}</h2><p className="mt-1 text-sm text-[#628078]">{dueReviewCount ? `The queue also adds ${newReviewCount} new approved question${newReviewCount === 1 ? "" : "s"}, up to 20 items.` : `Start with up to ${newReviewCount} approved question${newReviewCount === 1 ? "" : "s"}. Rate recall after each explanation to set the next date.`}</p></div><Button onClick={onStartDailyReview} disabled={!dueReviewCount && !newReviewCount} className="bg-[#087c77] text-white hover:bg-[#066d69] disabled:bg-[#aebeb8]">Start daily review <ArrowRight size={16} /></Button></div></section>

      <section className="relative overflow-hidden rounded-2xl border border-[#d9e4de] bg-[#fffdf7] p-5 shadow-[0_8px_22px_rgba(22,54,49,0.035)]"><div className="absolute inset-0 clinical-rules opacity-35" aria-hidden="true" /><div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e4cdaa] bg-[#fff6dc] text-[#a36d20]"><Brain size={19} /></span><div><p className="section-kicker">High-yield recall</p><h2 className="mt-1 font-sans text-xl font-semibold tracking-[-0.025em] text-[#244642]">{memoryRecallDueCount ? `${memoryRecallDueCount} cue${memoryRecallDueCount === 1 ? "" : "s"} due for retrieval` : `${memoryAidCount} source-supported cues available`}</h2><p className="mt-1 max-w-2xl text-sm text-[#628078]">Retrieve from the emoji cue first, then reveal the fact and mnemonic. Ratings are saved separately from answer accuracy.</p></div></div><Button onClick={onStartMemoryRecall} disabled={!memoryAidCount} className="bg-[#103f3c] text-white hover:bg-[#0b322f] disabled:bg-[#b9c9c2]">{memoryRecallDueCount || memoryRecallNewCount ? "Start recall aids" : "No cues available"} <Brain size={16} /></Button></div></section>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div><p className="section-kicker">Subject folders</p><h2 className="mt-1 font-sans text-[25px] font-semibold tracking-[-0.03em] text-[#244642]">Choose a revision path</h2></div>
            <button className="text-xs font-semibold text-[#31534e] hover:text-[#103f3c]">Source status <ChevronRight size={14} className="inline" /></button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {availableSubjects.map((subject) => {
              const questions = filterStudyBank(questionBank, { mode: "all", subject });
              const keyedQuestions = questions.filter(hasAnswerKey);
              const topics = topicsFor(questions, subject).slice(0, 6);
              const meta = subjectMeta[subject];
              const subjectAttempts = keyedQuestions.reduce((sum, question) => sum + (store.questions[question.id]?.attempts ?? 0), 0);
              const subjectCorrect = keyedQuestions.reduce((sum, question) => sum + (store.questions[question.id]?.correct ?? 0), 0);
              const subjectAccuracy = subjectAttempts ? Math.round((subjectCorrect / subjectAttempts) * 100) : 0;
              const attemptedKeyed = keyedQuestions.filter((question) => (store.questions[question.id]?.attempts ?? 0) > 0).length;
              const hasContent = Boolean(questions.length);
              return (
                <article
                  key={subject}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border p-5 pt-7 text-left transition",
                    hasContent ? "border-[#d1ddd7] bg-white shadow-[0_8px_22px_rgba(22,54,49,0.045)]" : "border-[#dfe4df] bg-[#eff1ed]/80 opacity-75",
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 clinical-rules opacity-25" aria-hidden="true" />
                  <span className={cn("absolute -top-2 left-5 rounded-t-sm border border-b-0 px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.16em]", hasContent ? "border-[#9fbdb2] bg-[#edf4f0] text-[#31534e]" : "border-[#d9dfda] bg-[#f4f5f1] text-[#7b8781]")}>Clinical folder</span>
                  {hasContent && <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#087c77]" />}
                  <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2"><span className={cn("rounded-sm border px-2 py-1 font-sans text-[10px] font-bold tracking-[0.12em]", meta.tone)}>{meta.code}</span>{keyedQuestions.length ? <img src="./manus-storage/meridian-mark_f22f4c75.png" alt="" className="h-6 w-6 border border-[#79b9a9] bg-[#e7f3ee] p-0.5" /> : <span className="grid h-6 w-6 place-items-center border border-[#d7c39e] bg-[#fff7e8] text-[#9a6d28]"><FileText size={13} /></span>}</div>
                    {hasContent ? <span className="text-[11px] font-semibold text-[#31534e]">{keyedQuestions.length} keyed · {questions.length} total</span> : <span className="text-[11px] font-semibold text-[#83928c]">Awaiting bank</span>}
                  </div>
                  <h3 className="mt-5 font-sans text-[19px] font-semibold tracking-[-0.02em] text-[#244642]">{subject}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#71847e]">{meta.description}</p>
                  {hasContent ? (
                    <div className="mt-4 border-t border-[#e3e9e5] pt-3">
                      <div className="flex items-center justify-between text-[11px] text-[#607770]"><span>{attemptedKeyed ? `${attemptedKeyed}/${keyedQuestions.length} keyed attempted` : "Not started"}</span><span className="font-semibold text-[#345550]">{subjectAttempts ? `${subjectAccuracy}% accuracy` : "Ready"}</span></div>
                      <div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e6efeb]"><div className="h-full rounded-full bg-[#087c77] transition-all duration-300" style={{ width: `${keyedQuestions.length ? Math.round((attemptedKeyed / keyedQuestions.length) * 100) : 0}%` }} /></div><span className="font-mono text-[9px] text-[#69827a]">{attemptedKeyed}/{keyedQuestions.length || 0}</span></div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {topics.map((topic) => (
                          <button key={topic.topic} onClick={() => onPracticeTopic(subject, topic.topic)} className="rounded-md border border-[#d5e3dc] bg-[#f7fbf9] px-2 py-1 text-[10px] font-semibold text-[#3d5c55] hover:border-[#087c77] hover:text-[#087c77]">
                            {topic.label} · {topic.keyed || topic.total}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-dashed border-[#cbd9d2] pt-3">
                        <button onClick={() => onPracticeSubject(subject)} className="inline-flex items-center gap-1 text-xs font-bold text-[#087c77] hover:text-[#066d69]">Revise {subject === "Evidence-based medicine" ? "EBM" : subject} <ArrowRight size={14} /></button>
                        <button onClick={() => onOpenDraftSubject(subject)} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6d817a] hover:text-[#31534e]">Source</button>
                      </div>
                    </div>
                  ) : <p className="mt-4 border-t border-[#e1e5e1] pt-3 text-[11px] text-[#83928c]">{ocrLoadStatus === "loading" ? "Loading this folder..." : "No studyable records yet."}</p>}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <aside className="relative overflow-hidden rounded-lg border border-l-[3px] border-[#cbd9d2] border-l-[#31534e] bg-[#fbfcfa] p-5 shadow-[0_8px_22px_rgba(22,54,49,0.045)]"><div className="absolute inset-0 clinical-rules opacity-45" aria-hidden="true" /><div className="relative">
          <div className="flex items-center justify-between"><div><p className="section-kicker">Pinned clinical reference</p><h2 className="font-serif text-xl tracking-[-0.02em] text-[#244642]">Next learning step</h2></div><FileText size={18} className="text-[#31534e]" /></div>
          <div className="mt-5 rounded-xl bg-[#f0f6f3] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64827a]">{nextQuestion ? topicShortName(nextQuestion.topic, nextQuestion.subject) : "Bank"}</p>
            <p className="mt-2 font-serif text-[17px] leading-6 text-[#284b46]">{nextQuestion?.stem ?? "Load the local catalogue to start."}</p>
            {nextQuestion && <button onClick={() => onOpenQuestion(nextQuestion)} className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#087c77] hover:text-[#066d69]">Open question <ArrowRight size={14} /></button>}
          </div>
          <div className="mt-5 space-y-3 border-t border-[#e5ebe6] pt-5">
            <StudyCue icon={CheckCircle2} label="Immediate feedback" text="Explanations appear after you submit an answer." />
            <StudyCue icon={ArchiveRestore} label="Local storage" text="Progress and bookmarks stay in this browser." />
            <StudyCue icon={FileText} label="Source traceability" text="Every eligible item carries a source page reference." />
          </div>
          <div className="mt-5 border-t border-[#d8e4df] pt-4"><div className="flex items-center justify-between"><p className="section-kicker">Reference sheet</p><span className="rounded-sm border border-[#b8d5ca] bg-[#eef7f2] px-1.5 py-0.5 text-[8px] font-bold tracking-[0.14em] text-[#315e55]">PINNED</span></div><div className="mt-3 divide-y divide-[#dce7e2] border-y border-[#dce7e2]"><div className="flex items-center justify-between py-2.5 text-xs"><span className="font-semibold text-[#5c756e]">Due reviews</span><span className="font-bold text-[#31534e]">{dueReviewCount} today</span></div><div className="flex items-center justify-between py-2.5 text-xs"><span className="font-semibold text-[#5c756e]">New-item limit</span><span className="font-bold text-[#294e48]">{newReviewCount} queued</span></div><div className="flex items-center justify-between py-2.5 text-xs"><span className="font-semibold text-[#5c756e]">Scheduling scope</span><span className="font-bold text-[#294e48]">Keyed items</span></div></div><div className="mt-4 flex items-center gap-2 border-l-2 border-[#31534e] pl-3"><img src="./manus-storage/meridian-mark_f22f4c75.png" alt="Meridian provenance seal" className="h-5 w-5 bg-[#e7f3ee] p-0.5" /><p className="text-[11px] leading-4 text-[#607971]">Meridian keeps recall dates on this device and never mixes unreviewed OCR drafts into the schedule.</p></div></div>
        </div>
        </aside>
      </section>
    </div>
  );
}

function PracticeView({ question, questionBank, index, selectedOption, submitted, record, onSelect, onSubmit, onMove, onJump, onBookmark, incorrectReviewSession, scheduledSession, onRate, showLearningAids, onToggleLearningAids, showEmojiCues, memoryAidRevealed, onRevealMemoryAid, subjectFilter, topicFilter, studyMode, onSubjectFilterChange, onTopicFilterChange, onStudyModeChange, onQuickSet, subjects, topics }: { question?: Question; questionBank: Question[]; index: number; selectedOption: number | null; submitted: boolean; record?: Attempt; onSelect: (value: number) => void; onSubmit: () => void; onMove: (direction: 1 | -1) => void; onJump: (index: number) => void; onBookmark: () => void; incorrectReviewSession: boolean; scheduledSession: boolean; onRate: (rating: RecallRating) => void; showLearningAids: boolean; onToggleLearningAids: () => void; showEmojiCues: boolean; memoryAidRevealed: boolean; onRevealMemoryAid: () => void; subjectFilter: string | null; topicFilter: string | null; studyMode: StudyMode; onSubjectFilterChange: (subject: string | null) => void; onTopicFilterChange: (topic: string | null) => void; onStudyModeChange: (mode: StudyMode) => void; onQuickSet: () => void; subjects: string[]; topics: { topic: string; label: string; total: number; keyed: number }[] }) {
  const keyed = question ? hasAnswerKey(question) : false;
  const isCorrect = Boolean(question && keyed && selectedOption === question.correctOption);
  const memoryAid = question && hasCompleteMemoryAid(question.memoryAid) ? question.memoryAid : undefined;
  const swipe = useSwipe(() => onMove(1), () => onMove(-1));
  const mapStart = Math.max(0, Math.min(index - 7, Math.max(0, questionBank.length - 15)));
  const mapItems = questionBank.slice(mapStart, mapStart + 15);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (!question) return;
      const key = event.key.toLowerCase();
      if (!submitted && ["1", "2", "3", "4", "5", "6", "a", "b", "c", "d", "e", "f"].includes(key)) {
        const optionIndex = "abcdef".includes(key) ? key.charCodeAt(0) - 97 : Number(key) - 1;
        if (optionIndex >= 0 && optionIndex < question.options.length) onSelect(optionIndex);
      }
      if (event.key === "Enter" && !submitted && selectedOption !== null) onSubmit();
      if (event.key === "ArrowRight" || key === "n") onMove(1);
      if (event.key === "ArrowLeft" || key === "p") onMove(-1);
      if (key === "b") onBookmark();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [question, submitted, selectedOption, onSelect, onSubmit, onMove, onBookmark]);

  if (!question) {
    return (
      <div className="rounded-[22px] border border-[#d8e2dc] bg-white p-8 text-center shadow-[0_10px_28px_rgba(22,54,49,0.045)]">
        <p className="section-kicker">Revision session</p>
        <h2 className="mt-2 font-serif text-[28px] text-[#244642]">No questions match these filters</h2>
        <p className="mt-3 text-sm text-[#6a8079]">Try All subjects, switch to All records, or start a Quick 20 from keyed items.</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={() => { onSubjectFilterChange(null); onTopicFilterChange(null); onStudyModeChange("keyed"); }} className="bg-[#087c77] text-white hover:bg-[#066d69]">Show keyed bank</Button>
          <Button onClick={onQuickSet} variant="outline" className="border-[#cddbd5] bg-white text-[#31544e]"><Dices size={15} /> Quick 20</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_308px]">
      <section className="min-w-0">
        {incorrectReviewSession && <div className="mb-5 rounded-xl border border-[#e9b9a7] bg-[#fff4f0] px-4 py-3 text-sm leading-5 text-[#854531]"><p className="font-bold">Incorrect-answer review</p><p className="mt-1 text-xs">These are keyed questions you previously answered incorrectly. Re-attempt first, then use the explanation and learning aids to consolidate the gap.</p></div>}
        {scheduledSession && !incorrectReviewSession && <div className="mb-5 rounded-xl border border-[#b7d5c9] bg-[#eff8f4] px-4 py-3 text-sm leading-5 text-[#31554e]"><p className="font-bold">Queued session</p><p className="mt-1 text-xs">This sitting is a fixed local queue. Subject filters stay available after you finish or leave it.</p></div>}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <button onClick={() => onSubjectFilterChange(null)} className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold transition", subjectFilter === null ? "border-[#087c77] bg-[#087c77] text-white" : "border-[#c8d7d1] bg-white text-[#526f67] hover:bg-[#f0f6f3]")}>All</button>
          {subjects.map((s) => (
            <button key={s} onClick={() => onSubjectFilterChange(s)} className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold transition", subjectFilter === s ? "border-[#087c77] bg-[#087c77] text-white" : "border-[#c8d7d1] bg-white text-[#526f67] hover:bg-[#f0f6f3]")}>{s === "Evidence-based medicine" ? "EBM" : s.length > 14 ? s.slice(0, 12) + "…" : s}</button>
          ))}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {([{ value: "keyed", label: "Keyed" }, { value: "all", label: "All records" }, { value: "ungraded", label: "Ungraded" }] as { value: StudyMode; label: string }[]).map((item) => (
            <button key={item.value} onClick={() => onStudyModeChange(item.value)} className={cn("rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", studyMode === item.value ? "border-[#103f3c] bg-[#103f3c] text-white" : "border-[#d0ddd7] bg-white text-[#526f67] hover:bg-[#f0f6f3]")}>{item.label}</button>
          ))}
          <button onClick={onQuickSet} className="ml-auto inline-flex items-center gap-1 rounded-md border border-[#c8d7d1] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#31554e] hover:bg-[#f0f6f3]"><Dices size={12} /> Quick 20</button>
        </div>
        {subjectFilter && topics.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            <button onClick={() => onTopicFilterChange(null)} className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold", topicFilter === null ? "border-[#087c77] bg-[#eaf6f0] text-[#087c77]" : "border-[#d5e3dc] bg-white text-[#5b756d]")}>All topics</button>
            {topics.map((topic) => (
              <button key={topic.topic} onClick={() => onTopicFilterChange(topic.topic)} className={cn("rounded-full border px-2.5 py-1 text-[10px] font-semibold", topicFilter === topic.topic ? "border-[#087c77] bg-[#eaf6f0] text-[#087c77]" : "border-[#d5e3dc] bg-white text-[#5b756d]")}>{topic.label}</button>
            ))}
          </div>
        )}
        {!keyed && <div className="mb-4 rounded-xl border border-[#e3c78f] bg-[#fff9ea] px-4 py-3 text-xs leading-5 text-[#725b2e]"><p className="font-bold">Ungraded source record</p><p className="mt-1">No detected answer key. Choose an option to reveal notes. This will not be marked correct or incorrect.</p></div>}
        {question.isOcrDraft && keyed && <div className="mb-4 rounded-xl border border-[#d5e3dc] bg-[#f7fbf9] px-4 py-3 text-xs leading-5 text-[#4d6861]"><p className="font-bold">Private source record</p><p className="mt-1">This item is from your local OCR catalogue. Use it for revision; timed mocks still exclude unreviewed drafts.</p></div>}
        {question.needsImage && <div className="mb-4 rounded-xl border border-[#e9b9a7] bg-[#fff4f0] px-4 py-3 text-xs leading-5 text-[#854531]"><p className="font-bold">Image-dependent stem</p><p className="mt-1">The original page referred to a figure that is not bundled here. Answer from the text if you can.</p></div>}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#58736d]"><span className="inline-flex h-6 items-center rounded-md bg-[#d9ede7] px-2 text-[#087c77]">{question.subject === "Evidence-based medicine" ? "EBM" : question.subject.slice(0, 3).toUpperCase()}</span><span>{question.topic}</span><span className="text-[#a1afa9]">/</span><span>Question {index + 1} of {questionBank.length}</span></div>
          <div className="flex items-center gap-1"><button onClick={() => onMove(-1)} aria-label="Previous question" className="question-nav"><ArrowLeft size={16} /></button><button onClick={() => onMove(1)} aria-label="Next question" className="question-nav"><ArrowRight size={16} /></button></div>
        </div>
        <article {...swipe} className="overflow-hidden rounded-[22px] border border-[#d8e2dc] bg-white shadow-[0_10px_28px_rgba(22,54,49,0.055)] touch-pan-y">
          <div className="flex items-start justify-between gap-5 border-b border-[#e3e9e5] px-6 py-5 sm:px-8">
            <div><p className="section-kicker">Single best answer</p><h2 className="mt-2 max-w-3xl font-serif text-[25px] leading-[1.25] tracking-[-0.018em] text-[#203f3b] sm:text-[29px]">{question.stem}</h2></div>
            <button onClick={onBookmark} aria-label={record?.bookmarked ? "Remove bookmark" : "Bookmark question"} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition", record?.bookmarked ? "border-[#c2735c] bg-[#fff2ed] text-[#a14e35]" : "border-[#d4dfd9] text-[#66807a] hover:border-[#87aea2] hover:bg-[#eff6f2]")}><Bookmark size={17} fill={record?.bookmarked ? "currentColor" : "none"} /></button>
          </div>
          <div className="p-5 sm:p-8">
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => {
                const showCorrect = keyed && submitted && optionIndex === question.correctOption;
                const showIncorrect = keyed && submitted && optionIndex === selectedOption && optionIndex !== question.correctOption;
                return (
                  <button
                    key={option}
                    disabled={submitted}
                    onClick={() => onSelect(optionIndex)}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-xl border px-4 py-4 text-left transition duration-150",
                      selectedOption === optionIndex && !submitted ? "border-[#087c77] bg-[#eff8f5] ring-2 ring-[#087c77]/15" : "border-[#d9e2dd] bg-white hover:border-[#9cc0b5] hover:bg-[#fafcfb]",
                      showCorrect && "border-[#5fb391] bg-[#eaf7f0] ring-0",
                      showIncorrect && "border-[#df846a] bg-[#fff0ec] ring-0",
                    )}
                  >
                    <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border font-sans text-[11px] font-bold", showCorrect ? "border-[#3a9d75] bg-[#3a9d75] text-white" : showIncorrect ? "border-[#cd6046] bg-[#cd6046] text-white" : selectedOption === optionIndex ? "border-[#087c77] bg-[#087c77] text-white" : "border-[#cddbd5] bg-[#f8faf8] text-[#55716a]")}>{showCorrect ? <Check size={15} /> : showIncorrect ? <X size={15} /> : String.fromCharCode(65 + optionIndex)}</span>
                    <span className="pt-0.5 text-[15px] leading-6 text-[#35544f]">{option}</span>
                  </button>
                );
              })}
            </div>
            {!submitted ? (
              <div className="mt-7 flex items-center justify-between border-t border-[#e5ebe7] pt-5"><p className="text-xs text-[#7b9089]">{keyed ? "Choose one answer before checking the explanation. Keys 1–5 or A–E." : "Choose an option, then reveal the source notes. This item is ungraded."}</p><Button disabled={selectedOption === null} onClick={onSubmit} className="h-10 bg-[#087c77] px-5 text-sm text-white hover:bg-[#066d69] disabled:bg-[#b9c9c2]">{keyed ? "Check answer" : "Reveal notes"} <ChevronRight size={16} /></Button></div>
            ) : (
              <div className={cn("mt-7 border-t pt-6", !keyed ? "border-[#e3c78f]" : isCorrect ? "border-[#b8e0cc]" : "border-[#f0c3b6]")}>
                <div className={cn("flex items-center gap-3 rounded-xl px-4 py-3", !keyed ? "bg-[#fff9ea] text-[#725b2e]" : isCorrect ? "bg-[#ebf8f0] text-[#236b4d]" : "bg-[#fff0ec] text-[#9a402b]")}><span className={cn("grid h-8 w-8 place-items-center rounded-full", !keyed ? "bg-[#c48a3b] text-white" : isCorrect ? "bg-[#4aa77e] text-white" : "bg-[#d96b50] text-white")}>{!keyed ? <CircleHelp size={17} /> : isCorrect ? <Check size={17} /> : <X size={17} />}</span><div><p className="text-sm font-bold">{!keyed ? "Ungraded" : isCorrect ? "Correct" : "Not this time"}</p><p className="text-xs opacity-80">{!keyed ? "No detected key, so this does not affect accuracy or the missed queue." : isCorrect ? "Keep the principle, not only the answer." : question.correctOption !== null ? `Correct answer: ${String.fromCharCode(65 + question.correctOption)}.` : ""}</p></div></div>
                <div className="mt-5 grid gap-5 rounded-xl border border-[#d9e7e1] bg-[#f5faf7] p-5 sm:grid-cols-[minmax(0,1fr)_190px]">
                  <div><p className="section-kicker">{keyed ? "Correct-answer explanation" : "Source notes"}</p>{keyed && question.correctOption !== null && <p className="mt-2 flex items-start gap-2 text-sm font-bold leading-6 text-[#31554e]"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#087c77] text-[10px] text-white">{String.fromCharCode(65 + question.correctOption)}</span><span>{question.options[question.correctOption]}</span></p>}<p className="mt-3 font-serif text-[17px] leading-7 text-[#2d4d48]">{isThinNote(question.explanation) ? "No reliable explanation was extracted for this source page. Treat the stem and options as a prompt only." : question.explanation}</p></div>
                  <div className="border-t border-[#d8e6e0] pt-4 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><p className="section-kicker">Learning note</p><p className="mt-2 text-sm leading-6 text-[#486760]">{isThinNote(question.learningNote) ? "Add your own note after you check the original page." : question.learningNote}</p><div className="mt-4 flex flex-wrap gap-1.5">{question.tags.map((tag) => <span key={tag} className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-[#52716a]">{tag}</span>)}</div></div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#dce8e2] pt-4"><div><p className="section-kicker">Learning aids</p><p className="mt-1 text-xs text-[#667e76]">High-yield distinctions and recall cues.</p></div><button onClick={onToggleLearningAids} aria-pressed={showLearningAids} className={cn("inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition", showLearningAids ? "border-[#9ac7b8] bg-[#eaf6f0] text-[#087c77]" : "border-[#cfdcd6] bg-white text-[#526f67] hover:bg-[#f3f7f5]")}><BookOpenCheck size={15} />{showLearningAids ? "Hide aids" : "Show aids"}</button></div>
                {showLearningAids && <div className="mt-3">{memoryAid ? <section className="relative overflow-hidden rounded-xl border border-[#bcd8cd] bg-[#eff8f4] p-4"><div className="absolute inset-y-0 left-0 w-1 bg-[#087c77]" /><div className="pl-3"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="section-kicker">Cue-first recall</p><p className="mt-1 text-xs leading-5 text-[#5b756d]">Name the fact before revealing the full aid.</p></div>{showEmojiCues && <span role="img" aria-label={memoryAid.cueLabel} className="rounded-lg border border-[#c8e2d7] bg-white px-3 py-1.5 text-xl tracking-[0.14em]">{memoryAid.emojiCues.join(" ")}</span>}</div>{!memoryAidRevealed ? <div className="mt-4 rounded-lg border border-dashed border-[#a9ccbf] bg-white/70 p-3"><p className="text-sm font-semibold text-[#31554e]">Prompt: {memoryAid.cueLabel}</p><button onClick={onRevealMemoryAid} className="mt-3 inline-flex h-9 items-center gap-2 rounded-lg bg-[#087c77] px-3 text-xs font-bold text-white hover:bg-[#066d69]"><BookOpenCheck size={15} /> Reveal fact and mnemonic</button></div> : <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-lg border border-[#bcd8cd] bg-white/80 p-3"><p className="section-kicker">High-yield fact</p><p className="mt-2 text-sm leading-6 text-[#31554e]">{memoryAid.coreFact}</p></div><div className="rounded-lg border border-[#e4cdaa] bg-[#fff9ea] p-3"><p className="section-kicker">Mnemonic</p><p className="mt-2 font-serif text-[17px] leading-6 text-[#68502b]">{memoryAid.mnemonic}</p></div><div className="md:col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#d8e6e0] pt-3 text-[10px] leading-4 text-[#607971]"><span>Source trace: {memoryAid.sourceLabel}</span><a href={memoryAid.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-[#087c77] hover:text-[#066d69]">Open reference</a></div></div>}</div></section> : <div className="grid gap-3 md:grid-cols-2"><section className="relative overflow-hidden rounded-xl border border-[#bcd8cd] bg-[#edf7f2] p-4"><div className="absolute inset-y-0 left-0 w-1 bg-[#087c77]" /><div className="pl-2"><p className="section-kicker">High-yield note</p><p className="mt-2 text-sm leading-6 text-[#31554e]">{question.highYieldNote ?? (question.needsReview ? "No authoritative high-yield note is shown for an unreviewed OCR draft. Confirm the source record first." : "Add a concise high-yield distinction during the next source-review pass.")}</p></div></section><section className="relative overflow-hidden rounded-xl border border-[#e4cdaa] bg-[#fff9ea] p-4"><div className="absolute inset-y-0 left-0 w-1 bg-[#c48a3b]" /><div className="pl-2"><p className="section-kicker"><span role="img" aria-label="memory cue">🧠</span> Mnemonic</p><p className="mt-2 font-serif text-[17px] leading-6 text-[#68502b]">{question.mnemonic ?? (question.needsReview ? "No authoritative mnemonic is shown for an unreviewed OCR draft." : "Add a concise recall cue during the next source-review pass.")}</p></div></section></div>}</div>}
                {scheduledSession ? <div className="mt-5 rounded-xl border border-[#cddfd7] bg-[#f4f8f6] p-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Set next review</p><p className="mt-1 text-xs text-[#617c74]">Rate recall after reading the explanation. {isCorrect ? "Good is suggested after a correct answer." : "Again is suggested after an incorrect answer."}</p></div><p className="text-[11px] font-semibold text-[#617c74]">{record?.schedule?.dueDate ? `Previous due: ${formatDate(record.schedule.dueDate)}` : "First scheduled review"}</p></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{(["again", "hard", "good", "easy"] as RecallRating[]).map((rating) => <button key={rating} onClick={() => onRate(rating)} className={cn("rounded-lg border px-3 py-2 text-left transition", rating === "again" ? "border-[#e1a18e] bg-[#fff3ef] text-[#99442e]" : rating === "good" ? "border-[#76bda3] bg-[#eaf6f0] text-[#087c77]" : "border-[#d0ddd7] bg-white text-[#44625a] hover:bg-[#edf5f1]")}><span className="block text-xs font-bold capitalize">{rating}</span><span className="mt-0.5 block text-[10px]">{rating === "again" ? "Today" : rating === "hard" ? "Shorter interval" : rating === "good" ? "Standard interval" : "Longer interval"}</span></button>)}</div></div> : <div className="mt-5 flex justify-end"><Button onClick={() => onMove(1)} className="h-10 bg-[#103f3c] px-5 text-sm text-white hover:bg-[#0b322f]">Next question <ArrowRight size={16} /></Button></div>}
              </div>
            )}
          </div>
        </article>
      </section>
      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#d8e2dc] bg-white p-5 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><p className="section-kicker">Session map</p><p className="mt-1 text-xs text-[#6d827b]">{index + 1} of {questionBank.length}</p><div className="mt-4 grid grid-cols-5 gap-2">{mapItems.map((item, offset) => { const itemIndex = mapStart + offset; return <button key={item.id} onClick={() => onJump(itemIndex)} className={cn("grid aspect-square place-items-center rounded-lg text-xs font-bold", item.id === question.id ? "bg-[#087c77] text-white" : hasAnswerKey(item) ? "bg-[#edf4f0] text-[#55736b] hover:bg-[#dceae4]" : "bg-[#fff6e5] text-[#99621d] hover:bg-[#f8ecd2]")}>{itemIndex + 1}</button>; })}</div><label className="mt-4 flex items-center gap-2 text-xs text-[#6d827b]">Jump <input type="number" min={1} max={questionBank.length} defaultValue={index + 1} key={index} onKeyDown={(event) => { if (event.key === "Enter") onJump(Number((event.target as HTMLInputElement).value) - 1); }} className="h-8 w-20 rounded-md border border-[#d0ddd7] bg-white px-2 font-mono text-sm text-[#244642]" /></label><p className="mt-4 text-xs leading-5 text-[#70867f]">{questionBank.length} items in this sitting. Keys 1–5 select, Enter checks, arrows move, B bookmarks.</p></section>
        <section className="overflow-hidden rounded-2xl border border-[#d5e1db] bg-white"><div className="border-b border-[#e2eae5] px-5 py-4"><p className="section-kicker">Source trace</p><p className="mt-1 text-sm font-semibold text-[#365750]">{question.source}</p></div><dl className="space-y-3 px-5 py-4 text-xs"><div className="flex justify-between gap-3"><dt className="text-[#768982]">Page</dt><dd className="font-semibold text-[#3a5953]">{question.sourcePage}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#768982]">Last attempted</dt><dd className="font-semibold text-[#3a5953]">{formatDate(record?.lastAttempted)}</dd></div><div className="flex justify-between gap-3"><dt className="text-[#768982]">Personal accuracy</dt><dd className="font-semibold text-[#3a5953]">{record?.attempts ? `${accuracy(record)}%` : "—"}</dd></div>{question.primaryBlueprintCategory && <div className="flex justify-between gap-3"><dt className="text-[#768982]">Blueprint</dt><dd className="text-right font-semibold text-[#3a5953]">{question.primaryBlueprintCategory}</dd></div>}</dl>{question.sourceLink ? <a href={question.sourceLink} target="_blank" rel="noreferrer" className="flex items-center justify-between border-t border-[#e2eae5] px-5 py-3 text-xs font-bold text-[#087c77] hover:bg-[#eff6f2]">Open source file <ArrowRight size={14} /></a> : <p className="border-t border-[#e2eae5] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#81938c]">Bundled verified source record</p>}</section>
        <section className="relative overflow-hidden rounded-2xl bg-[#e7eee9] p-5"><img src="./manus-storage/meridian-topic-pattern_7e5e6611.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-multiply" /><div className="relative"><CircleHelp size={18} className="text-[#087c77]" /><p className="mt-3 text-sm font-bold text-[#284b46]">Study deliberately</p><p className="mt-1 text-xs leading-5 text-[#5b7770]">Answer first, then read why the other options fail.</p></div></section>
      </aside>
    </div>
  );
}

function MemoryRecallView({ session, index, showEmojiCues, cueFirstMode, onStart, onRate, onExit }: { session: Question[] | null; index: number; showEmojiCues: boolean; cueFirstMode: boolean; onStart: () => void; onRate: (rating: RecallRating) => void; onExit: () => void }) {
  const question = session?.[index];
  const memoryAid = question && hasCompleteMemoryAid(question.memoryAid) ? question.memoryAid : undefined;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => setRevealed(!cueFirstMode), [question?.id, cueFirstMode]);

  if (!session || !question || !memoryAid) {
    return <div className="max-w-4xl"><section className="relative overflow-hidden rounded-[22px] border border-[#d7e2dc] bg-white p-7 shadow-[0_10px_28px_rgba(22,54,49,0.045)]"><div className="absolute inset-0 clinical-rules opacity-35" aria-hidden="true" /><div className="relative"><p className="section-kicker">High-yield recall</p><h2 className="mt-2 font-serif text-[31px] leading-[1.1] text-[#244642]">Retrieve a cue before you reveal it.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-[#627a73]">This local session uses only questions with a complete, source-linked fact, mnemonic, and cue. It never changes answer accuracy or mock-exam eligibility.</p><Button onClick={onStart} className="mt-6 bg-[#103f3c] text-white hover:bg-[#0b322f]">Start high-yield recall <Brain size={16} /></Button></div></section></div>;
  }

  return <div className="mx-auto max-w-4xl"><section className="relative overflow-hidden rounded-[22px] border border-[#d5e2db] bg-white shadow-[0_10px_28px_rgba(22,54,49,0.05)]"><div className="absolute inset-0 clinical-rules opacity-45" aria-hidden="true" /><div className="relative border-b border-[#dce8e2] px-6 py-5 sm:px-8"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="section-kicker">High-yield recall · local only</p><h2 className="mt-1 font-serif text-[27px] leading-tight text-[#244642]">{question.subject} / {question.topic}</h2></div><span className="rounded-md border border-[#b7d5c9] bg-[#eef8f3] px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-[#087c77]">Prompt {index + 1} / {session.length}</span></div>{question.isOcrDraft && <p className="mt-3 border-l-2 border-[#c48a3b] pl-3 text-xs leading-5 text-[#846329]">Source-reviewed OCR draft: this recall aid is available because its original page and external reference were checked. It remains excluded from mock exams.</p>}</div><div className="relative px-6 py-7 sm:px-8"><div className="rounded-2xl border border-[#bcd8cd] bg-[#eff8f4] p-5"><p className="section-kicker">Cue-first prompt</p>{showEmojiCues ? <div role="img" aria-label={memoryAid.cueLabel} className="mt-4 text-4xl tracking-[0.18em]">{memoryAid.emojiCues.join(" ")}</div> : <p className="mt-4 text-sm font-semibold leading-6 text-[#31554e]">Cue: {memoryAid.cueLabel}</p>}<p className="mt-5 max-w-2xl text-lg font-serif leading-7 text-[#294d47]">Pause and state the high-yield fact aloud or mentally before revealing it.</p>{!revealed && <Button onClick={() => setRevealed(true)} className="mt-5 bg-[#087c77] text-white hover:bg-[#066d69]">Reveal fact and mnemonic <BookOpenCheck size={16} /></Button>}</div>{revealed && <div className="mt-5 grid gap-4 md:grid-cols-2"><section className="rounded-xl border border-[#bcd8cd] bg-[#edf7f2] p-5"><p className="section-kicker">High-yield fact</p><p className="mt-3 text-[16px] leading-7 text-[#31554e]">{memoryAid.coreFact}</p></section><section className="rounded-xl border border-[#e4cdaa] bg-[#fff9ea] p-5"><p className="section-kicker">Mnemonic</p><p className="mt-3 font-serif text-[19px] leading-7 text-[#68502b]">{memoryAid.mnemonic}</p></section><div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#dce8e2] pt-4 text-xs text-[#637b73]"><span>Source trace: {memoryAid.sourceLabel}</span><a href={memoryAid.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-[#087c77] hover:text-[#066d69]">Open reference</a></div><div className="md:col-span-2 rounded-xl border border-[#d4e1da] bg-[#f8fbf9] p-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="section-kicker">Rate your retrieval</p><p className="mt-1 text-xs leading-5 text-[#617b73]">This updates only the recall-aid schedule. Answer attempts and answer accuracy remain unchanged.</p></div><button onClick={onExit} className="text-xs font-bold text-[#58736c] hover:text-[#103f3c]">Exit session</button></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{(["again", "hard", "good", "easy"] as RecallRating[]).map((rating) => <button key={rating} onClick={() => onRate(rating)} className={cn("rounded-lg border px-3 py-2 text-left transition", rating === "again" ? "border-[#e1a18e] bg-[#fff3ef] text-[#99442e]" : rating === "good" ? "border-[#76bda3] bg-[#eaf6f0] text-[#087c77]" : "border-[#d0ddd7] bg-white text-[#44625a] hover:bg-[#edf5f1]")}><span className="block text-xs font-bold capitalize">{rating}</span><span className="mt-0.5 block text-[10px]">{rating === "again" ? "Repeat today" : rating === "hard" ? "Shorter interval" : rating === "good" ? "Standard interval" : "Longer interval"}</span></button>)}</div></div></div>}</div></section></div>;
}

function PrimaryMockView({ session, questions, index, now, onStart, onMove, onAnswer, onToggleFlag, onFinish, onDiscard }: { session: MockExamSession | null; questions: Question[]; index: number; now: number; onStart: () => void; onMove: (index: number) => void; onAnswer: (questionId: string, answer: number) => void; onToggleFlag: (questionId: string) => void; onFinish: () => void; onDiscard: () => void }) {
  const coverage = blueprintCoverageFor(questions);
  const approvedCount = approvedQuestionsForMock(questions).length;

  if (!session) {
    const isFullPaperAvailable = approvedCount >= 180;
    const durationSeconds = isFullPaperAvailable ? 3 * 60 * 60 : approvedCount * 60;
    return <div className="max-w-5xl"><section className="relative overflow-hidden rounded-[22px] border border-[#c8ded5] bg-white p-6 shadow-[0_10px_28px_rgba(22,54,49,0.045)] sm:p-8"><div className="absolute inset-0 clinical-rules opacity-45" aria-hidden="true" /><div className="relative"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="max-w-2xl"><p className="section-kicker">Exam simulation</p><h2 className="mt-2 font-serif text-[32px] leading-[1.08] tracking-[-0.035em] text-[#193d38]">MRCEM Primary mock exam</h2><p className="mt-4 text-sm leading-6 text-[#58746d]">A seeded local shuffle selects approved, blueprint-tagged questions. Explanations, high-yield notes, and mnemonics remain hidden until you submit the paper.</p></div><div className="grid h-12 w-12 place-items-center rounded-xl bg-[#087c77] text-white shadow-[0_8px_20px_rgba(0,124,119,0.18)]"><ClipboardCheck size={22} /></div></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><ExamRule label="Official target" value="180 SBA questions" detail="One single paper" /><ExamRule label="Official timing" value="3 hours" detail="No scheduled break" /><ExamRule label="Scoring" value="1 / 0 marks" detail="No negative marking" /></div><div className="mt-6 rounded-xl border border-[#e3c78f] bg-[#fff9ea] p-4 text-sm leading-6 text-[#725b2e]"><p className="font-bold">{isFullPaperAvailable ? "Full-paper simulation available" : "Bank-limited partial mock"}</p><p className="mt-1">{isFullPaperAvailable ? "This approved bank can populate the full 180-question, three-hour Primary format." : `Only ${approvedCount} approved and blueprint-tagged question${approvedCount === 1 ? " is" : "s are"} currently available. Meridian will use each once for a ${formatMockTime(durationSeconds)} paced partial mock. It will not repeat questions or include OCR drafts to imitate a full paper.`}</p></div><div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{coverage.map((item) => <div key={item.category} className="flex items-center justify-between rounded-lg border border-[#d9e5df] bg-[#f8fbf9] px-3 py-2 text-xs"><span className="font-semibold text-[#46645d]">{item.category}</span><span className={item.available ? "font-bold text-[#087c77]" : "font-bold text-[#a36d20]"}>{item.available} / {item.target}</span></div>)}</div><div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[#dfe8e3] pt-5"><Button onClick={onStart} disabled={!approvedCount} className="h-10 bg-[#087c77] px-5 text-sm text-white hover:bg-[#066d69] disabled:bg-[#b9c9c2]">Generate balanced mock <ShuffleIcon /><ArrowRight size={16} /></Button><p className="text-xs text-[#687f77]">Question order is fixed for this sitting and saved only on this device.</p></div></div></section><section className="mt-5 rounded-2xl border border-[#d8e2dc] bg-[#f4f8f6] p-5"><p className="section-kicker">Blueprint safeguard</p><p className="mt-2 max-w-3xl text-sm leading-6 text-[#5d766e]">Meridian targets the official subject mix only where tagged approved questions are available. Missing categories are shown above as bank-limited coverage. A raw score is shown after submission; Meridian does not calculate a pass or fail because RCEM standard setting is not a fixed percentage.</p></section></div>;
  }

  const byId = new Map(questions.map((question) => [question.id, question]));
  const mockQuestions = session.plan.questionIds.map((id) => byId.get(id)).filter((question): question is Question => Boolean(question));
  const safeIndex = Math.min(index, Math.max(0, mockQuestions.length - 1));
  const question = mockQuestions[safeIndex];
  const timeRemaining = session.completedAt ? 0 : Math.max(0, session.plan.durationSeconds - Math.floor((now - session.startedAt) / 1000));
  const isTimedOut = !session.completedAt && timeRemaining === 0;
  const answeredCount = mockQuestions.filter((item) => session.answerByQuestionId[item.id] !== undefined).length;
  const correctCount = mockQuestions.filter((item) => session.answerByQuestionId[item.id] === item.correctOption).length;

  if (session.completedAt) {
    const accuracyPercent = mockQuestions.length ? Math.round((correctCount / mockQuestions.length) * 100) : 0;
    return <div className="max-w-5xl"><section className="rounded-[22px] border border-[#c8ded5] bg-white p-6 shadow-[0_10px_28px_rgba(22,54,49,0.045)] sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="section-kicker">Mock complete</p><h2 className="mt-2 font-serif text-[32px] leading-[1.08] tracking-[-0.035em] text-[#193d38]">Primary mock summary</h2><p className="mt-3 text-sm text-[#637b73]">Raw score only. This is not an RCEM pass or fail prediction.</p></div><div className="grid h-12 w-12 place-items-center rounded-xl bg-[#e7f3ee] text-[#087c77]"><CheckCircle2 size={23} /></div></div><div className="mt-7 grid gap-3 sm:grid-cols-3"><ExamRule label="Score" value={`${correctCount} / ${mockQuestions.length}`} detail={`${accuracyPercent}% correct`} /><ExamRule label="Answered" value={`${answeredCount} / ${mockQuestions.length}`} detail={`${mockQuestions.length - answeredCount} left blank`} /><ExamRule label="Flagged" value={String(session.flaggedQuestionIds.length)} detail="Marked during the sitting" /></div><div className="mt-7 rounded-xl border border-[#e2e9e5] bg-[#f5faf7] p-5"><p className="section-kicker">Review map</p><div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">{mockQuestions.map((item, itemIndex) => { const answer = session.answerByQuestionId[item.id]; const isCorrect = answer === item.correctOption; return <span key={item.id} title={`Question ${itemIndex + 1}`} className={cn("grid aspect-square place-items-center rounded-lg text-[11px] font-bold", answer === undefined ? "border border-[#d9e3de] bg-white text-[#70837d]" : isCorrect ? "bg-[#e4f5ed] text-[#267253]" : "bg-[#fff0ec] text-[#a14e35]")}>{itemIndex + 1}</span>; })}</div></div><div className="mt-6 flex flex-wrap gap-3"><Button onClick={onDiscard} className="bg-[#087c77] text-white hover:bg-[#066d69]">Return to study desk <ArrowRight size={16} /></Button></div></section></div>;
  }

  if (!question) return <div className="rounded-2xl border border-[#efd1c7] bg-[#fff8f5] p-6 text-[#764e43]"><p className="font-bold">This saved mock no longer matches the approved local bank.</p><Button onClick={onDiscard} variant="outline" className="mt-4 border-[#dfa88f] bg-white text-[#a54832]">Discard saved mock</Button></div>;

  return <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_308px]"><section className="min-w-0"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="section-kicker">MRCEM Primary mock</p><p className="mt-1 text-xs font-semibold text-[#5d7770]">Question {safeIndex + 1} of {mockQuestions.length} · {answeredCount} answered</p></div><div className={cn("rounded-lg border px-3 py-2 font-mono text-sm font-bold", isTimedOut ? "border-[#dfaa98] bg-[#fff0eb] text-[#a54832]" : "border-[#9ac7b8] bg-[#eaf6f0] text-[#087c77]")}><Clock3 size={15} className="mr-1.5 inline" />{isTimedOut ? "00:00" : formatMockTime(timeRemaining)}</div></div><article className="overflow-hidden rounded-[22px] border border-[#d8e2dc] bg-white shadow-[0_10px_28px_rgba(22,54,49,0.055)]"><div className="flex items-start justify-between gap-5 border-b border-[#e3e9e5] px-6 py-5 sm:px-8"><div><p className="section-kicker">Single best answer</p><h2 className="mt-2 max-w-3xl font-serif text-[25px] leading-[1.25] tracking-[-0.018em] text-[#203f3b] sm:text-[29px]">{question.stem}</h2></div><button onClick={() => onToggleFlag(question.id)} aria-pressed={session.flaggedQuestionIds.includes(question.id)} aria-label={session.flaggedQuestionIds.includes(question.id) ? "Remove question flag" : "Flag question for review"} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition", session.flaggedQuestionIds.includes(question.id) ? "border-[#d29b50] bg-[#fff6e5] text-[#a36d20]" : "border-[#d4dfd9] text-[#66807a] hover:border-[#87aea2] hover:bg-[#eff6f2]")}><Flag size={17} fill={session.flaggedQuestionIds.includes(question.id) ? "currentColor" : "none"} /></button></div><div className="p-5 sm:p-8"><div className="space-y-3">{question.options.map((option, optionIndex) => <button key={option} disabled={isTimedOut} onClick={() => onAnswer(question.id, optionIndex)} className={cn("group flex w-full items-start gap-4 rounded-xl border px-4 py-4 text-left transition duration-150", session.answerByQuestionId[question.id] === optionIndex ? "border-[#087c77] bg-[#eff8f5] ring-2 ring-[#087c77]/15" : "border-[#d9e2dd] bg-white hover:border-[#9cc0b5] hover:bg-[#fafcfb]", isTimedOut && "cursor-not-allowed opacity-60")}><span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border font-sans text-[11px] font-bold", session.answerByQuestionId[question.id] === optionIndex ? "border-[#087c77] bg-[#087c77] text-white" : "border-[#cddbd5] bg-[#f8faf8] text-[#55716a]")}>{String.fromCharCode(65 + optionIndex)}</span><span className="pt-0.5 text-[15px] leading-6 text-[#35544f]">{option}</span></button>)}</div><div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5ebe7] pt-5"><p className="text-xs text-[#7b9089]">{isTimedOut ? "Time has expired. Submit to lock this paper and view your raw score." : "Answers are saved locally. Explanations appear only after final submission."}</p><Button onClick={onFinish} className="h-10 bg-[#103f3c] px-5 text-sm text-white hover:bg-[#0b322f]">Submit mock <CheckCircle2 size={16} /></Button></div></div></article></section><aside className="space-y-4"><section className="rounded-2xl border border-[#d8e2dc] bg-white p-5 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="flex items-center justify-between"><p className="section-kicker">Paper map</p><span className="text-[10px] font-bold text-[#087c77]">LOCAL</span></div><div className="mt-4 grid grid-cols-5 gap-2">{mockQuestions.map((item, itemIndex) => <button key={item.id} onClick={() => onMove(itemIndex)} aria-label={`Go to question ${itemIndex + 1}`} className={cn("relative grid aspect-square place-items-center rounded-lg text-xs font-bold", itemIndex === safeIndex ? "bg-[#087c77] text-white" : session.answerByQuestionId[item.id] !== undefined ? "bg-[#e5f4ef] text-[#087c77] hover:bg-[#d5ebe3]" : "bg-[#edf4f0] text-[#55736b] hover:bg-[#dceae4]")}>{itemIndex + 1}{session.flaggedQuestionIds.includes(item.id) && <Flag size={9} className="absolute right-1 top-1" fill="currentColor" />}</button>)}</div><div className="mt-5 border-t border-[#e3eae5] pt-4 text-xs leading-5 text-[#667e76]"><p><span className="font-bold text-[#31554e]">Format:</span> {session.plan.mode === "full" ? "180 questions · 3 hours" : `${mockQuestions.length} approved questions · paced partial mock`}</p><p className="mt-2">No explanations, learning aids, or pass prediction are shown during the sitting.</p></div></section><section className="rounded-2xl border border-[#d8e2dc] bg-[#f4f8f6] p-5"><p className="section-kicker">Exam controls</p><p className="mt-2 text-xs leading-5 text-[#607971]">Flag uncertain items, move freely through the paper, then submit when ready. You cannot change answers after submission.</p><button onClick={onDiscard} className="mt-4 text-xs font-bold text-[#a54832] hover:text-[#8d3f2d]">Discard this local mock</button></section></aside></div>;
}

function ExamRule({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-[#d9e6e0] bg-[#f7fbf9] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6a817a]">{label}</p><p className="mt-2 font-serif text-[21px] tracking-[-0.025em] text-[#294a45]">{value}</p><p className="mt-1 text-xs text-[#71857e]">{detail}</p></div>;
}

function ShuffleIcon() {
  return <span aria-hidden="true" className="text-base leading-none">↺</span>;
}

function ReviewView({ filter, questions, store, onFilter, onOpenQuestion, onBookmark, incorrectCount, onStartIncorrectReview }: { filter: "all" | "missed" | "bookmarked" | "unanswered"; questions: Question[]; store: StudyStore; onFilter: (filter: "all" | "missed" | "bookmarked" | "unanswered") => void; onOpenQuestion: (question: Question) => void; onBookmark: (id: string) => void; incorrectCount: number; onStartIncorrectReview: () => void }) {
  const filters: { value: typeof filter; label: string }[] = [{ value: "all", label: "All questions" }, { value: "missed", label: "Missed" }, { value: "bookmarked", label: "Bookmarked" }, { value: "unanswered", label: "Unanswered" }];
  return <div className="max-w-5xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker">Return with intent</p><h2 className="section-title">Review queue</h2><p className="mt-2 text-sm text-[#6a8079]">Use your answer history and bookmarks to select the next item.</p></div><div className="flex flex-wrap gap-2">{filters.map((item) => <button key={item.value} onClick={() => onFilter(item.value)} className={cn("rounded-lg px-3 py-2 text-xs font-bold transition", filter === item.value ? "bg-[#087c77] text-white" : "border border-[#cfddd7] bg-white text-[#526d66] hover:bg-[#eff6f2]")}>{item.label}</button>)}</div></div><section className="relative mt-6 overflow-hidden rounded-2xl border border-[#efc4b6] bg-[#fff7f3] p-5"><div className="absolute inset-y-0 left-0 w-1 bg-[#c96549]" /><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="section-kicker">Focused practice</p><h3 className="mt-1 font-serif text-xl text-[#793d2d]">Incorrect-answer review</h3><p className="mt-1 text-sm text-[#875646]">{incorrectCount ? `${incorrectCount} keyed question${incorrectCount === 1 ? "" : "s"} previously answered incorrectly.` : "No previously incorrect keyed questions yet."}</p></div><Button onClick={onStartIncorrectReview} disabled={!incorrectCount} className="bg-[#a94d35] text-white hover:bg-[#913e2a] disabled:bg-[#d7b4a9]">Practice incorrect <ArrowRight size={16} /></Button></div></section><div className="mt-7 overflow-hidden rounded-2xl border border-[#d8e2dc] bg-white shadow-[0_8px_22px_rgba(22,54,49,0.04)]">{questions.length ? questions.map((question, index) => { const record = store.questions[question.id]; const isMissed = isMissedAttempt(question, record); return <div key={question.id} className="group flex flex-col gap-4 border-b border-[#e5ebe7] p-5 last:border-b-0 sm:flex-row sm:items-center"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4f0] font-serif text-lg text-[#087c77]">{String(index + 1).padStart(2, "0")}</div><div className="min-w-0 flex-1"><div className="mb-1 flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#638078]">{question.topic}</span>{isMissed && <span className="rounded bg-[#fff0eb] px-1.5 py-0.5 text-[10px] font-bold text-[#a1462f]">MISSED</span>}{record?.bookmarked && <span className="rounded bg-[#fff7e9] px-1.5 py-0.5 text-[10px] font-bold text-[#99621d]">SAVED</span>}</div><p className="font-serif text-[17px] leading-6 text-[#294a45]">{question.stem}</p><p className="mt-1 text-xs text-[#788b84]">Source page {question.sourcePage} · {record?.attempts ? `${accuracy(record)}% personal accuracy` : "Not attempted"}</p></div><div className="flex shrink-0 items-center gap-2"><button onClick={() => onBookmark(question.id)} aria-label="Toggle bookmark" className={cn("rounded-lg border p-2", record?.bookmarked ? "border-[#e4b79f] bg-[#fff0eb] text-[#a64d35]" : "border-[#d6e2dc] text-[#68817a] hover:bg-[#eff6f2]")}><Bookmark size={15} fill={record?.bookmarked ? "currentColor" : "none"} /></button><Button onClick={() => onOpenQuestion(question)} variant="outline" className="h-9 border-[#cddbd5] bg-white text-xs text-[#31544e] hover:bg-[#eff6f2]">Open <ArrowRight size={14} /></Button></div></div>; }) : <div className="grid min-h-72 place-items-center p-8 text-center"><div><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#edf4f0] text-[#087c77]"><CheckCircle2 size={22} /></div><h3 className="mt-4 font-serif text-xl text-[#31524d]">Nothing in this queue</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[#748980]">Try another filter, or continue revision to add missed and bookmarked items.</p></div></div>}</div></div>;
}

function LibraryView({ onPractice, onImportBank }: { onPractice: () => void; onImportBank: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const sources = [
    ["Evidence-based medicine", "EBM-All.pdf", "197 pages", "4 pilot questions validated", "ready"],
    ["Anatomy", "Anatomy-All.pdf", "966.4 MB", "Subfolder and merged PDF found", "review"],
    ["Physiology", "Physiology-All.pdf", "296.1 MB", "Subfolder and merged PDF found", "review"],
    ["Pathology", "Pathology-All.pdf", "80.8 MB", "Merged PDF found", "review"],
    ["Microbiology", "Microbiology-All.pdf", "107.9 MB", "Merged PDF found", "review"],
    ["Pharmacology", "Pharmacology-All.pdf", "169.6 MB", "Merged PDF found", "review"],
  ];
  return <div className="max-w-5xl"><div className="rounded-[25px] bg-[#103f3c] p-6 text-white sm:p-8"><div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_270px]"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a6d6cc]">Source-aware revision</p><h2 className="mt-3 max-w-xl font-serif text-[30px] leading-[1.08] tracking-[-0.03em]">The app keeps a page-level trail back to your own PDF sources.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-[#c4ddd7]">The PDFs are scans of browser question pages. OCR can identify likely question pages, but answer options and visual content require review before publication into a study bank.</p></div><div className="rounded-2xl bg-white/8 p-5"><FileText size={20} className="text-[#7ed2c2]" /><p className="mt-4 font-serif text-2xl">1.7 GB</p><p className="mt-1 text-xs leading-5 text-[#b8d4cd]">Approximate total size of the six merged PDFs discovered in the shared folder.</p></div></div></div><div className="mt-7 overflow-hidden rounded-2xl border border-[#d8e2dc] bg-white shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[#e4ebe6] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#71857e]"><span>Source collection</span><span>Status</span></div>{sources.map(([subject, filename, size, note, status]) => <div key={subject} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#e6ece8] px-5 py-4 last:border-b-0"><div><p className="font-serif text-lg text-[#294a45]">{subject}</p><p className="mt-1 text-xs text-[#7a8c86]">{filename} · {size}</p><p className="mt-2 text-xs text-[#506c65]">{note}</p></div><span className={cn("my-auto rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em]", status === "ready" ? "bg-[#eaf7f0] text-[#24704f]" : "bg-[#f2f2ed] text-[#7d837d]")}>{status === "ready" ? "Pilot ready" : "OCR review"}</span></div>)}</div><div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[#bdcec7] bg-[#f2f7f4] px-5 py-4"><div><p className="text-sm leading-6 text-[#517069]">Import only a question JSON file that has been reviewed and corrected. Raw OCR output is intentionally rejected.</p><p className="mt-1 text-xs text-[#6e827b]">Imported records are saved locally in this browser’s IndexedDB.</p></div><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#087c77] px-4 text-sm font-semibold text-white hover:bg-[#066d69]"><Upload size={15} /> Import reviewed JSON<input type="file" accept="application/json,.json" onChange={onImportBank} className="sr-only" /></label></div><div className="mt-3 flex justify-end"><Button onClick={onPractice} variant="outline" className="border-[#cbdad4] bg-white text-[#31544e] hover:bg-[#eff6f2]">Start pilot <ArrowRight size={16} /></Button></div></div>;
}

function DraftLibraryView({ questionBank, keyedCount, onPractice, onImportBank }: { questionBank: Question[]; keyedCount: number; onPractice: () => void; onImportBank: (event: ChangeEvent<HTMLInputElement>) => void }) {
  const subjectSummaries = availableSubjects.map((subject) => {
    const records = filterStudyBank(questionBank, { mode: "all", subject });
    const topics = topicsFor(records, subject);
    return {
      subject,
      topics,
      total: records.length,
      askable: records.filter(hasAnswerKey).length,
      review: records.filter((question) => question.needsReview || question.ocrStatus === "needs_review").length,
      visuals: records.filter((question) => question.needsImage).length,
    };
  });
  return <div className="max-w-6xl"><section className="rounded-[25px] bg-[#103f3c] p-6 text-white sm:p-8"><div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a6d6cc]">Trusted local catalogue</p><h2 className="mt-3 max-w-2xl font-serif text-[30px] leading-[1.08] tracking-[-0.03em]">Open every source record for private revision. Mocks stay strict.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-[#c4ddd7]">Keyed items can be marked. Records without a detected key are ungraded reading, never scored as misses. Timed Primary mocks still use only complete, blueprint-tagged, non-OCR questions.</p></div><div className="rounded-2xl bg-white/8 p-5"><FileText size={20} className="text-[#7ed2c2]" /><p className="mt-4 font-serif text-2xl">{questionBank.length || ocrDraftReport.questionCount}</p><p className="mt-1 text-xs leading-5 text-[#b8d4cd]">Source records currently loaded for private study.</p><p className="mt-3 text-xs font-semibold text-[#7ed2c2]">{keyedCount} have a detected key and can be scored.</p><div className="mt-4 border-t border-white/12 pt-4"><p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#a6d6cc]">Mock-eligible bank</p><p className="mt-1 font-serif text-2xl text-white">{approvedQuestionsForMock(questionBank).length}</p><p className="mt-1 text-xs text-[#b8d4cd]">Verified, keyed, and blueprint-tagged only.</p></div></div></div></section><section className="mt-7 space-y-4">{subjectSummaries.map(({ subject, topics, total, askable, review, visuals }) => { const meta = subjectMeta[subject]; return <article key={subject} className="overflow-hidden rounded-2xl border border-[#d8e2dc] bg-white shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="flex flex-col gap-4 border-b border-[#e3ebe6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><span className={cn("rounded-lg border px-2 py-1 font-sans text-[10px] font-bold tracking-[0.12em]", meta.tone)}>{meta.code}</span><p className="font-serif text-xl text-[#294a45]">{subject}</p></div><p className="mt-2 text-xs text-[#71847e]">{total} studyable · {askable} keyed · {review} flagged for review · {visuals} may need an image</p></div><span className="rounded-lg border border-[#b7d5c9] bg-[#eef8f3] px-3 py-2 text-[11px] font-bold text-[#087c77]">Open for private review</span>
</div><div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">{topics.map((topic) => <div key={topic.topic} className="rounded-xl border border-[#e0e8e3] bg-[#fbfcfb] p-3"><p className="min-h-10 text-sm font-semibold leading-5 text-[#31544e]">{topic.label}</p><p className="mt-2 text-[11px] text-[#6d817a]">{topic.total} total · {topic.keyed} keyed</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#087c77]">Ready to revise</p>
</div>)}</div></article>; })}</section><section className="mt-6 flex flex-col gap-4 rounded-2xl border border-dashed border-[#bdcec7] bg-[#f2f7f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm leading-6 text-[#517069]">You can already revise the bundled catalogue. Import reviewed JSON only when you have corrected a section against the original page.</p><p className="mt-1 text-xs text-[#6e827b]">Imported records stay on this device and still cannot enter a mock unless they carry blueprint metadata and no OCR flags.</p></div><div className="flex flex-wrap gap-2"><label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-[#087c77] px-4 text-sm font-semibold text-white hover:bg-[#066d69]"><Upload size={15} /> Import reviewed JSON<input type="file" accept="application/json,.json" onChange={onImportBank} className="sr-only" /></label><Button onClick={onPractice} variant="outline" className="border-[#cbdad4] bg-white text-[#31544e] hover:bg-[#eff6f2]">Start keyed revision <ArrowRight size={16} /></Button></div></section></div>;
}

function SettingsView({ onExport, onImport, onReset, hideLearningAidsByDefault, showEmojiCues, cueFirstMode, includeMemoryRecallWithDaily, onToggleLearningAidDefault, onToggleEmojiCues, onToggleCueFirstMode, onToggleIncludeMemoryRecallWithDaily, online, offlineReady, installed, canInstall, iosHint, onInstall }: { onExport: () => void; onImport: (event: ChangeEvent<HTMLInputElement>) => void; onReset: () => void; hideLearningAidsByDefault: boolean; showEmojiCues: boolean; cueFirstMode: boolean; includeMemoryRecallWithDaily: boolean; onToggleLearningAidDefault: () => void; onToggleEmojiCues: () => void; onToggleCueFirstMode: () => void; onToggleIncludeMemoryRecallWithDaily: () => void; online: boolean; offlineReady: boolean; installed: boolean; canInstall: boolean; iosHint: boolean; onInstall: () => void }) {
  return <div className="max-w-4xl"><div><p className="section-kicker">Privacy and portability</p><h2 className="section-title">Local data controls</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b817a]">Progress, recall ratings, and preferences stay in this browser. Export a backup before clearing browser data or moving devices.</p></div><section className="mt-7 rounded-2xl border border-[#c8ded5] bg-[#eff8f4] p-6 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="section-kicker">Standalone app</p><h3 className="mt-1 font-serif text-xl text-[#294a45]">{installed ? "Running as an installed app" : offlineReady ? "Ready to use without internet" : "Load once, then it stays on this device"}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-[#58726a]">{installed ? "Meridian is installed on this device. The question bank and your progress stay local." : iosHint ? "On iPhone or iPad: tap Share, then Add to Home Screen. After that, Meridian opens like an app and works offline." : "Install it, or keep this tab. After the first load, the full bank is cached and you can revise with the network off."}</p><p className="mt-2 text-xs font-semibold text-[#087c77]">{online ? "Network available" : "You are offline"} · {offlineReady ? "App files saved" : "Saving app files..."}</p></div>{canInstall ? <Button onClick={onInstall} className="bg-[#103f3c] text-white hover:bg-[#0b322f]">Install app</Button> : null}</div></section><section className="mt-4 rounded-2xl border border-[#c8ded5] bg-[#eff8f4] p-6 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><PreferenceSwitch active={hideLearningAidsByDefault} onToggle={onToggleLearningAidDefault} kicker="Exam-style practice" title="Start with learning aids hidden" detail="Revision and answer-review sessions conceal notes and mnemonics until you choose Show aids after answering." activeLabel="Hidden by default" inactiveLabel="Shown by default" icon={<BookOpenCheck size={18} />} /></section><section className="mt-4 rounded-2xl border border-[#e3d6b5] bg-[#fffaf0] p-6 shadow-[0_8px_22px_rgba(22,54,49,0.035)]"><div className="flex items-start gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff1ca] text-[#a36d20]"><Brain size={18} /></div><div><p className="section-kicker text-[#a36d20]">High-yield recall</p><h3 className="mt-1 font-serif text-xl text-[#4b4026]">Recall-aid preferences</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#766644]">These controls change cue presentation and daily-recall flow without affecting question answers or mock exams.</p></div></div><div className="mt-5 grid gap-3"><PreferenceSwitch active={showEmojiCues} onToggle={onToggleEmojiCues} kicker="Visual cue" title="Show emoji retrieval cues" detail="Emoji remain optional and always have a readable text cue." activeLabel="Emoji cues on" inactiveLabel="Emoji cues off" compact /><PreferenceSwitch active={cueFirstMode} onToggle={onToggleCueFirstMode} kicker="Retrieval order" title="Start recall with the cue" detail="Prompt yourself first, then deliberately reveal the fact and mnemonic." activeLabel="Cue first" inactiveLabel="Reveal immediately" compact /><PreferenceSwitch active={includeMemoryRecallWithDaily} onToggle={onToggleIncludeMemoryRecallWithDaily} kicker="Daily flow" title="Add recall aids after daily review" detail="After the regular answer-review queue, continue into any due or new recall prompts." activeLabel="Included after daily review" inactiveLabel="Separate recall session" compact /></div></section><div className="mt-4 grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-[#d8e2dc] bg-white p-6 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e7f3ee] text-[#087c77]"><Download size={18} /></div><h3 className="mt-5 font-serif text-xl text-[#294a45]">Export your progress</h3><p className="mt-2 text-sm leading-6 text-[#6d827b]">Download attempts, accuracy, recall-aid ratings, bookmarks, study dates, and recall preferences.</p><Button onClick={onExport} className="mt-5 bg-[#087c77] text-white hover:bg-[#066d69]">Export backup <Download size={15} /></Button></section><section className="rounded-2xl border border-[#d8e2dc] bg-white p-6 shadow-[0_8px_22px_rgba(22,54,49,0.04)]"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4f0] text-[#315b53]"><Upload size={18} /></div><h3 className="mt-5 font-serif text-xl text-[#294a45]">Restore a backup</h3><p className="mt-2 text-sm leading-6 text-[#6d827b]">Choose a Meridian Revision JSON backup. It replaces local progress and restores available recall preferences.</p><label className="mt-5 inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#cbdad4] bg-white px-4 text-sm font-semibold text-[#31544e] hover:bg-[#eff6f2]"><Upload size={15} /> Choose backup<input type="file" accept="application/json,.json" onChange={onImport} className="sr-only" /></label></section></div><section className="mt-4 flex flex-col gap-4 rounded-2xl border border-[#efd1c7] bg-[#fff8f5] p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a24b34]">Reset local study data</p><p className="mt-1 text-sm leading-6 text-[#764e43]">Delete attempts, recall ratings, bookmarks, and study dates from this browser.</p></div><Button onClick={onReset} variant="outline" className="border-[#dfa88f] bg-white text-[#a54832] hover:bg-[#fff0eb]"><RefreshCcw size={15} /> Reset progress</Button></section></div>;
}

function PreferenceSwitch({ active, onToggle, kicker, title, detail, activeLabel, inactiveLabel, icon, compact = false }: { active: boolean; onToggle: () => void; kicker: string; title: string; detail: string; activeLabel: string; inactiveLabel: string; icon?: React.ReactNode; compact?: boolean }) {
  return <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", compact && "rounded-xl border border-[#eadfc8] bg-white/55 p-4")}><div className="flex items-start gap-3">{icon && <span className="mt-0.5 text-[#087c77]">{icon}</span>}<div><p className="section-kicker">{kicker}</p><h3 className={cn("mt-1 font-serif text-xl text-[#294a45]", compact && "text-[18px]")}>{title}</h3><p className="mt-1 max-w-xl text-sm leading-6 text-[#58726a]">{detail}</p></div></div><button type="button" role="switch" aria-checked={active} onClick={onToggle} className={cn("inline-flex shrink-0 items-center gap-3 rounded-xl border px-3 py-2 text-left transition", active ? "border-[#78bca4] bg-white text-[#087c77]" : "border-[#c8d8d1] bg-[#f9fcfa] text-[#536e66]")}><span className={cn("relative block h-6 w-11 rounded-full transition", active ? "bg-[#087c77]" : "bg-[#aebfb8]")}><span className={cn("absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition", active ? "left-6" : "left-1")} /></span><span className="text-xs font-bold">{active ? activeLabel : inactiveLabel}</span></button></div>;
}

function MetricCard({ recordNo, label, value, detail, trace, icon: Icon, tone }: { recordNo: string; label: string; value: string; detail: string; trace: string; icon: typeof Target; tone: "teal" | "ink" | "clay" | "sage" }) {
  const tones = { teal: "border-[#087c77] text-[#087c77]", ink: "border-[#31534e] text-[#31534e]", clay: "border-[#a8553d] text-[#a8553d]", sage: "border-[#63715c] text-[#63715c]" };
  const rules = { teal: "border-l-[#087c77]", ink: "border-l-[#31534e]", clay: "border-l-[#a8553d]", sage: "border-l-[#63715c]" };
  return <article className={cn("relative overflow-hidden rounded-sm border border-[#d9e2dd] border-l-[4px] bg-[#fcfdfb] p-4 shadow-[0_6px_16px_rgba(22,54,49,0.03)]", rules[tone])}><div className="absolute inset-0 clinical-rules opacity-40" aria-hidden="true" /><div className="relative"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#607971]">{label}</p><p className="mt-2 font-sans text-[30px] font-semibold leading-none tracking-[-0.045em] text-[#294a45]">{value}</p></div><div className="flex flex-col items-end gap-1"><span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[#6d817a]">REC {recordNo}</span><span className={cn("text-[9px]", tones[tone])}><Icon size={13} aria-hidden="true" /></span></div></div><p className="mt-3 border-y border-[#dbe5e0] py-2 text-[11px] leading-4 text-[#627972]">{detail}</p><div className="mt-2 flex items-center justify-between text-[8px] font-bold uppercase tracking-[0.13em] text-[#73867f]"><span>Record trace</span><span className={cn("font-mono", tones[tone])}>{trace}</span></div></div></article>;
}

function StudyCue({ icon: Icon, label, text }: { icon: typeof CheckCircle2; label: string; text: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 text-[#31534e]"><Icon size={16} /></span><div><p className="text-xs font-bold text-[#365650]">{label}</p><p className="mt-0.5 text-[11px] leading-4 text-[#788b84]">{text}</p></div></div>;
}

function CommandMetric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="border-l-2 border-[#9ab6ad] pl-3"><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#668079]">{label}</p><p className="mt-1 font-sans text-[21px] font-semibold leading-none text-[#294d47]">{value}</p><p className="mt-1 text-[11px] leading-4 text-[#668079]">{note}</p></div>;
}

function Toast({ notice, onClose }: { notice: string; onClose: () => void }) {
  useEffect(() => { const timeout = window.setTimeout(onClose, 4200); return () => window.clearTimeout(timeout); }, [onClose]);
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-xl bg-[#103f3c] px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 size={17} className="shrink-0 text-[#86d8c9]" /><span>{notice}</span><button onClick={onClose} aria-label="Close notification" className="ml-1 text-[#b7d8d1] hover:text-white"><X size={16} /></button></div>;
}

function totalLabel(value: number) { return value ? `${value}%` : "—"; }
