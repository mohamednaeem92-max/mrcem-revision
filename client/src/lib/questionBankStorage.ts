/** Clinical Field Notes: preserve reviewed source questions locally without routing them through any server. */
import type { Question } from "./questionBank";

const DB_NAME = "meridian-revision";
const STORE_NAME = "question-bank";
const RECORD_KEY = "reviewed-questions";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadReviewedQuestions(): Promise<Question[] | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(RECORD_KEY);
    request.onsuccess = () => resolve((request.result as Question[] | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveReviewedQuestions(questions: Question[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(questions, RECORD_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}
