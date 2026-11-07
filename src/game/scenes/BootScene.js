import Phaser from 'phaser';
import { loadGame } from '../logic/save.js';
import { makeSprites } from '../art/makeSprites.js';
import { renderHud, setMessage } from '../../ui/controls.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() {
    makeSprites(this);
    const state = loadGame();
    this.registry.set('state', state);
    setMessage('나무나 진열대 근처에서 E키(모바일은 버튼)를 눌러보세요.');
    renderHud(state);
    this.scene.start(state.location === 'market' ? 'Market' : 'Orchard');
  }
}
