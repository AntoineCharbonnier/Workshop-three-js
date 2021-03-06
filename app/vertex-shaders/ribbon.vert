
#pragma glslify: cnoise = require(./classicnoise4D)

uniform float time;

void main() {

    vec3 vPosition = position;

    float easing = 0.000008;

    vPosition.x += (cnoise_1_4(vec4(vec3(vPosition), time * easing)));
    vPosition.y += (cnoise_1_4(vec4(vec3(vPosition), time * easing)));
    vPosition.z += (cnoise_1_4(vec4(vec3(vPosition), time * easing)));

	gl_Position  = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

}