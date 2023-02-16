<script lang="ts">
	import { page } from '$app/stores';
	import supabase from '$lib/supabaseClient';
	import type { PageData } from './$types';

	export let data: PageData;

	$: isAuth = !!data.session;
	$: alias = data.session?.user.user_metadata.full_name ?? data.session?.user.email ?? 'Anonymous';

	let showNavbar = false;

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error(error);
			throw error;
		}

		window.location.reload();
	}
</script>

<nav class="container mx-auto mb-4 border-b-2 border-b-base-300 px-2 xl:pb-4">
	<section class="my-4 flex items-center justify-between">
		<button
			class="btn-ghost btn-square btn visible xl:invisible"
			on:click={() => (showNavbar = !showNavbar)}
		>
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
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>

		<span>Hello, {alias}</span>
	</section>

	<section class="flex flex-col flex-wrap justify-between overflow-hidden xl:h-auto xl:flex-row">
		<div
			class="flex flex-col justify-center xl:block xl:flex-row xl:justify-start"
			class:hidden={!showNavbar}
		>
			<a href="/" class="btn-ghost btn" class:btn-active={$page.route.id === '/(app)'}>
				Home
			</a>

			<a
				href="/history"
				class="btn-ghost btn"
				class:btn-active={$page.route.id === '/(app)/history'}
			>
				History
			</a>

			{#if isAuth}
				<a
					href="/leaderboard"
					class="btn-ghost btn"
					class:btn-active={$page.route.id === '/(app)/leaderboard'}
				>
					Leaderboard
				</a>
			{/if}
		</div>

		<div class="flex justify-center xl:block xl:justify-end" class:hidden={!showNavbar}>
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
