/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Biome bug> */
import { useEffect, useState } from "react";

function App() {
	const width = 10;
	const height = 10;
	const nBombs = 10;

	const [grid, setGrid] = useState([]);
	const [bombs, setBombs] = useState([]);
	const [mineCounters, setMineCounters] = useState([]);
	const [gameOver, setGameOver] = useState(false);

	function initializeGame() {
		const newGrid = [];
		const newCounters = [];
		const bombs = [];

		for (let i = 0; i < width * height; i++) {
			newGrid.push(false);
			newCounters.push(0);
		}

		while (bombs.length < nBombs) {
			const randomNum = getRandomNumber(0, 99);
			if (!bombs.includes(randomNum)) bombs.push(randomNum);
		}

		setMineCounters(newCounters);
		setGrid(newGrid);
		setBombs(bombs);
		setGameOver(false);
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

	useEffect(() => {
		initializeGame();
	}, []);

	useEffect(() => {
		updateCells();
	}, [bombs]);

	return (
		<div className="container">
			<div className="minesweeper">
				<div className="minesweeper-top">
					<div className="bombs-number">{/* Maybe Later */ "000"}</div>
					<div className="face">
						<button type="button" onClick={initializeGame}>
							{gameOver ? "=(" : "=)"}
						</button>
					</div>
					<div className="time">{/* Maybe Later */ "000"}</div>
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
								}

								const newGrid = [...grid];
								newGrid[index] = true;
								setGrid(newGrid);
							}}
						>
							{current && mineCounters[index]}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
