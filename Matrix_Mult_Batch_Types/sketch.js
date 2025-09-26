// Canvas setup for matrix multiplication with various methods and animation
let M = 8; // Rows in A
let N = 8; // Columns in A and Rows in B
let C = 8; // Columns in B
let batch_size = 2; // Batch size (adjusted to match new method)
let cellSize = 15; // Cell size in grid
let offset = 30; // Offset for drawing matrices

let step = 0; // Animation step
let currentPartition = 0;
let currentSubRound = 0; // Current sub-round for new method
let subRounds = 4; // Number of sub-rounds for new method
let currentBatchStep = 0; // Current batch step for batch multiplication
let totalSteps;
let steps = []; // Precomputed steps for batch multiplication

let A, B, R;

let multiplicationMode = 'default'; // Mode of multiplication: 'default', 'partition', 'subRound', or 'batch'
let defaultButton, partitionButton, subRoundButton, batchButton;

function setup() {
  createCanvas(600, 500);
  frameRate(6); // Slow down for better visualization

  // Initialize matrices for new method
  A = createMatrix(M, N);
  B = createMatrix(N, C);
  R = createZeroMatrix(M, C);

  // Precompute steps for batch multiplication
  for (let i = 0; i < M; i += batch_size) {
    for (let j = 0; j < C; j += batch_size) {
      for (let k = 0; k < N; k += batch_size) {
        steps.push({ i, j, k });
      }
    }
  }
  totalSteps = steps.length;

  // Create buttons to toggle multiplication modes
  defaultButton = createButton('Default Multiplication');
  defaultButton.position(10, height + 10);
  defaultButton.mousePressed(() => switchMode('default'));

  partitionButton = createButton('Partition Multiplication');
  partitionButton.position(200, height + 10);
  partitionButton.mousePressed(() => switchMode('partition'));

  subRoundButton = createButton('Sub-Round Multiplication');
  subRoundButton.position(400, height + 10);
  subRoundButton.mousePressed(() => switchMode('subRound'));

  batchButton = createButton('Batch Multiplication');
  batchButton.position(600, height + 10);
  batchButton.mousePressed(() => switchMode('batch'));
}

function draw() {
  background(255);
  textSize(16);
  fill(0);
  
  if (multiplicationMode === 'partition' || multiplicationMode === 'subRound') {
    frameRate(2); // Slow down for better visualization
  } else {
    frameRate(12); // High frame rate for default and batch modes
  }

  // Draw Matrix A
  text('Matrix A', offset + (N * cellSize) / 2 - 30, offset - 10);
  drawMatrix(offset, offset, M, N, 'A', highlightA(step, currentPartition, currentSubRound, currentBatchStep));

  // Draw Matrix B
  text('Matrix B', offset + N * cellSize + 200 + (C * cellSize) / 2 - 30, offset - 10);
  drawMatrix(offset + N * cellSize + 200, offset, N, C, 'B', highlightB(step, currentPartition, currentSubRound, currentBatchStep));

  // Draw Result Matrix
  text('Result Matrix', offset + (N * cellSize) / 2 - 50, offset + M * cellSize + 150 - 10);
  drawMatrix(offset, offset + M * cellSize + 150, M, C, 'Result', highlightResult(step, currentPartition, currentSubRound, currentBatchStep));

  // Draw statistics at the right bottom part of the canvas
  fill(0);
  textSize(12);
  text(`Multiplication Mode: ${multiplicationMode} `, width - width/3, 380);
  text(`Current Step: ${step} / ${M * C}`, width - width/3, 400);
  text(`Current Partition: ${currentPartition} / ${ceil(M / batch_size)}`, width - width/3, 420);
  text(`Current Sub-Round: ${currentSubRound} / ${subRounds}`, width - width/3, 440);
  text(`Current Batch Step: ${currentBatchStep} / ${totalSteps}`, width - width/3, 460);

  if (multiplicationMode === 'default') {
    // Update animation step for default multiplication
    step++;
    if (step > M * C) noLoop(); // Stop animation after all steps
  } else if (multiplicationMode === 'partition') {
    // Additional drawing for partition multiplication method
    if (currentPartition * batch_size < M) {
      let startRow = currentPartition * batch_size;
      let endRow = Math.min(startRow + batch_size, M);

      // Perform the multiplication for the current partition
      for (let i = startRow; i < endRow; i++) {
        for (let j = 0; j < C; j++) {
          for (let k = 0; k < N; k++) {
            R[i][j] += A[i][k] * B[k][j];
          }
        }
      }

      currentPartition++;
    } else {
      noLoop(); // Stop the animation when all partitions are processed
    }
  } else if (multiplicationMode === 'subRound') {
    // Additional drawing for sub-round multiplication method
    if (currentSubRound < subRounds) {
      let portionSize = floor(N / subRounds);
      let start = currentSubRound * portionSize;
      let end = start + portionSize;

      // Perform the multiplication for the current sub-round
      for (let i = 0; i < M; i++) {
        for (let j = 0; j < C; j++) {
          for (let k = start; k < end; k++) {
            R[i][j] += A[i][k] * B[k][j];
          }
        }
      }

      currentSubRound++;
    } else {
      noLoop(); // Stop the animation after all sub-rounds
    }
  } else if (multiplicationMode === 'batch') {
    // Batch multiplication method
    if (currentBatchStep < totalSteps) {
      let { i, j, k } = steps[currentBatchStep];

      // Perform batch multiplication
      for (let x = 0; x < batch_size; x++) {
        for (let y = 0; y < batch_size; y++) {
          if (i + x < M && j + y < C) {
            let sum = 0;
            for (let z = 0; z < batch_size; z++) {
              if (k + z < N) {
                sum += A[i + x][k + z] * B[k + z][j + y];
              }
            }
            R[i + x][j + y] += sum;
          }
        }
      }

      currentBatchStep++;
    } else {
      noLoop(); // Stop the animation when all steps are complete
    }
  }
}

