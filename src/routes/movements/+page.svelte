<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let category: string;
	let loading: boolean;

	function getMovementsByCategory(category: string): string[] {
		return data.movements.get(category) ?? [];
	}

	function setCategory(c: string) {
		category = c;
	}
</script>

<h2 class="my-8 text-2xl font-medium">Manage Movements</h2>

<section class="flex justify-end">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<label on:click={() => setCategory('')} for="new-movement" class="btn-primary btn gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
		</svg>
		New Movement
	</label>
</section>

<section>
	<input type="checkbox" id="new-movement" class="modal-toggle" />
	<label for="new-movement" class="modal cursor-pointer">
		<label class="modal-box relative" for="">
			<label for="new-movement" class="btn-sm btn-circle btn absolute right-2 top-2">✕</label>

			<h3 class="text-lg font-bold">New Movement</h3>

			<form
				method="POST"
				class="flex-col space-y-4 py-4"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						update();
						loading = false;
					};
				}}
			>
				<section class="flex-col space-y-4">
					<label for="movement-category">Movement Category</label>
					<input
						type="text"
						name="movement-category"
						id="movement-category"
						class="input-bordered input w-full"
						list="movement-categories"
						bind:value={category}
						required
					/>
					<datalist id="movement-categories">
						{#each data.categories as category}
							<option value={category} />
						{/each}
					</datalist>
				</section>

				<section class="flex-col space-y-4">
					<label for="movement-name">Movement Name</label>
					<input
						type="text"
						name="movement-name"
						id="movement-name"
						class="input-bordered input w-full"
						required
					/>
				</section>

				<section class="flex justify-end">
					<button class="btn-primary btn" class:loading disabled={loading}>Submit</button>
				</section>
			</form>
		</label>
	</label>
</section>

<section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
	{#each data.categories as category}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title"><span class="capitalize">{category}</span> Movements</h3>

				<ul class="">
					{#each getMovementsByCategory(category) as movement}
						<li>{movement}</li>
					{:else}
						<li>No movements yet.</li>
					{/each}
				</ul>

				<div class="card-actions justify-end">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<label
						on:click={() => setCategory(category)}
						for="new-movement"
						class="btn-primary btn gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						Add
					</label>
				</div>
			</div>
		</div>
	{:else}
		<div class="card bg-base-100 shadow-xl col-span-12">
			<div class="card-body">
				<h2 class="card-title">No data.</h2>
			</div>
		</div>
	{/each}
</section>
