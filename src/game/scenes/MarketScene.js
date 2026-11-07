import { BaseWorldScene } from './BaseWorldScene.js';
import { FRUIT_IDS, FRUITS } from '../data/fruits.js';
import { stockShelf, sellOne } from '../logic/economy.js';

const SHELVES = [ { x: 88, y: 106 }, { x: 178, y: 106 }, { x: 268, y: 106 } ];

export class MarketScene extends BaseWorldScene {
  constructor() { super('Market', 'market'); this.customerBusy = false; }
  create() {
    this.drawGround(0xd4b58f);
    this.add.text(14, 12, '작은 청과점', { fontSize: '18px', color: '#55402f' });
    this.add.text(306, 165, '← 과수원', { fontSize: '12px', color: '#5b4a39' });
    this.shelfLabels = FRUIT_IDS.map((fruit, i) => {
      const pos = SHELVES[i];
      this.add.rectangle(pos.x, pos.y, 68, 28, 0x8b6040).setStrokeStyle(3, 0x61432b);
      this.add.text(pos.x, pos.y - 27, FRUITS[fruit].name, { fontSize: '13px', color: '#543f2e' }).setOrigin(0.5);
      return this.add.text(pos.x, pos.y, '', { fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);
    });
    this.customerBusy = false;
    this.makeWorld(0xd4b58f);
    this.refreshShelves();
    this.time.addEvent({ delay: 7000, loop: true, callback: () => this.visitCustomer() });
  }
  refreshShelves() {
    FRUIT_IDS.forEach((fruit, i) => this.shelfLabels[i].setText(`${this.state.shelf[fruit]}개`));
  }
  act() {
    if (this.near(337, 178, 50)) { this.switchTo('Orchard', 'orchard'); return; }
    const i = SHELVES.findIndex((pos) => this.near(pos.x, pos.y + 28, 52));
    if (i === -1) { this.persist('진열대에 다가가 과일을 올려 보세요.'); return; }
    const fruit = FRUIT_IDS[i];
    const result = stockShelf(this.state, fruit);
    this.refreshShelves();
    this.persist(result.ok ? `${FRUITS[fruit].name}을 진열대에 올렸어요.` : `${FRUITS[fruit].name}: ${result.reason}`);
  }
  visitCustomer() {
    if (this.customerBusy) return;
    this.customerBusy = true;
    const guest = this.add.image(350, 75, 'customer').setScale(2).setDepth(8);
    this.tweens.add({ targets: guest, x: 194, y: 126, duration: 1700, onComplete: () => {
      const result = sellOne(this.state);
      this.refreshShelves();
      this.persist(result.ok ? `손님이 ${FRUITS[result.fruit].name}을 샀어요! +${result.price}코인` : '손님이 왔지만 진열대가 비어 있어요.');
      this.time.delayedCall(700, () => this.tweens.add({ targets: guest, x: 350, y: 75, duration: 1500, onComplete: () => { guest.destroy(); this.customerBusy = false; } }));
    } });
  }
}
