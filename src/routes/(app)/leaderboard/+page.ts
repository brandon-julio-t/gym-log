import { MOVEMENTS_ENTITY_NAME } from '$lib/constants';
import { getSupabase, type TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	if (!session) throw redirect(303, '/login');

	const { url } = event;
	const currentMovementName = url.searchParams.get('movement') || 'all';

	const [profiles, movementNames, leaderboardData] = await Promise.all([
		getProfiles(supabaseClient),
		getMovementNames(supabaseClient),
		getLeaderboardData(supabaseClient, currentMovementName)
	]);

	const movements = leaderboardData.map((movement) => {
		const [profile] = profiles.filter((p) => p.id === movement.user_id);

		if (profile?.full_name) {
			movement.username = profile.full_name;
		} else {
			movement.username = 'Anonymous';
		}

		return movement;
	});

	return {
		movements,
		movementNames,
		currentMovementName
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

async function getMovementNames(supabaseclient: TypedSupabaseClient) {
	const { data, error } = await supabaseclient
		.from(MOVEMENTS_ENTITY_NAME)
		.select('name')
		.order('name', { ascending: true });

	if (error) {
		console.error(error);
		throw error;
	}

	return [...new Set(data.map((m) => m.name))];
}

async function getLeaderboardData(
	supabaseClient: TypedSupabaseClient,
	currentMovementName: string
) {
	const { data, error } = await supabaseClient
		.from(MOVEMENTS_ENTITY_NAME)
		.select()
		.ilike('name', currentMovementName === 'all' ? '%' : currentMovementName)
		.order('weight', { ascending: false })
		.order('reps', { ascending: false })
		.limit(10);

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}
