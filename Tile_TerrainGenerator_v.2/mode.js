function mode(){
  //defualt = true
  if(RotationPreview){
    rotateAround()
  }else{
    angle = 0;
  }
  //default false
  if(allowMove){
    move();
  }
}

function toggleMode(){
    allowMove = !allowMove;
    RotationPreview = !RotationPreview;

}
function toggleBoxes(){
   boxes = !boxes;
}


function move(){
    if(keyIsDown(UP_ARROW)){
    xPos += -speed;
  }
   if(keyIsDown(DOWN_ARROW)){
    xPos += speed;
  }
  if(keyIsDown(LEFT_ARROW)){
    yPos += -speed;
  }
   if(keyIsDown(RIGHT_ARROW)){
    yPos += speed;
  }
}

function rotateAround(){
    angle -= 0.01;
}