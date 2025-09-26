let vector1;
let vector2;
let cosineSimilarity;
let threshold = 0.4; // Set a threshold for cosine similarity
let normalizeVectors = false; // Toggle for normalization

function setup() {
  createCanvas(600, 400); // Increased canvas size for better visibility
  // Initialize vector2 with a random direction
  vector2 = createVector(1, 0);
  // Initialize vector1
  vector1 = createVector(random(-1, 1), random(-1, 1));
  
  // Calculate cosine similarity
  calculateCosineSimilarity();
}

function draw() {
  background(255);
  
  // Update vector1 direction based on mouse position
  vector1 = createVector(mouseX - width / 2, mouseY - height / 2);
  
  // Draw axes and labels for -1, 0, 1
  stroke(200);
  line(0, height / 2, width, height / 2); // x-axis
  line(width / 2, 0, width / 2, height); // y-axis
  
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16); // Increased text size for better readability
  text("-1", width / 2 - 60, height / 2 + 20);
  text("0", width / 2, height / 2 + 20);
  text("1", width / 2 + 60, height / 2 + 20);
  text("-1", width / 2 - 15, height / 2 - 60);
  text("1", width / 2 - 15, height / 2 + 60);
  
  // Draw dashed lines representing boundaries for threshold
  stroke(150);
  drawingContext.setLineDash([5, 5]);
  let angleThreshold = acos(threshold);
  line(width / 2, height / 2, width / 2 + cos(angleThreshold) * width, height / 2 - sin(angleThreshold) * height); // Extended positive threshold boundary
  line(width / 2, height / 2, width / 2 + cos(angleThreshold) * width, height / 2 + sin(angleThreshold) * height); // Extended negative threshold boundary
  
  // Label the dashed lines
  fill(0);
  textSize(14);
  text("Threshold Boundary", width / 2 + cos(angleThreshold) * 150 + 40, height / 2 - sin(angleThreshold) * 150);
  drawingContext.setLineDash([]);

  // Draw shaded area representing possible attack area (upper and lower)
  fill(255, 165, 0, 100); // Orange with transparency
  noStroke();
  // Upper attack area
  beginShape();
  vertex(width / 2, height / 2);
  vertex(width / 2 + cos(angleThreshold) * width, height / 2 - sin(angleThreshold) * height);
  vertex(width / 2, 0);
  vertex(width / 2, height / 2);
  endShape(CLOSE);
  // Lower attack area
  beginShape();
  vertex(width / 2, height / 2);
  vertex(width / 2 + cos(angleThreshold) * width, height / 2 + sin(angleThreshold) * height);
  vertex(width / 2, height);
  vertex(width / 2, height / 2);
  endShape(CLOSE);

  // Draw shaded area for negative x-axis
  fill(255, 0, 0, 100); // Red with transparency
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(width / 2, 0);
  vertex(width / 2, height);
  vertex(0, height);
  endShape(CLOSE);

  // Draw shaded area for positive threshold (green area)
  fill(0, 255, 0, 100); // Green with transparency
  noStroke();
  beginShape();
  vertex(width / 2, height / 2);
  vertex(width / 2 + cos(angleThreshold) * width, height / 2 - sin(angleThreshold) * height);
  vertex(width, 0);
  vertex(width, height);
  vertex(width / 2 + cos(angleThreshold) * width, height / 2 + sin(angleThreshold) * height);
  vertex(width / 2, height / 2);
  endShape(CLOSE);
  
  // Normalize vector1 if normalization is enabled
  if (normalizeVectors) {
    vector1.normalize();
  }
  
  // Draw vectors
  stroke(0);
  line(width / 2, height / 2, width / 2 + vector1.x, height / 2 + vector1.y);
  line(width / 2, height / 2, width / 2 + vector2.x * 100, height / 2 + vector2.y * 100);
  
  calculateCosineSimilarity();
}

// Function to calculate cosine similarity between vector1 and vector2
function calculateCosineSimilarity() {
  // Fix the dot product calculation
  let dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
  let magnitudeV1 = sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
  let magnitudeV2 = sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
  if (magnitudeV1 !== 0 && magnitudeV2 !== 0) {
    cosineSimilarity = dotProduct / (magnitudeV1 * magnitudeV2);
  } else {
    cosineSimilarity = NaN;
  }
  
  // Determine text color based on cosine similarity value
  let textColor;
  if (!isNaN(cosineSimilarity) && cosineSimilarity > threshold) {
    textColor = color(0, 200, 0); // Darker green for values above the threshold
  } else if (!isNaN(cosineSimilarity) && cosineSimilarity < 0) {
    textColor = color(200, 0, 0); // Darker red for negative values
  } else {
    textColor = color(200, 140, 0); // Darker orange for values between 0 and threshold
  }

  // Display cosine similarity with background for readability
  textSize(18); // Increased text size for better readability
  textAlign(CENTER, CENTER);
  
  fill(255); // White background for text
  rect(width / 2 - 100, height - 75, 200, 60); // Background rectangle for text
  
  fill(textColor);
  text("Cosine Similarity: " + nf(cosineSimilarity, 1, 2), width / 2, height - 60);
  text("Magnitude: " + nf((magnitudeV1 * magnitudeV2), 1, 2), width / 2, height - 40);
  text("Dot-Product: " + nf(dotProduct, 1, 2), width / 2, height - 20);
}

function keyPressed() {
  // Toggle normalization on/off when 'n' key is pressed
  if (key === 'n' || key === 'N') {
    normalizeVectors = !normalizeVectors;
    redraw(); // Force a redraw to update the display
  }
}
