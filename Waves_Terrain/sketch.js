let move = 0;
let spacing = 15


// Controls
let myFont;
let spcSlider;
let falloffSlider;
let lodSlider;
let playbtn;
let play = false;


function preload(){
  
  myFont = loadFont('Roboto-Regular.ttf');
  
}

function setup() {
  createCanvas(400, 400, WEBGL);
  noLoop();

  //   Control
  playbtn = createButton("Play/Pause");
  playbtn.position(0, 0);
  playbtn.mousePressed(setPlay);
//   Spacing
  spcSlider = createSlider(1,40,15, 2);
  spcSlider.position(100,20);
  spcSlider.style('width', '80px');
//   Noise
  falloffSlider = createSlider(0,1,0.6, 0.05);
  falloffSlider.position(200,20);
  falloffSlider.style('width', '80px');
  lodSlider = createSlider(1,8,2, 1);
  lodSlider.position(300,20);
  lodSlider.style('width', '80px');
}

function draw() {
  background(27, 27, 30);
  //   GUI
  fill(255);
  textFont(myFont);
  textSize(15);
  text('Spacing', -90, -185);
  text('FallOff', 10, -185);
  text('Lod', 125, -185);

  
  spacing =  spcSlider.value();
  noFill();
  stroke(255);
  rotateX(PI / 3);
  translate(100, 0)
  noiseDetail(lodSlider.value(), falloffSlider.value());
  createPoints();


}

function setPlay() {
  play = !play;
  if (play) {
    loop();
  } else {
    noLoop();
  }
}

function createPoints() {
  yoff = move; //noise 
  for (let col = -(3 * width) / 2 + spacing; col < width / 2; col += spacing) {
    xoff = 0
    beginShape();
    for (let row = -(2 * height) / 2 + spacing; row < height / 2; row += spacing) {
      vertex(row, col, map(noise(xoff, yoff), 0, 1, -50, 100)); //vertex
      xoff += 0.1; //noise
    }
    yoff += 0.1;
    endShape();
  }
  move -= 0.02
}