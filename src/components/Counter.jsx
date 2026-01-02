/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Ignore linter> */
import CounterDash from "../assets/img/counter/counter-.svg";
import Counter0 from "../assets/img/counter/counter0.svg";
import Counter1 from "../assets/img/counter/counter1.svg";
import Counter2 from "../assets/img/counter/counter2.svg";
import Counter3 from "../assets/img/counter/counter3.svg";
import Counter4 from "../assets/img/counter/counter4.svg";
import Counter5 from "../assets/img/counter/counter5.svg";
import Counter6 from "../assets/img/counter/counter6.svg";
import Counter7 from "../assets/img/counter/counter7.svg";
import Counter8 from "../assets/img/counter/counter8.svg";
import Counter9 from "../assets/img/counter/counter9.svg";

export default function Counter({ number }) {
	function showTime(number) {
		const string = number.toString().trim();
		const array = [];

		for (let i = 0; i <= string.length; i++) {
			switch (string.charAt(i)) {
				case "0":
					array.push(Counter0);
					break;
				case "1":
					array.push(Counter1);
					break;
				case "2":
					array.push(Counter2);
					break;
				case "3":
					array.push(Counter3);
					break;
				case "4":
					array.push(Counter4);
					break;
				case "5":
					array.push(Counter5);
					break;
				case "6":
					array.push(Counter6);
					break;
				case "7":
					array.push(Counter7);
					break;
				case "8":
					array.push(Counter8);
					break;
				case "9":
					array.push(Counter9);
					break;
				case "-":
					array.push(CounterDash);
					break;
			}
		}

		while (array.length < 3) {
			array.unshift(Counter0);
		}

		return array;
	}

	return (
		<div className="counter">
			{showTime(number).map((current, index) => {
				return <img key={`time-${index}`} height={40} src={current} alt="" />;
			})}
		</div>
	);
}