function drawMatrix(x, y, rows, cols, label, highlights = []) {
  stroke(200);

  // Draw grid
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (highlights.includes(`${i},${j}`)) {
        fill(255, 0, 0); // Highlight in red
      } else {
        fill(240); // Default color
      }
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);
    }
  }
}

function highlightA(step, currentPartition, currentSubRound, currentBatchStep) {
  let highlights = [];
  if (multiplicationMode === 'default') {
    // Highlight rows in Matrix A based on step
    let row = floor(step / C);
    if (row < M) {
      for (let col = 0; col < N; col++) {
        highlights.push(`${row},${col}`);
      }
    }
  } else if (multiplicationMode === 'partition') {
    // Highlight rows in Matrix A based on current partition
    let startRow = currentPartition * batch_size;
    let endRow = Math.min(startRow + batch_size, M);
    for (let i = startRow; i < endRow; i++) {
      for (let col = 0; col < N; col++) {
        highlights.push(`${i},${col}`);
      }
    }
  } else if (multiplicationMode === 'subRound') {
    // Highlight columns in Matrix A for the current sub-round
    let portionSize = floor(N / subRounds);
    let start = currentSubRound * portionSize;
    let end = start + portionSize;
    for (let i = 0; i < M; i++) {
      for (let col = start; col < end; col++) {
        highlights.push(`${i},${col}`);
      }
    }
  } else if (multiplicationMode === 'batch') {
    // Highlight batch in Matrix A for the current step
    if (currentBatchStep < totalSteps) {
      let { i, k } = steps[currentBatchStep];
      for (let x = 0; x < batch_size; x++) {
        for (let z = 0; z < batch_size; z++) {
          if (i + x < M && k + z < N) {
            highlights.push(`${i + x},${k + z}`);
          }
        }
      }
    }
  }
  return highlights;
}

function highlightB(step, currentPartition, currentSubRound, currentBatchStep) {
  let highlights = [];
  if (multiplicationMode === 'default') {
    // Highlight columns in Matrix B based on step
    let col = step % C;
    if (col < C) {
      for (let row = 0; row < N; row++) {
        highlights.push(`${row},${col}`);
      }
    }
  } else if (multiplicationMode === 'partition') {
    // Highlight all columns in Matrix B during partition multiplication
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < C; col++) {
        highlights.push(`${row},${col}`);
      }
    }
  } else if (multiplicationMode === 'subRound') {
    // Highlight specific columns in Matrix B for the current sub-round
    let portionSize = floor(N / subRounds);
    let start = currentSubRound * portionSize;
    let end = start + portionSize;
    for (let row = start; row < end; row++) {
      for (let col = 0; col < C; col++) {
        highlights.push(`${row},${col}`);
      }
    }
  } else if (multiplicationMode === 'batch') {
    // Highlight batch in Matrix B for the current step
    if (currentBatchStep < totalSteps) {
      let { k, j } = steps[currentBatchStep];
      for (let z = 0; z < batch_size; z++) {
        for (let y = 0; y < batch_size; y++) {
          if (k + z < N && j + y < C) {
            highlights.push(`${k + z},${j + y}`);
          }
        }
      }
    }
  }
  return highlights;
}

function highlightResult(step, currentPartition, currentSubRound, currentBatchStep) {
  let highlights = [];
  if (multiplicationMode === 'default') {
    // Highlight a single cell in Result Matrix based on step
    let row = floor(step / C);
    let col = step % C;
    if (row < M && col < C) {
      highlights.push(`${row},${col}`);
    }
  } else if (multiplicationMode === 'partition') {
    // Highlight rows in Result Matrix based on current partition
    let startRow = currentPartition * batch_size;
    let endRow = Math.min(startRow + batch_size, M);
    for (let i = startRow; i < endRow; i++) {
      for (let col = 0; col < C; col++) {
        highlights.push(`${i},${col}`);
      }
    }
  } else if (multiplicationMode === 'subRound') {
    // Highlight specific rows in Result Matrix for the current sub-round
    let portionSize = floor(N / subRounds);
    let start = currentSubRound * portionSize;
    let end = start + portionSize;
    for (let i = 0; i < M; i++) {
      for (let col = 0; col < C; col++) {
        highlights.push(`${i},${col}`);
      }
    }
  } else if (multiplicationMode === 'batch') {
    // Highlight batch in Result Matrix for the current step
    if (currentBatchStep < totalSteps) {
      let { i, j } = steps[currentBatchStep];
      for (let x = 0; x < batch_size; x++) {
        for (let y = 0; y < batch_size; y++) {
          if (i + x < M && j + y < C) {
            highlights.push(`${i + x},${j + y}`);
          }
        }
      }
    }
  }
  return highlights;
}

// Helper to create a random matrix
function createMatrix(rows, cols) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(floor(random(1, 10)));
    }
    matrix.push(row);
  }
  return matrix;
}

// Helper to create a zero matrix
function createZeroMatrix(rows, cols) {
  let matrix = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    matrix.push(row);
  }
  return matrix;
}

// Switch multiplication mode
function switchMode(mode) {
  multiplicationMode = mode;
  step = 0;
  currentPartition = 0;
  currentSubRound = 0;
  currentBatchStep = 0;
  R = createZeroMatrix(M, C); // Reset result matrix
  loop();
}
