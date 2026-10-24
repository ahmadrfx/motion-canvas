import {Renderer} from '@motion-canvas/core';
import project from './src/project.ts?project';

const p = await project;
p.logger.onLogged.subscribe(log => {
  const {level, message, stack} = log;
  const fn = level === 'error' ? console.error : console.log;
  fn(`[scene:${level}]`, message, stack ?? '');
});
await document.fonts.ready;
await document.fonts.load('800 160px "Poppins"');
await document.fonts.load('800 150px "Poppins"');
await document.fonts.load('400 165px "Great Vibes"');

const renderer = new Renderer(p);
const settings = p.meta.getFullRenderingSettings();
const canvas = renderer.stage.finalBuffer;
canvas.id = 'verify-canvas';
document.body.appendChild(canvas);

const preview = document.createElement('canvas');
preview.id = 'verify-preview';
preview.width = 540;
preview.height = 960;
document.body.appendChild(preview);

window.__renderFrame = async (time: number) => {
  await renderer.renderFrame(settings, time);
  preview.getContext('2d')!.drawImage(canvas, 0, 0, 540, 960);
};

/** Bg color (corner pixel) + per-row max luminance at given preview rows. */
window.__probe = (rows: number[]) => {
  const ctx = preview.getContext('2d')!;
  const {data, width} = ctx.getImageData(0, 0, 540, 960);
  const at = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const rowMax = (y: number) => {
    let max = 0;
    let maxX = 0;
    let min = 255;
    let minX = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const lum =
        0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum > max) {
        max = lum;
        maxX = x;
      }
      if (lum < min) {
        min = lum;
        minX = x;
      }
    }
    return [Math.round(max), maxX, Math.round(min), minX];
  };
  return {
    corner: at(3, 3),
    rows: rows.map(rowMax),
  };
};

window.__ready = true;
