import * as THREE from 'three';

import { camera } from '../core/camera';
import { clock } from '../core/clock';
import { renderer } from '../core/renderer';
import fragmentShader from './life-game.fs';
import vertexShader from './life-game.vs';

export const initialSize = 2 ** 8;

export class LifeGame {
  public readonly mesh: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.RawShaderMaterial
  >;

  private prev = new THREE.WebGLRenderTarget(initialSize, initialSize);
  private current = new THREE.WebGLRenderTarget(initialSize, initialSize);

  constructor() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: clock.elapsed },
        uBackBuffer: { value: this.prev.texture },
        uSize: { value: initialSize },
      },
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(geometry, material);

    this.prev.texture.magFilter = THREE.NearestFilter;
    this.current.texture.magFilter = THREE.NearestFilter;
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }

  public update() {
    const { uniforms } = this.mesh.material;
    uniforms.uBackBuffer.value = this.prev.texture;
    uniforms.uTime.value = clock.elapsed;

    renderer.renderer.setRenderTarget(this.current);
    renderer.renderer.render(this.mesh, camera.camera);

    [this.prev, this.current] = [this.current, this.prev];
  }

  public changeSize(size: number) {
    this.prev = new THREE.WebGLRenderTarget(size, size);
    this.current = new THREE.WebGLRenderTarget(size, size);
    this.mesh.material.uniforms.uSize.value = size;

    this.prev.texture.magFilter = THREE.NearestFilter;
    this.current.texture.magFilter = THREE.NearestFilter;
  }

  public get texture() {
    return this.current.texture;
  }
}
