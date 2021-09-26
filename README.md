![preview of the effect showing a linear gradient from top to bottom of nearly black, dark purple, and a purpley navy, over top of which are many small dots in varying sizes and opacity, then a cloud like effect, and final the words Hello World](preview.png)

# CSS Houdini Cosmic Starfield

> From Stephanie Eckles [@5t3ph](https://twitter.com/5t3ph) - author of [ModernCSS.dev](https://moderncss.dev).

Generate a dynamic cosmic starfield with optional cosmic clouds and customizable gradient.

**[Preview on CodePen](https://codepen.io/5t3ph/pen/RwgqVZO)**

## How to Use

While Houdini paint worklets have the best support out of available Houdini features, they still currently require a polyfill to ensure they are applied cross browser.

So, first include the following once in your project.

```html
<script src="https://unpkg.com/css-paint-polyfill"></script>
```

> Note: The polyfill will not work if the worklet is applied to pseudo elements, and _may_ have issues with customization when applied to the `body` element.

Then, include the paint worklet script _after_ the polyfill is loaded:

```html
<script>
  CSS.paintWorklet.addModule("https://unpkg.com/houdini-cosmic-starfield");

  // Trickery to get the polyfill to draw the worklet in Firefox and Safari
  setTimeout(() => {
    document.querySelector("ANCESTOR_ELEMENT").style.width = "100.01%";
    document.querySelector("ANCESTOR_ELEMENT").style.width = "100%";
  }, 500);
</script>
```

Finally, use it in your styles! For best results, assign as the `background-image` to a dedicated element.

```css
.cosmic-starfield-element {
  /* Number of stars */
  --cosmic-starfield-stars: 4280;
  /* 'true' or do not include to hide the clouds */
  --cosmic-starfield-clouds: true;
  /* String array of at least two hex codes */
  --cosmic-starfield-gradient-colors: #471f60, #231b6e;

  /* Use the worklet! */
  background-image: paint(cosmic-starfield);
}
```

> `!important` - provided gradient colors must be in hex format.

## What is CSS Houdini?

Check out other Houdini paint worklets and more info at [Houdini.How](https://houdini.how).
