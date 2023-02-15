import { getSupabase, type TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let movements: IMovementTransaction[] = [];

	if (session) {
		const supabaseMovement = await getFromSupabase(session, supabaseClient);
		movements = supabaseMovement ?? [];
	}

	if (typeof localStorage !== 'undefined') {
		const processedMovements = getFromLocalStorage().filter((m) =>
			movements.every((alreadyAdded) => alreadyAdded.id !== m.id)
		);

		movements = [...movements, ...processedMovements];
	}

	const groupKeys = new Set<string>();
	const groupedMovements = new Map<string, IMovementTransaction[]>();

	movements.forEach((movement) => {
		const normalizedKey = movement.name.trim().toLowerCase();
		groupKeys.add(normalizedKey);

		if (groupedMovements.has(normalizedKey)) {
			groupedMovements.get(normalizedKey)?.push(movement);
		} else {
			groupedMovements.set(normalizedKey, [movement]);
		}
	});

	return {
		movements,
		groupedMovements,
		groupKeys: [...groupKeys]
	};
}) satisfies PageLoad;

async function getFromSupabase(session: Session, supabaseClient: TypedSupabaseClient) {
	const now = new Date();
	const nowStr = now.toISOString().slice(0, 'yyyy-mm-dd'.length);

	const { data, error } = await supabaseClient
		.from('movements')
		.select()
		.eq('user_id', session.user.id)
		.gte('created_at', `${nowStr} 00:00:00`)
		.lte('created_at', `${nowStr} 23:59:59`)
		.order('created_at', { ascending: true });

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}

function getFromLocalStorage() {
	const previousMovements: IMovementTransaction[] = JSON.parse(
		localStorage.getItem('movements') ?? '[]'
	);

	return previousMovements;
}

interface IMovementTransaction {
	id: string;
	created_at: string;
	name: string;
	reps: number;
	weight: number;
}
