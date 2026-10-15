const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

const figma1x = PNG.sync.read(fs.readFileSync('figma_1x.png'));
const screenshot = PNG.sync.read(fs.readFileSync('screenshot.png'));

const width = Math.min(figma1x.width, screenshot.width);
const height = Math.min(figma1x.height, screenshot.height);

const img1 = new PNG({ width, height });
const img2 = new PNG({ width, height });
const diff = new PNG({ width, height });

PNG.bitblt(figma1x, img1, 0, 0, width, height, 0, 0);
PNG.bitblt(screenshot, img2, 0, 0, width, height, 0, 0);

const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.2,
    includeAA: false
});

fs.writeFileSync('diff.png', PNG.sync.write(diff));
const totalPixels = width * height;
const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);
console.log(`Mismatched pixels (threshold 0.2): ${numDiffPixels} / ${totalPixels} (${diffPercent}%)`);
