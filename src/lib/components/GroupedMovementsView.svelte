<script lang="ts">
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import { createEventDispatcher, onMount } from 'svelte';

	export let movements: IMovementTransaction[];
	export let isViewOnly: boolean = false;

	let movementNames = [] as string[];
	let loading = true;
	let bestMovements = new Map<string, IMovementTransaction>();
	let errorMessage = '';

	const dispatch = createEventDispatcher();

	$: {
		movementNames = [...new Set(movements.map((m) => m.name))];
		fetchBestMovements();
	}

	async function fetchBestMovements() {
		try {
			const movements = await Promise.all<IMovementTransaction>(
				movementNames.map(async (name) => {
					const url = `/api/movements/${encodeURIComponent(name)}/best`;
					return await fetch(url).then((r) => {
						if (r.ok) return r.json();
						throw r;
					});
				})
			);

			movements.forEach((m) => bestMovements.set(m.name, m));

			bestMovements = bestMovements;
		} catch (error) {
			if (error instanceof Response) {
				const err = await error.json();
				console.error(err.message);
				errorMessage = err.message;
			} else {
				console.error(error);
			}
		}

		loading = false;
	}
</script>

{#each movementNames as movementName}
	<div class="card border border-base-200 bg-base-100 shadow-md">
		<div class="card-body flex flex-col space-y-2">
			<h3 class="card-title capitalize">
				{movementName}
			</h3>

			{#if errorMessage}
				<div class="text-sm opacity-50">
					{errorMessage}
				</div>
			{:else if loading}
				<section class="text-sm font-medium">
					Personal Record:
					<span class="animate-pulse rounded bg-base-300 text-transparent">00</span> times @
					<span class="animate-pulse rounded bg-base-300 text-transparent">00</span> kg
				</section>
			{:else if bestMovements.has(movementName)}
				<section class="text-sm font-medium">
					Personal Record:
					{bestMovements.get(movementName)?.reps} times @
					{bestMovements.get(movementName)?.weight} kg
				</section>
			{/if}

			<section class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr>
							<th>Set #</th>
							<th>Reps</th>
							<th>Weight</th>
							{#if !isViewOnly}
								<th>Action</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each movements.filter((m) => m.name === movementName) as movement, i}
							<tr>
								<th>
									<span>{i + 1}</span>
									{#if movement.id === bestMovements.get(movementName)?.id}
										<span class="badge-primary badge">Best</span>
									{/if}
								</th>
								<td>{movement.reps} times</td>
								<td>{movement.weight} kg</td>
								{#if !isViewOnly}
									<td>
										<button on:click={() => dispatch('edit', movement)} class="btn-secondary btn">
											Edit
										</button>
										<button
											on:click={() => dispatch('copy', movement)}
											class="btn-outline btn-ghost btn"
										>
											Copy
										</button>
										<button on:click={() => dispatch('delete', movement)} class="btn-error btn">
											Delete
										</button>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		</div>
	</div>
{:else}
	<div>No movements yet.</div>
{/each}
