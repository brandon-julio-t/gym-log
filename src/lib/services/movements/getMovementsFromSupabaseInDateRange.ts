import { MOVEMENTS_ENTITY_NAME } from "$lib/constants";
import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit";

export default async function getMovementsFromSupabaseInDateRange(
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