import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface IMovement {
	name: string;
	category: string;
}

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/login');
	}

	const { data, error } = await supabaseClient
		.from('movements')
		.select('name, category')
		.eq('user_id', session.user.id)
		.order('name', { ascending: true });

		if (error) {
		throw error;
	}

	const rawData: IMovement[] = data ?? [];

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
