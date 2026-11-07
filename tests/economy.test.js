import test from 'node:test';
import assert from 'node:assert/strict';
import { FRUITS } from '../src/game/data/fruits.js';
import { newGame, isReady, harvestTree, stockShelf, sellOne } from '../src/game/logic/economy.js';
import { isValidSave, saveGame, loadGame } from '../src/game/logic/save.js';

test('과일 3종의 초기 상태 및 세이브 구조', () => {
  const state = newGame();
  assert.equal(state.trees.length, 3);
  assert.deepEqual(Object.keys(state.inventory), ['apple', 'pear', 'persimmon']);
  assert.equal(isValidSave(state), true);
});

test('사과 수확 직후 중복 수확 불가, 이후 재성장', () => {
  const state = newGame();
  const now = 1_000_000;
  assert.equal(harvestTree(state, 'tree-apple-1', now).ok, true);
  assert.equal(state.inventory.apple, 1);
  assert.equal(harvestTree(state, 'tree-apple-1', now).ok, false);
  assert.equal(isReady(state.trees[0], now + FRUITS.apple.regrowMs), true);
});

test('사과 진열 및 판매 시 재고와 코인이 일치', () => {
  const state = newGame();
  harvestTree(state, 'tree-apple-1', 1000);
  assert.equal(stockShelf(state, 'apple').ok, true);
  assert.equal(state.inventory.apple, 0);
  assert.equal(state.shelf.apple, 1);
  assert.equal(sellOne(state).price, 6);
  assert.equal(state.coins, 6);
  assert.equal(sellOne(state).ok, false);
});

test('게임 저장/복구와 비정상 저장 데이터 방어', () => {
  const data = new Map();
  const store = { getItem: (k) => data.get(k) ?? null, setItem: (k,v) => data.set(k,v), removeItem: (k) => data.delete(k) };
  const state = newGame();
  state.coins = 14;
  assert.equal(saveGame(state, store), true);
  assert.equal(loadGame(store).coins, 14);
  data.set('little-orchard-save-v1', '{bad');
  assert.equal(loadGame(store).coins, 0);
  assert.equal(data.get('little-orchard-save-v1'), '{bad');
});
