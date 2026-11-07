import { BaseWorldScene } from './BaseWorldScene.js';
import { FRUITS } from '../data/fruits.js';
import { harvestTree, isReady } from '../logic/economy.js';

const POSITIONS = [ { x: 86, y: 112 }, { x: 188, y: 112 }, { x: 288, y: 112 } ];

export class OrchardScene extends BaseWorldScene {
  constructor() { super('Orchard', 'orchard'); }
  create() {
    this.drawGround();
    this.add.text(14, 12, '작은 과수원', { fontFamily: 'sans-serif', fontSize: '18px', color: '#173d20' });
    this.add.text(312, 160, '청과점 →', { fontSize: '12px', color: '#2e4e2b' });
    this.trees = this.registry.get('state').trees.slice(0, 3).map((tree, i) => {
      const pos = POSITIONS[i];
      const sprite = this.add.image(pos.x, pos.y, `tree-${tree.fruit}-ready`).setScale(2);
      this.add.text(pos.x, pos.y + 43, FRUITS[tree.fruit].name, { fontSize: '12px', color: '#224527' }).setOrigin(0.5);
      return { data: tree, x: pos.x, y: pos.y, sprite };
    });
    this.makeWorld(0x6ab375);
    this.time.addEvent({ delay: 500, loop: true, callback: () => this.updateTrees() });
    this.updateTrees();
  }
  updateTrees() {
    for (const tree of this.trees) tree.sprite.setTexture(`tree-${tree.data.fruit}${isReady(tree.data) ? '-ready' : ''}`);
  }
  act() {
    if (this.near(339, 174, 48)) { this.switchTo('Market', 'market'); return; }
    const closest = this.trees.filter((tree) => this.near(tree.x, tree.y + 24, 58)).sort((a, b) => Math.hypot(this.player.x - a.x, this.player.y - (a.y + 24)) - Math.hypot(this.player.x - b.x, this.player.y - (b.y + 24)))[0];
    if (!closest) { this.persist('나무 아래나 청과점 입구에 가까이 가보세요.'); return; }
    const result = harvestTree(this.state, closest.data.id);
    this.updateTrees();
    this.persist(result.ok ? `${FRUITS[result.fruit].name} +1! 청과점에 가져가 보세요.` : result.reason);
  }
}
