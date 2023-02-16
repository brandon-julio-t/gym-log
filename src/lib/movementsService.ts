import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type IMovementTransaction from './contracts/IMovementTransaction';

const MOVEMENTS_ENTITY_NAME = 'movements';

export function getMovementsFromLocalStorageInDateRange(startDate: Date, endDate: Date) {
	const start = new Date(startDate);
	start.setHours(0, 0, 0);

	const end = new Date(endDate);
	end.setHours(23, 59, 59);

	const movements: IMovementTransaction[] = JSON.parse(
		localStorage.getItem(MOVEMENTS_ENTITY_NAME) ?? '[]'
	);

	return movements.filter((movement) => {
		const createdAt = new Date(movement.created_at);
		return start <= createdAt && createdAt <= end;
	});
}

export function saveMovementsIntoLocalStorage(movements: IMovementTransaction[]) {
	localStorage.setItem(MOVEMENTS_ENTITY_NAME, JSON.stringify(movements));
}

export async function getMovementsFromSupabaseInDateRange(
	supabaseClient: TypedSupabaseClient,
	userId: string,
	startDate: Date,
	endDate: Date
) {
	const startDateFmt = startDate.toISOString().slice(0, 'yyyy-mm-dd'.length);
	const endDateFmt = endDate.toISOString().slice(0, 'yyyy-mm-dd'.length);

	return await supabaseClient
		.from(MOVEMENTS_ENTITY_NAME)
		.select()
		.eq('user_id', userId)
		.gte('created_at', `${startDateFmt} 00:00:00`)
		.lte('created_at', `${endDateFmt} 23:59:59`)
		.order('created_at', { ascending: true });
}

export async function deleteMovementsFromSupabaseInOneDay(
	supabaseClient: TypedSupabaseClient,
	date: Date
) {
	const dateFmt = date.toISOString().slice(0, 'yyyy-mm-dd'.length);

	return await supabaseClient
		.from(MOVEMENTS_ENTITY_NAME)
		.delete()
		.gte('created_at', `${dateFmt} 00:00:00`)
		.lte('created_at', `${dateFmt} 23:59:59`);
}

export async function saveMovementsIntoSupabase(
	supabaseClient: TypedSupabaseClient,
	movements: IMovementTransaction[]
) {
	return await supabaseClient.from(MOVEMENTS_ENTITY_NAME).insert(movements);
}

export function groupMovementsByName(
	movements: IMovementTransaction[]
): [Map<string, IMovementTransaction[]>, string[]] {
	const groupedMovements = new Map<string, IMovementTransaction[]>();

	movements.forEach((movement) => {
		const normalizedKey = movement.name.trim().toLowerCase();

		if (groupedMovements.has(normalizedKey)) {
			groupedMovements.get(normalizedKey)?.push(movement);
		} else {
			groupedMovements.set(normalizedKey, [movement]);
		}
	});

	const keys = [...groupedMovements.keys()];

	return [groupedMovements, keys];
}
