// Credit for radial gradients: https://github.com/twerske/houdini-worklets/blob/main/src/glow-lights/worklet.js

const WORKLET = "cosmic-starfield";

// source: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
// via: https://css-tricks.com/conjuring-generative-blobs-with-the-css-paint-api/
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(x, target, amt) {
  return (target - x) * amt;
}

class CosmicStarfield {
  static get inputProperties() {
    return [
      `--${WORKLET}-stars`,
      `--${WORKLET}-clouds`,
      `--${WORKLET}-gradient-colors`,
    ];
  }

  paint(ctx, size, properties) {
    // Element properties
    const elWidth = size.width;
    const elHeight = size.height;

    // Default gradient stops
    const stop1 = "#090613";
    const stop2 = "#471f60";
    const stop3 = "#231b6e";
    const defaultGradient = [stop1, stop2, stop3];

    // Customizations
    const stars = parseInt(properties.get(`--${WORKLET}-stars`), 10) || 4280;

    const cosmicCloudsPos =
      String(properties.get(`--${WORKLET}-clouds`)) || false;

    const userColors =
      String(properties.get(`--${WORKLET}-gradient-colors`)) || false;

    const gradientColors = userColors
      ? userColors.split(",").map((color) => color.trim())
      : defaultGradient;

    // Paint!
    const random = mulberry32(stars);

    var grd = ctx.createLinearGradient(0, 0, 0, elHeight);
    let pos = 0;
    let spread = 1.5 / gradientColors.length;
    gradientColors.map((color, i) => {
      pos = i + 1 === gradientColors.length ? 1 : pos;
      grd.addColorStop(pos, color);
      pos = pos += spread;
    });

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, elWidth, elHeight);

    const starsArr = [...Array(stars)].map((i) => {
      return {
        x: lerp(0, elWidth, random()),
        y: lerp(0, elHeight, random()),
      };
    });

    starsArr.forEach((point) => {
      ctx.fillStyle = `hsl(0, 0%, 100%, ${lerp(0.3, 0.7, random())})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, lerp(0.2, 2, 0.825 * random()), 0, Math.PI * 2);
      ctx.fill();
    });

    if (cosmicCloudsPos && cosmicCloudsPos.trim() == "true") {
      const cosmicClouds = [...Array(90)].map(() => {
        return {
          x: lerp(0, elWidth, random()),
          y: (elHeight / 4) * random() + elHeight / 3,
        };
      });

      cosmicClouds.forEach((point) => {
        const radius = lerp(elHeight / 12, elHeight / 2, random());
        const radgrad = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          radius / 2
        );
        radgrad.addColorStop(
          0,
          `hsl(0, 0%, 100%, ${lerp(0.08, 0.25, random())})`
        );
        radgrad.addColorStop(1, `hsl(0, 0%, 100%, 0)`);
        ctx.beginPath();
        ctx.fillStyle = radgrad;
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }
}

registerPaint(WORKLET, CosmicStarfield);
