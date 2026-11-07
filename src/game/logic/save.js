import { FRUIT_IDS } from '../data/fruits.js';
import { newGame } from './economy.js';

const KEY = 'little-orchard-save-v1';
const safeCount = (n) => Number.isSafeInteger(n) && n >= 0 && n <= 1_000_000;
const safePoint = (point) => point && Number.isFinite(point.x) && Number.isFinite(point.y) && point.x >= 0 && point.x <= 384 && point.y >= 0 && point.y <= 216;

export function isValidSave(value) {
  return !!(value && value.schemaVersion === 1 && safeCount(value.coins)
    && FRUIT_IDS.every((id) => safeCount(value.inventory?.[id]) && safeCount(value.shelf?.[id]))
    && Array.isArray(value.trees) && value.trees.length >= 3 && value.trees.length <= 100
    && value.trees.every((t) => typeof t.id === 'string' && FRUIT_IDS.includes(t.fruit) && Number.isFinite(t.nextReadyAt) && t.nextReadyAt >= 0)
    && ['orchard', 'market'].includes(value.location)
    && safePoint(value.positions?.orchard) && safePoint(value.positions?.market));
}

export function loadGame(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return newGame();
    const parsed = JSON.parse(raw);
    if (isValidSave(parsed)) return parsed;
    console.warn('저장 데이터 형식이 맞지 않습니다. 기존 데이터는 삭제하지 않습니다.');
  } catch (error) { console.warn('게임 저장을 읽지 못했습니다. 기존 데이터는 유지됩니다.', error); }
  return newGame();
}
export function saveGame(state, storage = globalThis.localStorage) {
  try {
    if (!isValidSave(state)) return false;
    storage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch (error) { console.warn('게임 저장 실패', error); return false; }
}
export function resetGame(storage = globalThis.localStorage) {
  try { storage.removeItem(KEY); return true; } catch { return false; }
}
