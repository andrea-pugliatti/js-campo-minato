/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Biome bug> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Ignore for now> */
import { useEffect, useState } from "react";

import Confetti from "react-confetti";
import Cell from "./Cell";
import Counter from "./Counter";
import SmileyFace from "./SmileyFace";

function CampoMinato({ width, height, nBombs }) {
	const [grid, setGrid] = useState([]);
	const [mineCounters, setMineCounters] = useState([]);
	const [bombs, setBombs] = useState([]);
	const [flagged, setFlagged] = useState([]);
	const [gameOver, setGameOver] = useState(false);
	const [win, setWin] = useState(false);
	const [face, setFace] = useState("smileUp");
	const [timer, setTimer] = useState();
	const [seconds, setSeconds] = useState(0);
	const [touchTimer, setTouchTimer] = useState();

	function initializeGame() {
		// Initialize new arrays for the displayed grid and counters
		const newGrid = Array(width * height).fill(false);
		const newCounters = Array(width * height).fill(0);
		const bombs = [];

		// Fill the bombs array with unique indexes
		while (bombs.length < nBombs) {
			const randomNum = getRandomNumber(0, width * height - 1);
			if (!bombs.includes(randomNum)) bombs.push(randomNum);
		}

		// Stop timer if running (for refreshing while the game is not over)
		if (timer) toggleTimer();

		setMineCounters(newCounters);
		setGrid(newGrid);
		setBombs(bombs);
		setFlagged([]);
		setGameOver(false);
		setFace("smileUp");
		setWin(false);
		setSeconds(0);
	}

	const handleTouchStart = (e, index) => {
		// Start a timer for 500ms (standard long-press duration)
		const timer = setTimeout(() => {
			// Actually call the function
			handleRightClick(e, index);
		}, 500);
		setTouchTimer(timer);
	};

	const handleTouchEnd = () => {
		// If the user lifts their finger before 500ms, cancel the timer
		if (touchTimer) {
			clearTimeout(touchTimer);
		}
	};

	function handleLeftClick(index) {
		// Disable click on game end
		if (gameOver || win) return;

		// Toggle the timer on game start
		if (!timer) toggleTimer();

		// If the current index is a bomb, game over
		if (bombs.includes(index)) {
			// console.log("Exploded", index, bombs);
			setGameOver(true);
			setFace("lost");
			if (timer) toggleTimer();
			return;
		}

		// Reset smiley face
		setFace("smileUp");

		// Reveal cells and set the grid
		const row = Math.floor(index / width);
		const col = index % width;

		const newGrid = [...grid];
		revealCells(row, col, newGrid);
		setGrid(newGrid);
	}

	function handleRightClick(e, index) {
		// Prevent opening context menu
		if (e.cancelable) e.preventDefault();

		// Disable click on game end
		if (gameOver || win) return;

		// Can't flag an already active cell
		if (grid[index]) return;

		// If already flagged, unflag
		if (flagged.includes(index)) {
			const newArray = flagged.filter((item) => item !== index);
			setFlagged(newArray);
		} else {
			const newArray = [...flagged, index];
			setFlagged(newArray);
		}
	}

	const getRandomNumber = (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	function updateCells() {
		// Initialize new array of counters
		const newCounters = Array(width * height).fill(0);

		// For every bomb
		for (const bomb of bombs) {
			const row = Math.floor(bomb / width);
			const col = bomb % width;

			/**
			 * Update the count of the cells around the bomb
			 * row -1:	-1 0 +1
			 * row 0:		-1 * +1
			 * row +1:	-1 0 +1
			 */
			for (let r = row - 1; r <= row + 1; r++) {
				for (let c = col - 1; c <= col + 1; c++) {
					const index = r * width + c;

					// Don't update if out of bounds
					if (r < 0 || r >= height || c < 0 || c >= width) continue;
					// Don't update if it's the bomb itself
					if (index === bomb || bombs.includes(index)) continue;

					// Update the count
					newCounters[index] += 1;
				}
			}
		}

		setMineCounters(newCounters);
	}

	function revealCells(row, col, grid) {
		const index = row * width + col;

		// Don't reveal if out of bounds
		if (row < 0 || row >= height || col < 0 || col >= width) return;
		// Don't reveal if already active
		if (grid[index]) return;

		// Reveal the current cell
		grid[index] = true;

		// If the current cell has neighboring mines, stop the recursion
		if (mineCounters[index] > 0) return;
		// Set the face to 😯
		setFace("click");

		// If it's a zero cell, visit all 8 neighbors
		for (let offX = -1; offX <= 1; offX++) {
			for (let offY = -1; offY <= 1; offY++) {
				// Skip the current cell itself
				if (offX === 0 && offY === 0) continue;

				// Recursevely visit the neighbors
				revealCells(row + offX, col + offY, grid);
			}
		}
	}

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

	function toggleTimer() {
		if (timer) {
			// If the timer exists clear it
			clearInterval(timer);
			setTimer(undefined);
		} else {
			// Otherwise create a new one
			const interval = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);
			setTimer(interval);
		}
	}

	useEffect(() => {
		initializeGame();
	}, []);

	useEffect(() => {
		updateCells();
	}, [bombs]);

	useEffect(() => {
		// Win condition
		if (flagged.length >= nBombs) {
			// First sort the arrays
			flagged.sort((a, b) => a - b);
			bombs.sort((a, b) => a - b);

			// Check if any element is different
			for (let i = 0; i < flagged.length; i++) {
				if (flagged[i] !== bombs[i]) return;
			}

			toggleTimer();
			setFace("win");
			setWin(true);
		}
	}, [grid, flagged]);

	return (
		<div className="center">
			{win && <Confetti />}
			<div className={`minesweeper ${getSize()}`}>
				<div className="minesweeper-top">
					<Counter number={nBombs - flagged.length} />
					<SmileyFace face={face} handleClick={initializeGame} />
					<Counter number={seconds} />
				</div>
				<div className="grid">
					{grid.map((current, index) => (
						<button
							type="button"
							key={`cell-${index}`}
							disabled={gameOver}
							className={`cell ${current ? "active" : ""}`}
							onClick={() => handleLeftClick(index)}
							onContextMenu={(e) => handleRightClick(e, index)}
							onTouchStart={(e) => handleTouchStart(e, index)}
							onTouchEnd={() => handleTouchEnd()}
							onTouchMove={() => handleTouchEnd()}
							onTouchCancel={() => handleTouchEnd()}
						>
							<Cell
								current={current}
								index={index}
								bombs={bombs}
								mineCounters={mineCounters}
								flagged={flagged}
								gameOver={gameOver}
							/>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default CampoMinato;
