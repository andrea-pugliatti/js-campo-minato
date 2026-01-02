/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Biome bug> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Ignore for now> */
import { useEffect, useState } from "react";

import Counter from "./Counter";

import LostFace from "../assets/img/faces/lostface.svg";
import SmileFace from "../assets/img/faces/smileface.svg";
import WinFace from "../assets/img/faces/winface.svg";
import ClickFace from "../assets/img/faces/clickface.svg";

import CellDown from "../assets/img/cells/celldown.svg";
import CellFlag from "../assets/img/cells/cellflag.svg";
import CellMine from "../assets/img/cells/cellmine.svg";
import CellUp from "../assets/img/cells/cellup.svg";

import Cell1 from "../assets/img/cells/cell1.svg";
import Cell2 from "../assets/img/cells/cell2.svg";
import Cell3 from "../assets/img/cells/cell3.svg";
import Cell4 from "../assets/img/cells/cell4.svg";
import Cell5 from "../assets/img/cells/cell5.svg";
import Cell6 from "../assets/img/cells/cell6.svg";
import Cell7 from "../assets/img/cells/cell7.svg";
import Cell8 from "../assets/img/cells/cell8.svg";

function CampoMinato({ width, height, nBombs }) {
	const [grid, setGrid] = useState([]);
	const [bombs, setBombs] = useState([]);
	const [mineCounters, setMineCounters] = useState([]);
	const [flagged, setFlagged] = useState([]);
	const [gameOver, setGameOver] = useState(false);
	const [face, setFace] = useState("smileUp");

	function getFace() {
		switch (face) {
			case "smileUp":
				return SmileFace;
			case "win":
				return WinFace;
			case "lost":
				return LostFace;
			case "click":
				return ClickFace;
			default:
				return SmileFace;
		}
	}

	function initializeGame() {
		const newGrid = [];
		const newCounters = [];
		const bombs = [];

		for (let i = 0; i < width * height; i++) {
			newGrid.push(false);
			newCounters.push(0);
		}

		while (bombs.length < nBombs) {
			const randomNum = getRandomNumber(0, width * height);
			if (!bombs.includes(randomNum)) bombs.push(randomNum);
		}

		setMineCounters(newCounters);
		setGrid(newGrid);
		setBombs(bombs);
		setFlagged([]);
		setGameOver(false);
		setFace("smileUp");
	}

	const getRandomNumber = (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const checkBomb = (index) => bombs.includes(index);

	function updateCells() {
		const newCounters = Array(width * height).fill(0);

		for (const bomb of bombs) {
			const row = Math.floor(bomb / width);
			const col = bomb % width;

			for (let r = row - 1; r <= row + 1; r++) {
				for (let c = col - 1; c <= col + 1; c++) {
					const index = r * width + c;

					// If out of bounds
					if (r < 0 || r >= height || c < 0 || c >= width) continue;
					// If it's the bomb itself
					if (index === bomb || bombs.includes(index)) continue;

					newCounters[index] += 1;
				}
			}
		}

		setMineCounters(newCounters);
	}

	function revealCells(row, col, grid) {
		const index = row * width + col;

		// If out of bounds
		if (row < 0 || row >= height || col < 0 || col >= width) return;
		// If already active
		if (grid[index]) return;

		// Reveal the current cell
		grid[index] = true;

		// If this cell has neighboring mines, stop
		if (mineCounters[index] > 0) return;
		setFace("click");

		// If it's a zero cell, visit all 8 neighbors
		for (let offX = -1; offX <= 1; offX++) {
			for (let offY = -1; offY <= 1; offY++) {
				// Skip the current cell itself
				if (offX === 0 && offY === 0) continue;

				revealCells(row + offX, col + offY, grid);
			}
		}
	}

	function showCell(current, index) {
		if (bombs.includes(index) && gameOver) {
			return CellMine;
		}

		if (current) {
			switch (mineCounters[index]) {
				case 1:
					return Cell1;
				case 2:
					return Cell2;
				case 3:
					return Cell3;
				case 4:
					return Cell4;
				case 5:
					return Cell5;
				case 6:
					return Cell6;
				case 7:
					return Cell7;
				case 8:
					return Cell8;
				default:
					return CellDown;
			}
		}

		if (flagged.includes(index)) {
			return CellFlag;
		}

		return CellUp;
	}

	useEffect(() => {
		initializeGame();
	}, []);

	useEffect(() => {
		updateCells();
	}, [bombs]);

	const getSize = () => {
		switch (width) {
			case 9:
				return "small";
			case 16:
				return "medium";
			case 30:
				return "large";
			default:
				return "";
		}
	};

	return (
		<div className="center">
			<div className={`minesweeper ${getSize()}`}>
				<div className="minesweeper-top">
					<div className="bombs-number">
						<Counter number={nBombs - flagged.length} />
					</div>
					<div className="face">
						<button type="button" onClick={initializeGame}>
							{<img height={40} src={getFace()} alt="smiley" />}
						</button>
					</div>
					<div className="time">
						<Counter number={0} />
					</div>
				</div>
				<div className="grid">
					{grid.map((current, index) => (
						<button
							type="button"
							key={`cell-${index}`}
							disabled={gameOver}
							className={`cell ${current ? "active" : ""}`}
							onClick={() => {
								if (checkBomb(index)) {
									console.log("Exploded", index, bombs);
									setGameOver(true);
									setFace("lost");
									return;
								}

								setFace("smileUp");
								const row = Math.floor(index / width);
								const col = index % width;

								const newGrid = [...grid];
								revealCells(row, col, newGrid);
								setGrid(newGrid);
							}}
							onContextMenu={(e) => {
								e.preventDefault();

								if (flagged.includes(index)) {
									const newArray = flagged.filter((item) => item !== index);
									setFlagged(newArray);
								} else {
									const newArray = [...flagged, index];
									setFlagged(newArray);
								}
							}}
						>
							{<img height={30} src={showCell(current, index)} alt="" />}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default CampoMinato;
