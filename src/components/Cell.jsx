import Cell1 from "../assets/img/cells/cell1.svg";
import Cell2 from "../assets/img/cells/cell2.svg";
import Cell3 from "../assets/img/cells/cell3.svg";
import Cell4 from "../assets/img/cells/cell4.svg";
import Cell5 from "../assets/img/cells/cell5.svg";
import Cell6 from "../assets/img/cells/cell6.svg";
import Cell7 from "../assets/img/cells/cell7.svg";
import Cell8 from "../assets/img/cells/cell8.svg";
import CellDown from "../assets/img/cells/celldown.svg";
import CellFlag from "../assets/img/cells/cellflag.svg";
import CellMine from "../assets/img/cells/cellmine.svg";
import CellUp from "../assets/img/cells/cellup.svg";

export default function Cell({
	current,
	index,
	bombs,
	mineCounters,
	flagged,
	gameOver,
}) {
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

	return <img height={30} src={showCell(current, index)} alt="" />;
}
