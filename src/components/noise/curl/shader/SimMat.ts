import { DataTexture, ShaderMaterial, Vector2 } from "three";

export default class SimMatCurly extends ShaderMaterial {
  constructor(pos: DataTexture, offset: DataTexture, resolution: Vector2) {
    super({
      uniforms: {
        uPositions: { value: pos },
        uOffset: { value: offset },
        uTime: { value: 0 },
        uSpeed: { value: 0.0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }
      `,
      fragmentShader: /* glsl */ `
          precision mediump float;
       uniform sampler2D uPositions;
       uniform float uTime;
       uniform float uSpeed;
       varying vec2 vUv;  
       #define PI 3.141592653

    // --------------------------------------------------------------
    // CURL NOISE START----------------------------------------------
    // --------------------------------------------------------------

    // Description : Array and textureless GLSL 2D/3D/4D simplex
    //               noise functions.
    //      Author : Ian McEwan, Ashima Arts.
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
    //               Distributed under the MIT License. See LICENSE file.
    //               https://github.com/ashima/webgl-noise
    //
   vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float snoise(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}
    
    vec3 snoiseVec3( vec3 x ){
      float s  = snoise(vec3( x ));
      float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;  
    }
    
    vec3 curlNoise( vec3 p ){

      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );
    
      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );
    
      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    
      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    
    }


    // --------------------------------------------------------------
    // CURL NOISE END----------------------------------------------
    // --------------------------------------------------------------
    vec2 rotate(vec2 v, float a) {
	      float s = sin(a);
	      float c = cos(a);
	      mat2 m = mat2(c, s, -s, c);
	      return m * v;
    }

    void main(){
      vec2 uv = vUv;
      vec4 pos = texture2D( uPositions, uv );

      vec3 curlPos = pos.xyz;
      float freq = 0.35; 
      float time = uTime *0.01;

      curlPos = curlNoise(pos.xyz * freq + time  );
      curlPos += curlNoise(curlPos *freq *2. ) ;       //pos.xy += curlPos.xy;
      curlPos.xz = rotate(curlPos.xz, uTime *0.1) ;
      //gl_FragColor = pos;



      gl_FragColor = vec4( curlPos, 1. );
    }
`,
    });
  }
}
// float box = sdBox(pos.xy - smoothstep(1.9999, 1.9998, length(pos.xy -0.5) ) - mod(uTime , .01) , vec2(0.5)) ;
// vec2 vel = offset.xy;
// vec3 nc = curl(vec3(pos.x*1.25,pos.y*.85 , uTime *0.15 - length(box)) + vec3(0.,0.25,0.))*8.   ;
// float d2 = length(nc.xy  + pos.xy) *0.15;
// vel *= nc.xy *0.15 * length(box) ;
// pos.x -= vel.x * normalize(nc.x) * smoothstep(0.,0.5,d2)   ;
// pos.y -= vel.y * normalize(nc.y) * smoothstep(0.,0.5,d2) ;

// pos = mod(pos, 4.);

// float radius = length(pos.xyz);
// float theta = atan(pos.x, pos.y);
// float phi = acos(pos.z / radius);

// float noiseTheta = snoise(vec3(theta + uTime*0.1   , phi *2.  , radius));
// float noisePhi = snoise(vec3(phi * 2. + uTime*0.1, theta   , radius));
// float noiseZ = snoise(vec3(theta , phi , uTime * 0.1));
// float str = 7.;
// float x = radius * sin(phi  + noisePhi * str) * cos(theta  + noiseTheta*str)   ;
// float y = radius * sin(phi  + noisePhi * str) * sin(theta  + noiseTheta*str)    ;
// float z = radius * cos(phi  + noisePhi * str);

// float coord = sin(phi) * cos(theta) ;

// vec3 cNoise = curl(vec3(noiseTheta, noisePhi, uTime * 0.1)) * 0.1;
// vec3 disp = vec3(noiseTheta,noisePhi,1.) ;
// // float radius = pow(dist, 0.8);
// // angle += 0.1 * (0.5 - offset.x) + uTime * 0.1;
// // pos.x = radius * cos(angle);
// // pos.y = radius * sin(angle);
// vec3 dispDisr= normalize(disp) ;
// pos.xyz = cNoise ;

// vec3 nc = curl(vec3(1.,1. , angle*dist)) *0.1   ;
// pos.x += nc.x * 0.15 ;
// pos.y += nc.y * 0.15 ;
// pos.z += nc.z * 0.15 ;

//   float time = mod(uTime,3.);
// vec3 v2 = curl(vec3(pos.xyz*.5 + uTime*0.5));
//     //pos += mix(v1, v2, clamp((time-2.5)/(3.-2.5), 0., 1.));
//     pos.xyz += v2;
