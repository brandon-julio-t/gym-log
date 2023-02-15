<script lang="ts">
	import handleAppLogin from './_logics/handleAppLogin';
	import handleGoogleLogin from './_logics/handleGoogleLogin';

	let loading = false;
	let email: string;

	async function handleLogin(provider?: string) {
		loading = true;
		if (!provider) await handleAppLogin(email);
		else if (provider === 'google') await handleGoogleLogin();
		loading = false;
	}
</script>

<main class="flex h-screen flex-col justify-center space-y-4">
	<form
		on:submit|preventDefault={() => handleLogin()}
		class="card mx-auto w-96 bg-base-100 shadow-xl"
	>
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

	<section class="card mx-auto w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-actions">
				<button
					on:click={() => handleLogin('google')}
					class:loading
					disabled={loading}
					class="btn-outline btn-ghost btn-block btn gap-2"
				>
					<img
						src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=32"
						alt="Google Sign In Icon"
					/>
					Login With Google
				</button>
			</div>
		</div>
	</section>
</main>
