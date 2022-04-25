varying vec2 vUv;

void main()
{
    // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
    float strength = vUv.x;
    gl_FragColor = vec4(vec3(strength), 1.0);
}