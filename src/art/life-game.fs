precision mediump float;

uniform sampler2D uBackBuffer;
uniform float uTime;
uniform float uSize;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

int getCell(int x, int y) {
  return int(texture2D(uBackBuffer, (vUv + vec2(x, y) / uSize)).r);
}

void main() {
  vec4 backBuffer = texture2D(uBackBuffer, vUv);

  if (backBuffer.a == 0.) {
    gl_FragColor = vec4(vec3(step(0.5, rand(vUv + uTime))), 1.);
    return;
  }

  bool isAlive = backBuffer.r > 0.5;

  int sum;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;
      sum += getCell(i, j);
    }
  }

  if (!isAlive && sum == 3) {
    gl_FragColor = vec4(1.);
  } else if (isAlive && (sum == 2 || sum == 3)) {
    gl_FragColor = vec4(vec3(getCell(0, 0)), 1.);
  } else {
    gl_FragColor = vec4(vec3(0.), 1.);
  }
}
