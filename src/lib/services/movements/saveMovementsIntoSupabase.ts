import { MOVEMENTS_ENTITY_NAME } from "$lib/constants";
import type IMovementTransaction from "$lib/contracts/IMovementTransaction";
import type { TypedSupabaseClient } from "@supabase/auth-helpers-sveltekit";

export default async function saveMovementsIntoSupabase(
	supabaseClient: TypedSupabaseClient,
	movements: IMovementTransaction[]
) {
	return await supabaseClient.from(MOVEMENTS_ENTITY_NAME).insert(movements);
}
