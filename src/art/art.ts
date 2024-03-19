import * as THREE from 'three';

import { sizes } from '../core/sizes';
import fragmentShader from './art.fs';
import vertexShader from './art.vs';
import { LifeGame } from './life-game';

export const initialSpeed = 15;

export class Art {
  private lifeGame = new LifeGame();
  public readonly mesh: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.RawShaderMaterial
  >;
  private timer;

  constructor() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLifeGame: { value: this.lifeGame.texture },
        uResolution: {
          value: new THREE.Vector2(
            sizes.width * sizes.pixelRatio,
            sizes.height * sizes.pixelRatio,
          ),
        },
      },
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.timer = setInterval(() => {
      this.lifeGame.update();
    }, 1000 / initialSpeed);
  }

  public changeSize(size: number) {
    this.lifeGame.changeSize(size);
  }

  public changeSpeed(speed: number) {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.lifeGame.update();
    }, 1000 / speed);
  }

  public resize() {
    this.mesh.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio,
    );
  }

  public dispose() {
    this.lifeGame.dispose();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    clearInterval(this.timer);
  }

  public update() {
    this.mesh.material.uniforms.uLifeGame.value = this.lifeGame.texture;
  }
}
