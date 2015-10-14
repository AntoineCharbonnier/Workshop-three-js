uniform vec3 color;
uniform float alpha;
uniform sampler2D texture;

varying vec3 vColor;



void main() {

  gl_FragColor = vec4( color * vColor, alpha );

  gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );

}