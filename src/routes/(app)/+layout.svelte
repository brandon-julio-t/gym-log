<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let email: string = 'Anonymous';

	onMount(() => {
		const { session } = data;

		if (session) {
			email = session.user.email ?? 'Anonymous';
		}
	});

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
			throw error;
		}

		throw redirect(303, '/login');
	}
</script>

<nav class="container mx-auto mb-4 border-b-2 border-b-base-300 px-2 pb-4">
	<section class="my-4 flex justify-end">Hello, {email}</section>

	<section class="flex flex-col flex-wrap justify-between lg:flex-row">
		<ul>
			<!-- <li class="btn-ghost btn"><a href="/">Home</a></li>
			<li class="btn-ghost btn"><a href="#">History</a></li> -->
		</ul>

		<div>
			<button on:click={handleLogout} class="btn-ghost btn-block btn" class:hidden={!data.session}>
				Sign Out
			</button>

			<a href="/login" class="btn-ghost btn-block btn" class:hidden={data.session}>Sign In</a>
		</div>
	</section>
</nav>

<main class="container mx-auto px-2">
	<slot />
</main>
