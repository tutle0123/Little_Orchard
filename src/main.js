import Phaser from 'phaser';
import './style.css';
import { BootScene } from './game/scenes/BootScene.js';
import { OrchardScene } from './game/scenes/OrchardScene.js';
import { MarketScene } from './game/scenes/MarketScene.js';
import { bindControls } from './ui/controls.js';
import { resetGame } from './game/logic/save.js';

bindControls();

document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('이 기기의 저장 데이터를 초기화할까요? 되돌릴 수 없습니다.')) return;
  if (resetGame()) window.location.reload();
  else window.alert('저장 데이터를 초기화하지 못했습니다.');
});

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 384,
  height: 216,
  backgroundColor: '#6ab375',
  pixelArt: true,
  roundPixels: true,
  render: { antialias: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 384, height: 216 },
  scene: [BootScene, OrchardScene, MarketScene],
});

// 개발 콘솔에서 필요할 때만 상태 점검용
if (import.meta.env.DEV) window.__orchardGame = game;
