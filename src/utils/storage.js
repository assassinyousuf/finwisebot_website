// Lightweight localStorage helpers for storing the project structure
const STORAGE_KEY = 'finwisebot_structure_v1';

function isClient() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function saveStructure(obj) {
  if (!isClient()) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    return true;
  } catch (err) {
    // swallow quota or serialization errors
    return false;
  }
}

function loadStructure() {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function clearStructure() {
  if (!isClient()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    // ignore
  }
}

export { saveStructure, loadStructure, clearStructure, STORAGE_KEY };
