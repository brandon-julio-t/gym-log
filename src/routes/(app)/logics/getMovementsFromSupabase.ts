import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';

export default async function getMovementsFromSupabase(
	session: Session,
	supabaseClient: TypedSupabaseClient
) {
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
