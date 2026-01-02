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
		const newGrid = Array(width * height).fill(false);
		const newCounters = Array(width * height).fill(0);
		const bombs = [];

		while (bombs.length < nBombs) {
			const randomNum = getRandomNumber(0, width * height - 1);
			if (!bombs.includes(randomNum)) bombs.push(randomNum);
		}

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
		if (gameOver || win) return;

		if (!timer) toggleTimer();

		if (checkBomb(index)) {
			console.log("Exploded", index, bombs);
			setGameOver(true);
			setFace("lost");
			toggleTimer();
			return;
		}

		setFace("smileUp");
		const row = Math.floor(index / width);
		const col = index % width;

		const newGrid = [...grid];
		revealCells(row, col, newGrid);
		setGrid(newGrid);
	}

	function handleRightClick(e, index) {
		if (e.cancelable) e.preventDefault();

		if (gameOver || win) return;

		if (grid[index]) return;

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
			clearInterval(timer);
			setTimer(undefined);
		} else {
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
		if (flagged.length >= nBombs) {
			flagged.sort((a, b) => a - b);
			bombs.sort((a, b) => a - b);

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
