import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import deleteMovementsFromSupabaseInOneDay from '$lib/services/movements/deleteMovementsFromSupabaseInOneDay';
import saveMovementsIntoLocalStorage from '$lib/services/movements/saveMovementsIntoLocalStorage';
import saveMovementsIntoSupabase from '$lib/services/movements/saveMovementsIntoSupabase';
import supabase from '$lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import getMovementsFromSupabaseInDateRange from './getMovementsFromSupabaseInDateRange';

export default async function syncMovements(
	session: Session | null,
	movements: IMovementTransaction[]
) {
	let newMovements = movements.map((m) => ({ ...m, id: crypto.randomUUID() }));

	if (session) {
		const { user } = session;

		const now = new Date();
		const newData = newMovements.map((m) => ({ ...m, user_id: user.id }));

		{
			const { error } = await deleteMovementsFromSupabaseInOneDay(supabase, now);
			if (error) {
				console.error(error);
				return alert('An error occurred when sync data (1).');
			}
		}

		{
			const { error } = await saveMovementsIntoSupabase(supabase, newData);
			if (error) {
				console.error(error);
				return alert('An error occurred when sync data (2).');
			}
		}

		const { data, error } = await getMovementsFromSupabaseInDateRange(supabase, user.id, now, now);
		if (error) {
			console.error(error);
			throw error;
		}

		newMovements = data;
	}

	saveMovementsIntoLocalStorage(newMovements);

	alert('Data synced!');
}
