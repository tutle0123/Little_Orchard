import { FRUIT_IDS, FRUITS } from '../game/data/fruits.js';

export const controls = { up: false, down: false, left: false, right: false };
let actionHandler = () => {};
let hudMessage = '가까이 다가간 뒤 E키나 상호작용 버튼을 눌러보세요.';

export function bindControls() {
  document.querySelectorAll('[data-move]').forEach((button) => {
    const key = button.dataset.move;
    const down = (event) => { event.preventDefault(); controls[key] = true; button.setPointerCapture?.(event.pointerId); };
    const up = (event) => { event.preventDefault(); controls[key] = false; };
    button.addEventListener('pointerdown', down);
    button.addEventListener('pointerup', up);
    button.addEventListener('pointercancel', up);
    button.addEventListener('lostpointercapture', () => { controls[key] = false; });
  });
  document.getElementById('action').addEventListener('click', () => actionHandler());
  window.addEventListener('blur', () => { for (const key of Object.keys(controls)) controls[key] = false; });
}
export function setActionHandler(fn) { actionHandler = fn; }
export function setMessage(message) { hudMessage = message; document.getElementById('message').textContent = message; }
export function renderHud(state) {
  document.getElementById('location').textContent = state.location === 'orchard' ? '🌳 과수원' : '🏡 청과점';
  document.getElementById('coins').textContent = `${state.coins} 코인`;
  document.getElementById('inventory').textContent = `가방: ${FRUIT_IDS.map((id) => `${FRUITS[id].name} ${state.inventory[id]}`).join(' / ')}  ·  진열: ${FRUIT_IDS.map((id) => `${FRUITS[id].name} ${state.shelf[id]}`).join(' / ')}`;
  document.getElementById('message').textContent = hudMessage;
}
