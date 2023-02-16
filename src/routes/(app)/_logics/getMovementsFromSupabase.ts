import getMovementsFromSupabaseInDateRange from '$lib/services/movements/getMovementsFromSupabaseInDateRange';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

export default async function getMovementsFromSupabase(
	session: Session,
	supabaseClient: TypedSupabaseClient
) {
	const now = new Date();

	const { data, error } = await getMovementsFromSupabaseInDateRange(
		supabaseClient,
		session.user.id,
		now,
		now
	);

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}
