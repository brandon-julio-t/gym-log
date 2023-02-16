import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import groupMovementsByBestMovement from '$lib/logics/movements/groupMovementsByBestMovement';
import groupMovementsByName from '$lib/logics/movements/groupMovementsByName';
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

	const [groupedMovements, groupedMovementKeys] = groupMovementsByName(allMovements);
	const bestMovements = groupMovementsByBestMovement(groupedMovements, groupedMovementKeys);

	return {
		allMovements,
		groupedMovements,
		groupedMovementKeys,
		bestMovements
	};
}) satisfies PageLoad;
