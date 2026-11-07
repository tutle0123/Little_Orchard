// 모든 가격·성장 시간·표기명은 이 파일을 기준으로 관리합니다.
export const FRUITS = Object.freeze({
  apple: Object.freeze({ id: 'apple', name: '사과', price: 6, regrowMs: 30_000, color: 0xe35b51 }),
  pear: Object.freeze({ id: 'pear', name: '배', price: 8, regrowMs: 40_000, color: 0xe0cf64 }),
  persimmon: Object.freeze({ id: 'persimmon', name: '감', price: 10, regrowMs: 50_000, color: 0xe58a37 }),
});
export const FRUIT_IDS = Object.freeze(Object.keys(FRUITS));
