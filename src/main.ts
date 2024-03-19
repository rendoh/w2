import 'the-new-css-reset';

import GUI from 'lil-gui';

import { Art, initialSize, initialSpeed } from './art';
import { clock } from './core/clock';
import { renderer } from './core/renderer';
import { sizes } from './core/sizes';
import { range } from './utils';

const gui = new GUI();

const options = {
  size: initialSize,
  speed: initialSpeed,
  sobel: true,
};

gui
  .add(
    options,
    'size',
    [...range(5, 11)].map((n) => 2 ** n),
  )
  .onChange((size: number) => {
    art.changeSize(size);
  });

gui.add(options, 'speed', 1, 60, 1).onChange((speed: number) => {
  art.changeSpeed(speed);
});

gui.add(options, 'sobel').onChange((sobel: boolean) => {
  if (sobel) {
    renderer.enableSobel();
  } else {
    renderer.disableSobel();
  }
});

const art = new Art();
renderer.scene.add(art.mesh);

function resize() {
  art.resize();
  renderer.resize();
}

function update() {
  art.update();
  renderer.update();
}

sizes.addEventListener('resize', resize);
clock.addEventListener('tick', update);
