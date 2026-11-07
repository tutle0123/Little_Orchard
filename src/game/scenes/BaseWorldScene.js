import Phaser from 'phaser';
import { controls, setActionHandler, renderHud, setMessage } from '../../ui/controls.js';
import { saveGame } from '../logic/save.js';

export class BaseWorldScene extends Phaser.Scene {
  constructor(key, location) { super(key); this.location = location; }
  makeWorld(backgroundColor) {
    this.cameras.main.setBackgroundColor(backgroundColor);
    this.state = this.registry.get('state');
    this.state.location = this.location;
    const pos = this.state.positions[this.location];
    this.player = this.add.sprite(pos.x, pos.y, 'player').setScale(2).setDepth(10);
    this.keys = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E');
    const act = () => this.act();
    setActionHandler(act);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => setActionHandler(() => {}));
    renderHud(this.state);
  }
  drawGround(color = 0x6ab375) {
    const g = this.add.graphics();
    g.fillStyle(color); g.fillRect(0, 0, 384, 216);
    g.fillStyle(0x83c486);
    for (let x = 8; x < 384; x += 40) for (let y = 6; y < 216; y += 34) g.fillRect(x + (y % 3), y, 3, 2);
    g.fillStyle(0xb3a27b); g.fillRect(0, 179, 384, 28);
    g.lineStyle(2, 0x9d815b); g.strokeRect(1, 1, 382, 214);
  }
  update(_time, delta) {
    let dx = Number(this.keys.D.isDown || this.keys.RIGHT.isDown || controls.right) - Number(this.keys.A.isDown || this.keys.LEFT.isDown || controls.left);
    let dy = Number(this.keys.S.isDown || this.keys.DOWN.isDown || controls.down) - Number(this.keys.W.isDown || this.keys.UP.isDown || controls.up);
    const length = Math.hypot(dx, dy) || 1;
    this.player.x = Phaser.Math.Clamp(this.player.x + (dx / length) * delta * 0.105, 15, 369);
    this.player.y = Phaser.Math.Clamp(this.player.y + (dy / length) * delta * 0.105, 40, 194);
    if (Phaser.Input.Keyboard.JustDown(this.keys.E)) this.act();
    this.state.positions[this.location] = { x: Math.round(this.player.x), y: Math.round(this.player.y) };
    this.saveElapsed = (this.saveElapsed ?? 0) + delta;
    if (this.saveElapsed >= 5000) { this.saveElapsed = 0; saveGame(this.state); }
  }
  near(x, y, distance = 36) { return Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y) <= distance; }
  switchTo(sceneKey, nextLocation) {
    this.state.location = nextLocation;
    saveGame(this.state);
    setMessage(`이동했습니다. ${nextLocation === 'market' ? '진열대' : '나무'} 가까이에서 상호작용해 보세요.`);
    this.scene.start(sceneKey);
  }
  persist(message) { saveGame(this.state); renderHud(this.state); setMessage(message); }
}
