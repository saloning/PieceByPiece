const puzzleBoard = document.getElementById("puzzleBoard");
const piecesContainer = document.getElementById("piecesContainer");
const resetBtn = document.getElementById("resetBtn");

const factPanel = document.getElementById("factPanel");
const factImage = document.getElementById("factImage");
const factText = document.getElementById("factText");
const placePieceBtn = document.getElementById("placePieceBtn");

const rows = 3;
const cols = 4;

const basePieceSize = 120;
const svgBoxSize = 170;
const tabOffset = 25;

const pieceDisplaySize = 230;
const scale = pieceDisplaySize / svgBoxSize;
const snapStep = basePieceSize * scale;
const snapOffset = tabOffset * scale;

const imagePath = "images/mosaic.png";
const finalImagePath = "images/finalphoto.jpg";

let placedCount = 0;
let selectedPieceData = null;

const pieceFacts = [
  {
    image: "images/sunset.jpg",
    fact: "I have always been drawn to sunsets because they slow me down. No matter how busy the day has been, they give me a moment to just sit with my thoughts and reset."
  },
  {
    image: "images/travel.jpg",
    fact: "Traveling makes me feel curious in the best way. It reminds me how much there is to learn from the way other people live, and it pushes me out of my comfort zone."
  },
  {
    image: "images/friends.jpg",
    fact: "With my friends, I feel the most like myself. They have seen me at every version of who I am, and they make even ordinary moments feel meaningful."
  },
  {
    image: "images/dance.jpg",
    fact: "Dance is one of the only times I stop overthinking. It lets me just be present, and I always come out of it feeling lighter and more confident."
  },
  {
    image: "images/family.jpg",
    fact: "My family grounds me. Being around them reminds me where I come from and what really matters to me."
  },
  {
    image: "images/hiking.jpg",
    fact: "When I am hiking, I feel clear-headed in a way that is hard to find anywhere else. It gives me space to think without feeling overwhelmed."
  },
  {
    image: "images/music.jpg",
    fact: "Music connects me to my emotions in a really immediate way. It can shift my mood or bring back memories I did not even realize I was holding onto."
  },
  {
    image: "images/culture.jpg",
    fact: "Learning about different cultures makes me more aware of how I see the world. It helps me understand people better and be more open-minded."
  },
  {
    image: "images/animals.jpg",
    fact: "I have always liked animals because they are easy to be around. There is no pressure to say or do the right thing, which makes it feel really genuine and comforting."
  },
  {
    image: "images/journaling.jpg",
    fact: "Journaling gives me a quiet space to slow down and process my thoughts, turning moments that might otherwise pass by into something more intentional and meaningful."
  },
  null,
  null,
  null
];

const verticalEdges = [
  ["out", "in", "out"],
  ["in", "out", "in"],
  ["out", "in", "out"]
];

const horizontalEdges = [
  ["in", "out", "in", "out"],
  ["out", "in", "out", "in"]
];

function edgeType(row, col, side) {
  if (side === "top") {
    if (row === 0) return "flat";
    return horizontalEdges[row - 1][col] === "out" ? "in" : "out";
  }

  if (side === "bottom") {
    if (row === rows - 1) return "flat";
    return horizontalEdges[row][col];
  }

  if (side === "left") {
    if (col === 0) return "flat";
    return verticalEdges[row][col - 1] === "out" ? "in" : "out";
  }

  if (side === "right") {
    if (col === cols - 1) return "flat";
    return verticalEdges[row][col];
  }
}

function puzzlePath(row, col) {
  const top = edgeType(row, col, "top");
  const right = edgeType(row, col, "right");
  const bottom = edgeType(row, col, "bottom");
  const left = edgeType(row, col, "left");

  let d = "M 0 0 ";

  if (top === "flat") d += "L 120 0 ";
  if (top === "out") d += "L 45 0 C 45 -25, 75 -25, 75 0 L 120 0 ";
  if (top === "in") d += "L 45 0 C 45 25, 75 25, 75 0 L 120 0 ";

  if (right === "flat") d += "L 120 120 ";
  if (right === "out") d += "L 120 45 C 145 45, 145 75, 120 75 L 120 120 ";
  if (right === "in") d += "L 120 45 C 95 45, 95 75, 120 75 L 120 120 ";

  if (bottom === "flat") d += "L 0 120 ";
  if (bottom === "out") d += "L 75 120 C 75 145, 45 145, 45 120 L 0 120 ";
  if (bottom === "in") d += "L 75 120 C 75 95, 45 95, 45 120 L 0 120 ";

  if (left === "flat") d += "L 0 0 ";
  if (left === "out") d += "L 0 75 C -25 75, -25 45, 0 45 L 0 0 ";
  if (left === "in") d += "L 0 75 C 25 75, 25 45, 0 45 L 0 0 ";

  return d + "Z";
}

