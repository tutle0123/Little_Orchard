// 임시 픽셀 격자 스프라이트. 정식 게임 에셋이 아닙니다.
// 각 픽셀을 정수 좌표의 작은 사각형으로 찍어 흐림 없이 확대합니다.
import { FRUITS } from '../data/fruits.js';

function drawPixelArt(scene, key, width, height, draw) {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);
  const rect = (x, y, w, h, color) => { g.fillStyle(color); g.fillRect(x, y, w, h); };
  draw(rect);
  g.generateTexture(key, width, height);
  g.destroy();
}

export function makeSprites(scene) {
  if (scene.textures.exists('player')) return;
  drawPixelArt(scene, 'player', 14, 19, (p) => {
    p(3, 0, 8, 3, 0x573e2d); p(2, 3, 10, 8, 0xf6ceaa);
    p(4, 6, 2, 2, 0x372b24); p(9, 6, 2, 2, 0x372b24);
    p(3, 11, 9, 5, 0x416dba); p(1, 12, 2, 4, 0xf6ceaa); p(12, 12, 2, 4, 0xf6ceaa);
    p(3, 16, 3, 3, 0x544534); p(9, 16, 3, 3, 0x544534);
  });
  drawPixelArt(scene, 'customer', 14, 19, (p) => {
    p(3, 0, 8, 4, 0x765842); p(2, 4, 10, 7, 0xffd5ac);
    p(4, 7, 2, 1, 0x483a34); p(9, 7, 2, 1, 0x483a34);
    p(3, 11, 9, 5, 0x9b63a4); p(3, 16, 3, 3, 0x4d4637); p(9, 16, 3, 3, 0x4d4637);
  });
  for (const [id, fruit] of Object.entries(FRUITS)) {
    drawPixelArt(scene, `tree-${id}`, 32, 38, (p) => {
      p(13, 19, 6, 19, 0x806141); p(11, 26, 10, 4, 0x735139);
      p(7, 10, 20, 16, 0x397c46); p(3, 14, 26, 9, 0x448b4c);
      p(10, 5, 12, 8, 0x58a35a); p(7, 11, 18, 6, 0x58a35a);
    });
    drawPixelArt(scene, `tree-${id}-ready`, 32, 38, (p) => {
      p(13, 19, 6, 19, 0x806141); p(11, 26, 10, 4, 0x735139);
      p(7, 10, 20, 16, 0x397c46); p(3, 14, 26, 9, 0x448b4c);
      p(10, 5, 12, 8, 0x58a35a); p(7, 11, 18, 6, 0x58a35a);
      p(7, 15, 5, 5, fruit.color); p(19, 13, 5, 5, fruit.color); p(14, 22, 5, 5, fruit.color);
    });
  }
}
