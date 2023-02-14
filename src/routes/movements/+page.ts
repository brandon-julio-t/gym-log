import type { PageLoad } from './$types';

export const load = (({ params }) => {
	const rawData = [
		{ name: 'curl', category: 'pull' },
		{ name: 'row', category: 'pull' },
		{ name: 'lat pulldown', category: 'pull' },
		{ name: 'hammer curl', category: 'pull' },

		{ name: 'bench press', category: 'push' },
		{ name: 'inclined bench press', category: 'push' },
		{ name: 'tricep pushdown', category: 'push' },
		{ name: 'shoulder press', category: 'push' },

		{ name: 'deadlift', category: 'leg' },
		{ name: 'calf raises', category: 'leg' },
		{ name: 'squat', category: 'leg' }
	];

	const movements = new Map<string, string[]>();

	rawData.forEach((d) => {
		if (movements.has(d.category)) {
			movements.get(d.category)?.push(d.name);
		} else {
			movements.set(d.category, [d.name]);
		}
	});

	return {
		categories: [...movements.keys()],
		movements
	};
}) satisfies PageLoad;
