import { getSupabase, type TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';
import type { Session } from '@supabase/supabase-js';
import type { PageLoad } from './$types';

export interface IProgramme {
	id: string;
	name: string;
	movements: string[];
	order: number;
	created_at: string;
}

export const load = (async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	let programmes = [] as IProgramme[];
	let isDifferentFromSupabase = false;

	if (typeof localStorage !== 'undefined') {
		programmes = JSON.parse(localStorage.getItem('programmes') ?? '[]');
	}

	if (session) {
		const supabaseProgrammes = await getProgrammesFromSupabase(supabaseClient, session);

		const localIds = programmes.map((p) => p.id);
		const supabaseIds = supabaseProgrammes.map((p) => p.id);
		if (localIds.length !== supabaseIds.length) {
			isDifferentFromSupabase = true;
		} else {
			isDifferentFromSupabase = localIds.some((id) => !supabaseIds.includes(id));
		}
	}

	programmes = programmes.sort((p1, p2) =>
		p1.order === p2.order ? p1.name.localeCompare(p2.name) : p1.order - p2.order
	);

	return {
		programmes,
		isDifferentFromSupabase
	};
}) satisfies PageLoad;

async function getProgrammesFromSupabase(supabaseClient: TypedSupabaseClient, session: Session) {
	const { data, error } = await supabaseClient
		.from('programmes')
		.select()
		.eq('user_id', session.user.id)
		.order('order', { ascending: true })
		.order('name', { ascending: true })
		.order('created_at', { ascending: true });

	if (error) {
		console.error(error);
		throw error;
	}

	return data;
}
