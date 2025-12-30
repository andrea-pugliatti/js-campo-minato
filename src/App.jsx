/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Biome bug> */
import { useEffect, useState } from "react";

function App() {
	const [grid, setGrid] = useState([]);
	const [bombs, setBombs] = useState([]);
	const [gameOver, setGameOver] = useState(false);

	const emptyCell = {
		isActive: false,
		closeMines: 0,
	};

	function initializeGrid() {
		const newGrid = [];

		for (let i = 0; i < 100; i++) {
			newGrid.push(emptyCell);
		}

		setGrid(newGrid);
	}

	const getRandomNumber = (min, max) =>
		Math.floor(Math.random() * (max - min + 1)) + min;

	const checkBomb = (index) => bombs.includes(index);

	// const updateCells = (index) => {
	//   const newGrid = [...grid];
	//   if (index >= 10) {

	//   }
	//   newGrid[index]
	// };

	function initializeBombs() {
		const array = [];

		for (let i = 0; i < 16; i++) {
			const randomNum = getRandomNumber(0, 99);
			array.push(randomNum);
			updateCells(randomNum);
		}

		setBombs(array);
	}

	useEffect(() => {
		initializeGrid();
		initializeBombs();
	}, []);

	return (
		<div className="container">
			<div className="grid">
				{grid.map((current, index) => (
					<button
						type="button"
						key={`cell-${current.isActive}-${index}`}
						className={`cell ${current.isActive ? "active" : ""}`}
						onClick={() => {
							if (checkBomb(index)) {
								console.log("Exploded", index, bombs);
								setGameOver(true);
							}

							const newGrid = [...grid];
							newGrid[index] = { ...newGrid[index], isActive: true };
							setGrid(newGrid);
						}}
					>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
}

export default App;
