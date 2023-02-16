import { MOVEMENTS_ENTITY_NAME } from "$lib/constants";
import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit";

export default async function deleteMovementsFromSupabaseInOneDay(
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