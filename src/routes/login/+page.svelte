<script lang="ts">
	import supabase from '$lib/supabaseClient';
	import { env } from '$env/dynamic/public';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		loading = true;

		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: env.PUBLIC_APP_URL
			}
		});

		if (error) {
			alert(error.message);
		} else {
			console.log({ data });
			alert('Check your email for the login link!');
		}

		loading = false;
	};
</script>

<main class="flex h-screen items-center">
	<form on:submit|preventDefault={handleLogin} class="card mx-auto w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title mx-auto">Login</h2>

			<input
				class="input-bordered input w-full"
				type="email"
				placeholder="Email"
				required
				bind:value={email}
			/>

			<div class="card-actions">
				<button class:loading disabled={loading} class="btn-primary btn-block btn">Login</button>
			</div>
		</div>
	</form>
</main>
