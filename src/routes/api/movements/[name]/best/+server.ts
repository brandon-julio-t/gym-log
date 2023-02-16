import { MOVEMENTS_ENTITY_NAME } from '$lib/constants';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session) {
		throw error(401, {
			message: 'Please sign in to see personal record. Sorry for the inconvenience.'
		});
	}

	const { params } = event;
	const { data, error: err } = await supabaseClient
		.from(MOVEMENTS_ENTITY_NAME)
		.select()
		.eq('user_id', session.user.id)
		.ilike('name', params.name)
		.order('weight', { ascending: false })
		.order('reps', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (err) {
		console.error(err);
		throw err;
	}

	return json(data);
}) satisfies RequestHandler;
