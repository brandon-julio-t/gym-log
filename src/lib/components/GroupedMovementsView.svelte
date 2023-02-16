<script lang="ts">
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import { createEventDispatcher } from 'svelte';

	export let groupedMovements: Map<string, IMovementTransaction[]>;
	export let groupedMovementKeys: string[];
	export let bestMovements: Map<string, IMovementTransaction>;
	export let isViewOnly: boolean = false;

	const dispatch = createEventDispatcher();
</script>

{#each groupedMovementKeys as key}
	<div class="card border border-base-200 bg-base-100 shadow-md">
		<div class="card-body flex flex-col space-y-2">
			<h3 class="card-title capitalize">
				{key}
			</h3>

			{#if bestMovements.has(key)}
				<section class="text-sm font-medium">
					Personal Record: {bestMovements.get(key)?.reps} times @ {bestMovements.get(key)?.weight} kg
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
						{#each groupedMovements.get(key) ?? [] as movement, i}
							<tr>
								<th>
									<span>{i + 1}</span>
									{#if movement.id === bestMovements.get(key)?.id}
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
