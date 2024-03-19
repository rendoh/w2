precision mediump float;

uniform sampler2D uLifeGame;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.);
  vec2 uv = vUv - .5;
  uv.x *= min(uResolution.x / uResolution.y, 1.);
  uv.y *= min(uResolution.y / uResolution.x, 1.);
  uv += .5;

  vec4 life = texture2D(uLifeGame, uv);

  vec3 color = vec3(251. / 255., 146. / 255., 60. / 255.);
  gl_FragColor = vec4(mix(
    vec3(1.),
    color,
    step(.5, life.r)
  ), 1.);
}
