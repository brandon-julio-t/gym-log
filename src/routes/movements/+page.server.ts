import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const { session, supabaseClient } = await getSupabase(event);

		const { request } = event;

		const formData = await request.formData();

		const category = formData.get('movement-category')?.toString().trim().toLowerCase();
		const name = formData.get('movement-name')?.toString().trim();

		const response = await supabaseClient.from('movements').insert({
			category,
			name,
			user_id: session?.user.id
		});

		console.log({ response });
	}
} satisfies Actions;
