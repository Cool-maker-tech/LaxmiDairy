# Product photos go here

Drop your photos into this folder. Filenames are matched in
`src/data/products.js` — change the `image:` line there if your
extensions differ (`.jpg`, `.png`, `.webp` all work).

The five photographed products:

    ghee.jpeg
    buttermilk.jpeg
    curd.jpeg
    paneer.jpeg
    milk.jpeg

Optional shop photography used on the home page and Our Story:

    shop.jpeg        portrait  (~1200 x 1500)
    shop-wide.jpeg   landscape (~2000 x 1000)

Every other product in the catalogue also has a path reserved
(`shrikhand-plain.jpeg`, `kaju-katli.jpeg`, `kesar-peda.jpeg`, and so on —
see `src/data/products.js` for the full list).

Until a file exists the site draws a tinted panel with the product's
initial, so a missing photo never looks broken. Add them a few at a time.

Product images display in a 4:5 frame. Around 1200 x 1500, JPEG at ~80%
quality, is plenty — keep each file under about 400 KB.
