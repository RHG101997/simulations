//Scale
let tileSize = 15;
let mapSize = 20;

//Rotation
let angle;
let RotationPreview = true;

//Buttons
let modebtn;
let boxesbtn;

//Show box
boxes = false;

//moving
let allowMove = false; // true to move around using arrows
let xPos = 0;
let yPos = 0;
let speed = 0.08;
//speed recommended 0.08 - 0.2(also influences terrain)

//Terrain level[Max 10]
let maxTerrainLevel = 20;
let mountain = maxTerrainLevel / 1.3 //up
let grassTree = maxTerrainLevel / 1.7 // 5 and up
let grass = maxTerrainLevel / 1.8
let sand = maxTerrainLevel / 2.5 //between 4 and grass
let water = maxTerrainLevel / 3 //below 4

let treeHeight = 8; // trunk

//Day Cycle
let time = [1, 1, -1];


function setup() {
  createCanvas(500, 500, WEBGL);
  //setting starting position
  let xPos = random(1000);
  let yPos = random(1000);
  angle = PI / 4;
  // noiseDetail(8,0.4);
  
  //Viewing modes
  modebtn = createButton("Toggle Move/Rotate");
  modebtn.position(0,0);
  modebtn.mousePressed(toggleMode);
  
  //Boxes
  boxesbtn = createButton("Toggle Boxes");
  boxesbtn.position(140,0);
  boxesbtn.mousePressed(toggleBoxes);
}

function draw() {
  background(27,27,30);
  dayCycle();

  //Rotation
  rotateX(PI / 3);
  rotateZ(angle);

  //Rendering
  createWorld();

  //Mode walking, preview rotation, etc
  mode();

}