function createPuzzle() {
  piecesContainer.innerHTML = "";
  placedCount = 0;
  selectedPieceData = null;
  piecesContainer.style.opacity = "1";
  factPanel.classList.add("hidden");

  const area = document.querySelector(".puzzle-area");

  const puzzleWidth = cols * snapStep;
  const puzzleHeight = rows * snapStep;

  const boardLeft = (area.offsetWidth - puzzleWidth) / 2;
  const boardTop = (area.offsetHeight - puzzleHeight) / 2;

  const outsidePositions = [
    [55, 45],
    [245, 35],
    [435, 45],
    [625, 35],

    [70, 265],
    [805, 265],

    [60, 480],
    [250, 500],
    [440, 490],
    [630, 500],
    [785, 475],
    [835, 70]
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const path = puzzlePath(row, col);
      const factData = pieceFacts[index];

      const piece = document.createElement("div");
      piece.classList.add("piece");

      piece.style.width = `${pieceDisplaySize}px`;
      piece.style.height = `${pieceDisplaySize}px`;

      const [x, y] = outsidePositions[index];

      piece.style.left = `${x}px`;
      piece.style.top = `${y}px`;
      piece.style.transform = `rotate(${Math.random() * 35 - 18}deg)`;

      const factSideHTML = factData
        ? `
          <div class="fact-side">
            <img src="${factData.image}" alt="Fact image">
          </div>
        `
        : "";

      piece.innerHTML = `
        <svg viewBox="-25 -25 170 170" width="${pieceDisplaySize}" height="${pieceDisplaySize}">
          <defs>
            <clipPath id="clip-${index}">
              <path d="${path}"></path>
            </clipPath>
          </defs>

          <image
            href="${imagePath}"
            x="${-col * basePieceSize}"
            y="${-row * basePieceSize}"
            width="${cols * basePieceSize}"
            height="${rows * basePieceSize}"
            clip-path="url(#clip-${index})"
          ></image>

          <path d="${path}" fill="none" stroke="#222" stroke-width="2"></path>
        </svg>

        ${factSideHTML}
      `;

      piece.addEventListener("click", () => {
        if (piece.classList.contains("placed")) return;

        if (factData) {
          selectedPieceData = {
            piece,
            row,
            col,
            boardLeft,
            boardTop
          };

          piece.classList.add("flipped");
          factImage.src = factData.image;
          factText.textContent = factData.fact;
          factPanel.classList.remove("hidden");
        } else {
          placePiece(piece, row, col, boardLeft, boardTop);
        }
      });

      piecesContainer.appendChild(piece);
    }
  }
}

function placePiece(piece, row, col, boardLeft, boardTop) {
  if (piece.classList.contains("placed")) return;

  piece.classList.remove("flipped");

  setTimeout(() => {
    piece.style.left = `${boardLeft + col * snapStep - snapOffset}px`;
    piece.style.top = `${boardTop + row * snapStep - snapOffset}px`;
    piece.style.transform = "rotate(0deg)";
    piece.classList.add("placed");

    placedCount++;

    if (placedCount === rows * cols) {
      setTimeout(() => {
        showFinalImage(cols * snapStep, rows * snapStep);
      }, 900);
    }
  }, 450);
}

placePieceBtn.addEventListener("click", () => {
  if (!selectedPieceData) return;

  const { piece, row, col, boardLeft, boardTop } = selectedPieceData;

  factPanel.classList.add("hidden");
  placePiece(piece, row, col, boardLeft, boardTop);

  selectedPieceData = null;
});

function showFinalImage(puzzleWidth, puzzleHeight) {
  const finalImage = document.createElement("img");

  finalImage.src = finalImagePath;
  finalImage.style.position = "absolute";
  finalImage.style.left = "50%";
  finalImage.style.top = "50%";
  finalImage.style.transform = "translate(-50%, -50%)";
  finalImage.style.width = `${puzzleWidth}px`;
  finalImage.style.height = `${puzzleHeight}px`;
  finalImage.style.objectFit = "cover";
  finalImage.style.zIndex = "50";
  finalImage.style.opacity = "0";
  finalImage.style.transition = "opacity 1.2s ease";

  document.querySelector(".puzzle-area").appendChild(finalImage);

  piecesContainer.style.transition = "opacity 1.2s ease";
  piecesContainer.style.opacity = "0";

  setTimeout(() => {
    finalImage.style.opacity = "1";
  }, 50);
}

resetBtn.addEventListener("click", () => {
  location.reload();
});

window.addEventListener("load", createPuzzle);