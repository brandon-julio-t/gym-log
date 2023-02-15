import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let movements: IMovementTransaction[] = [];

	if (session) {
		const now = new Date();
		const nowStr = now.toISOString().slice(0, 'yyyy-mm-dd'.length);

		const { data, error } = await supabaseClient
			.from('movements')
			.select()
			.eq('user_id', session.user.id)
			.gte('created_at', `${nowStr} 00:00:00`)
			.lte('created_at', `${nowStr} 23:59:59`);

		if (error) {
			console.error(error);
			throw error;
		}

		movements = data ?? [];
	}

	if (typeof localStorage !== 'undefined') {
		const previousMovements: IMovementTransaction[] = JSON.parse(
			localStorage.getItem('movements') ?? '[]'
		);

		const unaddedMovements = previousMovements.filter((m) =>
			movements.every((alreadyAdded) => alreadyAdded.id !== m.id)
		);

		movements = [...movements, ...unaddedMovements];
	}

	return {
		movements
	};
}) satisfies PageLoad;

interface IMovementTransaction {
	id: string;
	created_at: string;
	name: string;
	reps: number;
	weight: number;
}
