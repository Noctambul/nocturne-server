import p5 from "p5";
import CanvasRecorder from "./src/canvas-recorder";

const myp5 = new p5((s: p5) => {
  let canvas: HTMLCanvasElement;
  let canvasRecorder: CanvasRecorder;

  s.setup = function setup() {
    canvas = s.createCanvas(300, 300).canvas;
    s.rectMode(s.CENTER);

    canvasRecorder = new CanvasRecorder(canvas);
  };
  s.frameRate(25);

  s.draw = function () {
    s.background(0);
    s.fill("#fF00ff");
    s.push();
    s.translate(w(0.5), h(0.5));
    s.rotate(s.TWO_PI * s.sin(s.frameCount * 0.01));
    s.rect(w(0), h(0), w(0.4), h(0.6));
    s.pop();
    // s.noLoop();

    canvasRecorder.update();
  };

  let isRecording = false;

  s.keyPressed = function () {
    if (s.keyCode == s.ENTER) {
      canvasRecorder.toggle();
    }
  };

  function w(val: number): number {
    return val * s.width;
  }

  function h(val: number): number {
    return val * s.height;
  }
});

export default myp5;
