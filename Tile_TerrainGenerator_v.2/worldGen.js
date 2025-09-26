

function createWorld(){
  //Centering world
  translate(-(mapSize*tileSize)/2,-(mapSize*tileSize)/2,0);
  //Creating grid of tiles
  noStroke();
  
  let xnoise = xPos;// map the perlin offset
  //grid x
  for(let i = 0; i < mapSize; i++){
      let ynoise = yPos;// perlin offset
    //grid y
     for(let j = 0; j< mapSize; j++){
       //noise to generate water and land
      let h = maxTerrainLevel*noise(xnoise,ynoise);
      let tree =false;
      let tileHeight =heightMap(h);
      if(h<grassTree && h>grass){ tree = true;}
       //drawing each tile as box
       //translate after each box to right
       translate(tileSize,0,tileHeight/2);
       box(tileSize,tileSize, tileHeight);
       translate(0,0,-tileHeight/2);
       if(tree){
           createTrees(tileHeight);
       }
       //perlin noise
       ynoise += speed;
     }
    xnoise +=  speed;
    //translate back to begining but 1 tile down
    translate(-tileSize*mapSize,tileSize,0); 
  } 
  //reset coordinates to 0,0,0
  translate((mapSize*tileSize)/2,-(mapSize*tileSize)/2,0);
}

function heightMap(h){
  let tileHeight;
       if(h < water){
          //water
          fill(156,211,219); //blue
          tileHeight=water;
         
        }else if( h<sand){
          //sand
          fill(248,222,126);//yellow
          tileHeight=sand;
          
        }else if(h<grass){
          fill(126,200,80) // green
          tileHeight=grass;  
        
         }else if(h<grassTree && h>grass){
          fill(126,200,80) // green
          tileHeight=grass; 
          
        }else if(h<mountain){
          fill(171,149,132);//brown
          tileHeight=mountain*1.3;  
      }else{
         fill(255);//brown
        tileHeight=maxTerrainLevel*1.4; 
      }
  if(boxes){
    stroke(51);
  }
  return tileHeight;
}


function createTrees(tileHeight){
  translate(0,0,tileHeight+treeHeight/2);//floor level + midway trunk of tree
  box(tileSize/4,tileSize/4,treeHeight); //add box as trunk[flush with floor]
  translate(0,0,treeHeight/3);// third of trunk up
  sphere(tileSize/3,6,7);// add the leaves as circle low poly
  //undoing all the translate before
  translate(0,0,-(tileHeight+treeHeight/2)-(treeHeight/3)); // reset position for next tile
}



function dayCycle(){
  directionalLight(255, 255, 255, time[0],time[1],time[2]);
}
