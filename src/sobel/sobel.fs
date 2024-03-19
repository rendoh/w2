uniform float opacity;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;

varying vec2 vUv;

float hCoef[9] = float[](
  1.0, 0.0, -1.0,
  2.0, 0.0, -2.0,
  1.0, 0.0, -1.0
);
float vCoef[9] = float[](
  1.0, 2.0, 1.0,
  0.0, 0.0, 0.0,
  -1.0, -2.0, -1.0
);

void main() {
  vec3 horizonColor = vec3(0.0);
  vec3 verticalColor = vec3(0.0);

  int n = 0;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      horizonColor += texture2D(tDiffuse, vUv + vec2(j, i) / uResolution).rgb * hCoef[n];
      verticalColor += texture2D(tDiffuse, vUv + vec2(j, i) / uResolution).rgb * vCoef[n];
      n++;
    }
  }

  vec3 color = texture2D(tDiffuse, vUv).rgb;
  float strength = step(0.1, length(sqrt(horizonColor * horizonColor + verticalColor * verticalColor)));

  gl_FragColor = vec4(mix(
    color,
    vec3(0.76, 0.25, 0.05),
    strength
  ), 1.0);
}