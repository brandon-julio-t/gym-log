<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import supabase from '$lib/supabaseClient';
	import type { PageData } from './$types';
	import type { IProgramme } from './+page';
	import Programme from './_components/Programme.svelte';

	export let data: PageData;

	let loading = false;

	function handleNewProgramme() {
		const newProgramme = {
			id: crypto.randomUUID(),
			name: 'New Programme',
			movements: [],
			order: data.programmes.length + 1,
			created_at: new Date().toISOString()
		} as IProgramme;

		localStorage.setItem('programmes', JSON.stringify([...data.programmes, newProgramme]));

		invalidateAll();
	}

	function handleChangeProgrammeOrder(programme: IProgramme, delta: number) {
		let newOrder = programme.order + delta;

		if (0 <= newOrder && newOrder < data.programmes.length) {
			const [neighbour] = data.programmes.filter((p) => p.order === newOrder);
			programme.order = newOrder;
			neighbour.order += delta * -1;
		}

		const newProgrammes = data.programmes.map((p) => (p.id === programme.id ? programme : p));
		localStorage.setItem('programmes', JSON.stringify(newProgrammes));
		invalidateAll();
	}

	async function syncToCloud() {
		const { session } = data;
		if (!session) {
			alert('Unauthenticated.');
			return;
		}

		const programmes: IProgramme[] = JSON.parse(localStorage.getItem('programmes') ?? '[]');

		{
			const { error } = await supabase.from('programmes').delete().eq('user_id', session.user.id);
			if (error) {
				console.error(error);
				return alert('An error occurred when sync to cloud (1).');
			}
		}

		{
			const newLocal = programmes.map((p) => ({ ...p, user_id: session.user.id }));
			const { error } = await supabase.from('programmes').insert(newLocal);
			if (error) {
				console.error(error);
				return alert('An error occurred when sync to cloud (2).');
			}
		}

		alert('Sync to cloud success!');
		invalidateAll();
	}

	async function syncFromCloud() {
		const { session } = data;
		if (!session) {
			alert('Unauthenticated.');
			return;
		}

		const { data: cloudProgrammes, error } = await supabase
			.from('programmes')
			.select()
			.eq('user_id', session.user.id)
			.order('order', { ascending: true })
			.order('name', { ascending: true })
			.order('created_at', { ascending: true });

		if (error) {
			console.error(error);
			return alert('An error occurred when sync from cloud.');
		}

		localStorage.setItem('programmes', JSON.stringify(cloudProgrammes ?? []));
		invalidateAll();
	}
</script>

{#if data.isDifferentFromSupabase}
	<section class="mb-4 flex flex-wrap justify-end space-x-2">
		<button on:click={syncFromCloud} class="btn-primary btn gap-2" class:loading disabled={loading}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
				/>
			</svg>
			<span>Use cloud data</span>
		</button>
		<button on:click={syncToCloud} class="btn-primary btn gap-2" class:loading disabled={loading}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
				/>
			</svg>
			<span>Use local data</span>
		</button>
	</section>
{/if}

<section class="flex justify-end">
	<button on:click={handleNewProgramme} class="btn-primary btn">New Programme</button>
</section>

<section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
	{#each data.programmes as programme}
		<Programme
			{programme}
			{data}
			on:reorder={(e) => handleChangeProgrammeOrder(e.detail.programme, e.detail.delta)}
		/>
	{:else}
		<section class="card shadow">
			<div class="card-body">
				<h2 class="card-title">No programme yet.</h2>
			</div>
		</section>
	{/each}
</section>
