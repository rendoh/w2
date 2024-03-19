import * as THREE from 'three';
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from 'three/examples/jsm/Addons.js';

import fragmentShader from '../sobel/sobel.fs';
import vertexShader from '../sobel/sobel.vs';
import { camera } from './camera';
import { sizes } from './sizes';

class Renderer {
  public readonly canvas = document.createElement('canvas');
  public readonly renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  public readonly scene = new THREE.Scene();
  private composer = new EffectComposer(this.renderer);
  private sobelPass: ShaderPass;
  private renderPass: RenderPass;

  constructor() {
    this.initCanvas();

    this.renderPass = new RenderPass(this.scene, camera.camera);
    this.composer.addPass(this.renderPass);

    this.sobelPass = new ShaderPass({
      name: 'SobelShader',
      uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        uResolution: { value: new THREE.Vector2(sizes.width, sizes.height) },
      },
      vertexShader,
      fragmentShader,
    });
    this.composer.addPass(this.sobelPass);

    this.resize();
  }

  private initCanvas() {
    this.canvas.style.display = 'block';
    document.body.appendChild(this.canvas);
  }

  public resize() {
    camera.resize();
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(sizes.pixelRatio);

    this.sobelPass.uniforms.uResolution.value.set(sizes.width, sizes.height);

    this.composer.setSize(sizes.width, sizes.height);
  }

  public update() {
    this.renderer.setRenderTarget(null);
    this.composer.render();
  }

  public dispose() {
    this.renderer.dispose();
    this.canvas.remove();
    this.composer.dispose();
    this.sobelPass.dispose();
  }

  public enableSobel() {
    this.sobelPass.enabled = true;
  }

  public disableSobel() {
    this.sobelPass.enabled = false;
  }
}

export const renderer = new Renderer();
