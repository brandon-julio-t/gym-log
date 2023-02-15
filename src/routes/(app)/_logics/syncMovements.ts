import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import supabase from '$lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default async function syncMovements(
	session: Session | null,
	movements: IMovementTransaction[]
) {
	const newMovements = movements.map(m => ({...m, id: crypto.randomUUID()}))

	if (session) {
		const { user } = session;

		const now = new Date();
		const nowStr = now.toISOString().slice(0, 'yyyy-mm-dd'.length);
		const newData = newMovements.map((m) => ({ ...m, user_id: user.id }));

		{
			const { error } = await supabase
				.from('movements')
				.delete()
				.gte('created_at', `${nowStr} 00:00:00`)
				.lte('created_at', `${nowStr} 23:59:59`);

			if (error) {
				console.error(error);
				return alert('An error occurred when sync data (1).');
			}
		}

		{
			const { error } = await supabase.from('movements').insert(newData);

			if (error) {
				console.error(error);
				return alert('An error occurred when sync data (2).');
			}
		}
	}

	localStorage.setItem('movements', JSON.stringify(newMovements));

	alert('Data synced!');
}
