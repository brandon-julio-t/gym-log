<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import 'crypto';
	import type { PageData } from '../$types';
	import syncMovements from '../logics/syncMovements';

	export let data: PageData;

	let name: string;
	let reps: number;
	let weight: number;

	function handleSubmit() {
		const newMovement: IMovementTransaction = {
			id: crypto.randomUUID(),
			name,
			reps,
			weight,
			created_at: new Date().toISOString()
		};
		const newMovements = [...data.allMovements, newMovement];
		syncMovements(data.session, newMovements);
		invalidateAll();
		alert('Movement added!');
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="card bg-base-100 shadow-xl">
	<div class="card-body grid grid-cols-1 gap-4 xl:grid-cols-12">
		<section class="flex-col space-y-2 xl:col-span-6">
			<label for="name">Movement name</label>
			<input
				type="text"
				name="name"
				id="name"
				class="input-bordered input col-span-12 w-full"
				placeholder="Movement name"
				required
				bind:value={name}
				list="all-movements"
			/>
			<datalist id="all-movements">
				<option value="cake" />
				{#each data.groupedMovementKeys as key}
					<option value={key} />
				{/each}
			</datalist>
		</section>

		<section class="flex-col space-y-2 xl:col-span-2">
			<label for="name">Reps</label>
			<input
				type="number"
				name="reps"
				class="input-bordered input col-span-12 w-full"
				placeholder="Reps"
				min={1}
				required
				bind:value={reps}
			/>
		</section>

		<section class="flex-col space-y-2 xl:col-span-2">
			<label for="name">Weight (Kg)</label>
			<input
				type="number"
				name="weight"
				class="input-bordered input col-span-12 w-full"
				placeholder="Weight (kg)"
				min={1}
				required
				bind:value={weight}
			/>
		</section>

		<section class="flex items-end justify-end xl:col-span-2">
			<button class="btn-primary btn col-span-12 gap-2">
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
				Add Movement
			</button>
		</section>
	</div>
</form>
