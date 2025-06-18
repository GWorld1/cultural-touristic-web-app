import 'aframe';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': unknown;
      'a-entity': unknown;
      'a-camera': unknown;
      'a-cursor': unknown;
      'a-sky': unknown;
    }
  }
}