import ClickFace from "../assets/img/faces/clickface.svg";
import LostFace from "../assets/img/faces/lostface.svg";
import SmileFace from "../assets/img/faces/smileface.svg";
import WinFace from "../assets/img/faces/winface.svg";

export default function SmileyFace({ face, handleClick }) {
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

	return (
		<div className="face">
			<button type="button" onClick={handleClick}>
				{<img height={40} src={getFace()} alt="smiley" />}
			</button>
		</div>
	);
}
