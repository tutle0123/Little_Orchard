import { FRUITS, FRUIT_IDS } from '../data/fruits.js';

export function newGame() {
  return {
    schemaVersion: 1,
    coins: 0,
    inventory: { apple: 0, pear: 0, persimmon: 0 },
    shelf: { apple: 0, pear: 0, persimmon: 0 },
    trees: FRUIT_IDS.map((fruit) => ({ id: `tree-${fruit}-1`, fruit, nextReadyAt: 0 })),
    location: 'orchard',
    positions: { orchard: { x: 180, y: 165 }, market: { x: 180, y: 164 } },
  };
}

export function isReady(tree, now = Date.now()) { return Number.isFinite(tree.nextReadyAt) && now >= tree.nextReadyAt; }

export function harvestTree(state, treeId, now = Date.now()) {
  const tree = state.trees.find((item) => item.id === treeId);
  if (!tree || !FRUITS[tree.fruit] || !isReady(tree, now)) return { ok: false, reason: '아직 열매가 없어요.' };
  tree.nextReadyAt = now + FRUITS[tree.fruit].regrowMs;
  state.inventory[tree.fruit] += 1;
  return { ok: true, fruit: tree.fruit, count: 1 };
}

export function stockShelf(state, fruitId) {
  if (!FRUITS[fruitId] || (state.inventory[fruitId] ?? 0) < 1) return { ok: false, reason: '진열할 과일이 없어요.' };
  state.inventory[fruitId] -= 1;
  state.shelf[fruitId] += 1;
  return { ok: true, fruit: fruitId };
}

export function sellOne(state) {
  const fruitId = FRUIT_IDS.find((id) => state.shelf[id] > 0);
  if (!fruitId) return { ok: false, reason: '진열대에 과일이 없어요.' };
  state.shelf[fruitId] -= 1;
  state.coins += FRUITS[fruitId].price;
  return { ok: true, fruit: fruitId, price: FRUITS[fruitId].price };
}
