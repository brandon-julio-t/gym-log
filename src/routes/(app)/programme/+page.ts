import type { PageLoad } from './$types';

export interface IProgramme {
	id: string;
	name: string;
	movements: string[];
	order: number;
	created_at: string;
}

export const load = (async () => {
	let programmes = [] as IProgramme[];

	if (typeof localStorage !== 'undefined') {
		programmes = JSON.parse(localStorage.getItem('programmes') ?? '[]');
	}

	programmes = programmes.sort((p1, p2) =>
		p1.order === p2.order ? p1.name.localeCompare(p2.name) : p1.order - p2.order
	);

	return { programmes };
}) satisfies PageLoad;
