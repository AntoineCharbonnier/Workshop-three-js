varying vec2 v_uv;
varying vec3 v_line_color;

uniform float opacity;
uniform float time;
varying float z;

#define M_PI 3.1415926535897932384626433832795

void main()
{
		/*  OLD FRAGMENT SHADER  */
    // vec4 temp;
    // float alpha = sin(v_uv.y * M_PI) / 4.;
    // temp = vec4(v_line_color, opacity);
    // gl_FragColor = temp;
    

		vec2 position = -1.0 + 2.0 * v_uv;
    
    float red = abs(sin(position.x * position.y + clamp( time / 5.0, 191.0 / 255.0, 38.0 / 255.0 )));
    float green = abs(sin(position.x * position.y + clamp( time / 4.0, 209.0 / 255.0, 118.0 / 255.0 )));
    float blue = abs(sin(position.x * position.y + clamp( time / 3.0, 228.0 / 255.0, 173.0 / 255.0 ) ));
    float alpha = opacity - sin(v_uv.y * M_PI) / 4.;
    gl_FragColor = vec4(red, green, blue, alpha);


}