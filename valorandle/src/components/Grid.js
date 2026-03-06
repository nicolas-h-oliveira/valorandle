export function createGrid(container) {

  for (let row = 0; row < 6; row++) {

    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (let col = 0; col < 5; col++) {

      const tile = document.createElement("div");
      tile.className = "tile";

      rowDiv.appendChild(tile);
    }

    container.appendChild(rowDiv);
  }

}