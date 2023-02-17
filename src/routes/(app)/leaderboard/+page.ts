import { MOVEMENTS_ENTITY_NAME } from '$lib/constants';
import { getSupabase, type TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session) throw redirect(303, '/login');

	const profiles = await getProfiles(supabaseClient);

	const { data, error } = await supabaseClient
		.from(MOVEMENTS_ENTITY_NAME)
		.select()
		.order('weight', { ascending: false })
		.order('reps', { ascending: false })
		.limit(10);

	if (error) {
		console.error(error);
		throw error;
	}

	const movements = data.map((movement) => {
		const [profile] = profiles.filter((p) => p.id === movement.user_id);

		if (profile?.full_name) {
			movement.username = profile.full_name;
		} else {
			movement.username = 'Anonymous';
		}

		return movement;
	});

	return {
		movements
	};
}) satisfies PageLoad;

async function getProfiles(supabaseClient: TypedSupabaseClient) {
	const { data, error } = await supabaseClient.from('profiles').select();

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}
