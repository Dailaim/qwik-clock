import {
	component$,
	useComputed$,
	useSignal,
	useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";

export default component$(() => {
	const time = useSignal(new Date());

	useVisibleTask$(({ cleanup }) => {
		const update = async () => {
			time.value = new Date();
		};
		const id = setInterval(update, 1000);

		cleanup(() => clearInterval(id));
	});

	const {
		value: { hours, minutes, seconds },
	} = useComputed$(() => ({
		hours: time.value.getHours(),
		minutes: time.value.getMinutes(),
		seconds: time.value.getSeconds(),
	}));

	return (
		<main
			class={css({
				flexDirection: "column",
				bg: "red.400",
				height: "dvh",
				width: "dvw",
				display: "flex",
				placeContent: "center",
				justifyContent: "center",
				alignItems: "center",
			})}
		>
			<svg
				class={css({
					width: 200,
					height: 200,
				})}
				viewBox="-50 -50 100 100"
			>
				<circle class="clock-face" r="48" />

				{[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
					<>
						<line
							class="major"
							transform={`rotate(${30 * minute})`}
							y1="35"
							y2="45"
						/>
						{[1, 2, 3, 4].map((offset) => (
							<line
								key={`${minute}minutos${offset}`}
								class="minor"
								transform={`rotate(${(minute + offset) * 6})`}
								y1="42"
								y2="45"
							/>
						))}
					</>
				))}

				<line
					transform={`rotate(${30 * hours + minutes / 2})`}
					class="hour"
					y1="2"
					y2="-20"
				/>

				<line
					class="minute"
					transform={`rotate(${6 * minutes + seconds / 10})`}
					y1="4"
					y2="-30"
				/>

				<g class="second" transform={`rotate(${6 * seconds})`}>
					<line class="second" y1="10" y2="-38" />
					<line class="second-counterweight" y1="10" y2="2" />
				</g>
			</svg>
		</main>
	);
});

export const head: DocumentHead = {
	title: "Qwik Clock",
	meta: [
		{
			name: "description",
			content: "Qwik site clock",
		},
	],
};
