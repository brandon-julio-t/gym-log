import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { PageLoad } from './$types';
import getMovementsFromLocalStorage from './_logics/getMovementsFromLocalStorage';
import getMovementsFromSupabase from './_logics/getMovementsFromSupabase';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let allMovements: IMovementTransaction[] = [];

	if (session) {
		const supabaseMovement = await getMovementsFromSupabase(session, supabaseClient);
		allMovements = supabaseMovement ?? [];
	}

	if (typeof localStorage !== 'undefined') {
		const processedMovements = getMovementsFromLocalStorage().filter((m) =>
			allMovements.every((alreadyAdded) => alreadyAdded.id !== m.id)
		);
		allMovements = [...allMovements, ...processedMovements];
	}

	const groupedMovements = new Map<string, IMovementTransaction[]>();

	allMovements.forEach((movement) => {
		const normalizedKey = movement.name.trim().toLowerCase();

		if (groupedMovements.has(normalizedKey)) {
			groupedMovements.get(normalizedKey)?.push(movement);
		} else {
			groupedMovements.set(normalizedKey, [movement]);
		}
	});

	return {
		allMovements,
		groupedMovements,
		groupedMovementKeys: [...groupedMovements.keys()]
	};
}) satisfies PageLoad;
