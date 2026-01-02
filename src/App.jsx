/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <Biome bug> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Ignore for now> */
import { useState } from "react";

import CampoMinato from "./components/CampoMinato";

function App() {
	const [choice, setChoice] = useState(null);

	const difficulties = [
		{ width: 9, height: 9, nBombs: 10 },
		{ width: 16, height: 16, nBombs: 40 },
		{ width: 30, height: 16, nBombs: 99 },
	];

	return (
		<div className="container">
			<h1>Campo Minato</h1>
			{choice === null ? (
				<div className="menu">
					<button
						type="button"
						className="choice-button"
						onClick={() => setChoice(0)}
					>
						Beginner
					</button>
					<button
						type="button"
						className="choice-button"
						onClick={() => setChoice(1)}
					>
						Intermediate
					</button>
					<button
						type="button"
						className="choice-button"
						onClick={() => setChoice(2)}
					>
						Expert
					</button>
				</div>
			) : (
				<CampoMinato
					width={difficulties[choice].width}
					height={difficulties[choice].height}
					nBombs={difficulties[choice].nBombs}
				/>
			)}
		</div>
	);
}

export default App;
