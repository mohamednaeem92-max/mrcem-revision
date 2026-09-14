/**
 * Clinical Field Notes style: calm, source-aware study content with one clear active learning action.
 * The pilot questions below were manually verified against the user's EBM source pages after OCR.
 */
import type { PrimaryBlueprintCategory } from "./primaryBlueprint";

export type MemoryAid = {
  coreFact: string;
  mnemonic: string;
  emojiCues: string[];
  cueLabel: string;
  sourceLabel: string;
  sourceUrl: string;
};

export type Question = {
  id: string;
  source: string;
  sourcePage: number;
  subject: string;
  topic: string;
  stem: string;
  options: string[];
  correctOption: number | null;
  explanation: string;
  learningNote: string;
  highYieldNote?: string;
  mnemonic?: string;
  memoryAid?: MemoryAid;
  primaryBlueprintCategory?: PrimaryBlueprintCategory;
  primaryBlueprintSubcategory?: string;
  tags: string[];
  needsReview?: boolean;
  isOcrDraft?: boolean;
  ocrStatus?: "ocr_draft" | "needs_review" | "needs_image";
  ocrWarnings?: string[];
  needsImage?: boolean;
  sourceMarkdown?: string;
  sourceLink?: string | null;
};

export const pilotQuestions: Question[] = [
  {
    id: "ebm-statistics-001",
    source: "EBM-All.pdf",
    sourcePage: 1,
    subject: "Evidence-based medicine",
    topic: "Statistics",
    stem: "Regarding the mean, which of the following statements is INCORRECT?",
    options: [
      "The mean is calculated by summing all of the values of a data set and dividing this by the number of observations in the data set.",
      "The mean is typically used to compare outcomes in normally distributed data.",
      "The mean is not affected by outliers.",
      "The mean is calculated using all of the data values.",
      "In a normal distribution the mean is equal to the median.",
    ],
    correctOption: 2,
    explanation:
      "The mean is the arithmetic average. It uses every value in the data set, so outlying values and skewed distributions can distort it. In a normal distribution, the mean and median are equal.",
    learningNote:
      "For skewed data or data with important outliers, the median usually gives a more representative measure of central tendency.",
    highYieldNote: "The mean is pulled by extreme values. In skewed data or when outliers matter, compare the median before interpreting the centre.",
    mnemonic: "📈 Mean moves with the extremes; ⚖️ median stays in the middle.",
    memoryAid: {
      coreFact: "The mean is pulled by extreme values, whereas the median is unchanged by them.",
      mnemonic: "Mean moves with the extremes; median stays in the middle.",
      emojiCues: ["📈", "⚖️"],
      cueLabel: "A rising chart and balance scales cue mean versus median.",
      sourceLabel: "BMJ Statistics at Square One: Mean and standard deviation",
      sourceUrl: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/2-mean-and-standard-deviation",
    },
    primaryBlueprintCategory: "Evidence-based medicine",
    primaryBlueprintSubcategory: "Statistics",
    tags: ["mean", "median", "outliers", "central tendency"],
  },
  {
    id: "ebm-statistics-002",
    source: "EBM-All.pdf",
    sourcePage: 3,
    subject: "Evidence-based medicine",
    topic: "Statistics",
    stem: "What is the median of the following data set: 3, 13, 7, 5, 21, 24, 23, 40, 25, 21, 12, 56, 26, 29, 39?",
    options: ["20", "21", "22", "23", "25"],
    correctOption: 3,
    explanation:
      "Order the fifteen observations: 3, 5, 7, 12, 13, 21, 21, 23, 24, 25, 26, 29, 39, 40, 56. With an odd number of observations, the median is the middle value, which is the eighth observation: 23.",
    learningNote:
      "For an odd sample size n, the median position is (n + 1) / 2 after ordering the values.",
    highYieldNote: "For an odd-sized sample, order every value first, then take position (n + 1) / 2. Do not select the middle value from the unsorted list.",
    mnemonic: "🔢 Order first, then (n + 1) / 2.",
    memoryAid: {
      coreFact: "For an odd-sized sample, order the values and take position (n + 1) / 2.",
      mnemonic: "Order first, then (n + 1) / 2.",
      emojiCues: ["🔢", "↕️", "🎯"],
      cueLabel: "Numbers, ordering arrows, and a target cue the median method.",
      sourceLabel: "BMJ Statistics at Square One: Data display and summary",
      sourceUrl: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary",
    },
    primaryBlueprintCategory: "Evidence-based medicine",
    primaryBlueprintSubcategory: "Statistics",
    tags: ["median", "central tendency", "ordering data"],
  },
  {
    id: "ebm-statistics-003",
    source: "EBM-All.pdf",
    sourcePage: 4,
    subject: "Evidence-based medicine",
    topic: "Statistics",
    stem: "What is the median of the following data set: 13, 18, 13, 14, 13, 16, 14, 21, 13?",
    options: ["13", "14", "15", "16", "17"],
    correctOption: 1,
    explanation:
      "Order the values: 13, 13, 13, 13, 14, 14, 16, 18, 21. The sample size is nine, so the middle value is the fifth observation, which is 14.",
    learningNote:
      "The median is resistant to extreme values because it depends on position rather than the numerical distance of every observation from the centre.",
    highYieldNote: "Median uses rank, not the size of every deviation. It remains useful when a small number of observations are very high or low.",
    mnemonic: "🎯 Median = middle, not magnitude.",
    memoryAid: {
      coreFact: "The median depends on rank and is resistant to extreme values.",
      mnemonic: "Median = middle, not magnitude.",
      emojiCues: ["🎯", "↕️"],
      cueLabel: "A target and ordering arrows cue the ranked middle value.",
      sourceLabel: "BMJ Statistics at Square One: Data display and summary",
      sourceUrl: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/1-data-display-and-summary",
    },
    primaryBlueprintCategory: "Evidence-based medicine",
    primaryBlueprintSubcategory: "Statistics",
    tags: ["median", "central tendency", "ordering data"],
  },
  {
    id: "ebm-statistics-004",
    source: "EBM-All.pdf",
    sourcePage: 5,
    subject: "Evidence-based medicine",
    topic: "Statistics",
    stem: "Regarding correlation, which of the following statements is CORRECT?",
    options: [
      "The Pearson correlation coefficient is used for non-normally distributed data.",
      "Positive correlation indicates a cause and effect relationship.",
      "The correlation coefficient is normally denoted by alpha.",
      "A positive correlation coefficient means that there is strong correlation between two variables.",
      "The closer that the correlation coefficient r is to 1, the closer the points are to a straight line.",
    ],
    correctOption: 4,
    explanation:
      "The correlation coefficient r describes the strength and direction of a linear association. Values closer to +1 or -1 indicate a stronger linear relationship. Correlation does not establish causation. Pearson correlation is generally used for normally distributed data; Spearman rank correlation is the non-parametric alternative.",
    learningNote:
      "Interpret correlation by both direction and magnitude. A value near zero indicates a weak linear association, not necessarily the absence of every possible relationship.",
    highYieldNote: "Interpret r by absolute magnitude and direction. A strong correlation describes a line-like association; it does not prove causation.",
    mnemonic: "📏 r rides the line, not the cause. 🚫",
    memoryAid: {
      coreFact: "Correlation describes the strength and direction of a linear association; it does not establish causation.",
      mnemonic: "r rides the line, not the cause.",
      emojiCues: ["📏", "↗️", "🚫"],
      cueLabel: "A ruler, rising line, and stop sign cue association without causation.",
      sourceLabel: "BMJ Statistics at Square One: Correlation and regression",
      sourceUrl: "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one/11-correlation-and-regression",
    },
    primaryBlueprintCategory: "Evidence-based medicine",
    primaryBlueprintSubcategory: "Statistics",
    tags: ["correlation", "Pearson", "Spearman", "causation"],
  },
];

export const availableSubjects = [
  "Evidence-based medicine",
  "Anatomy",
  "Physiology",
  "Pathology",
  "Microbiology",
  "Pharmacology",
];
