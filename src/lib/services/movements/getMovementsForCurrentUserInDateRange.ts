import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import getMovementsFromLocalStorageInDateRange from './getMovementsFromLocalStorageInDateRange';
import getMovementsFromSupabaseInDateRange from './getMovementsFromSupabaseInDateRange';

export default async function getMovementsForCurrentUserInDateRange(
	supabaseClient: TypedSupabaseClient,
	session: Session | null,
	startDate: Date,
	endDate: Date
) {
	let allMovements: IMovementTransaction[] = [];

	if (session) {
		const { data, error } = await getMovementsFromSupabaseInDateRange(
			supabaseClient,
			session.user.id,
			startDate,
			endDate
		);

		if (error) {
			console.error(error);
			throw error;
		}

		allMovements = [...allMovements, ...data];
	}

	if (typeof localStorage !== 'undefined') {
		const movements = getMovementsFromLocalStorageInDateRange(startDate, endDate).filter((m) =>
			allMovements.every((existingMovement) => existingMovement.id !== m.id)
		);
		allMovements = [...allMovements, ...movements];
	}

	return allMovements;
}
