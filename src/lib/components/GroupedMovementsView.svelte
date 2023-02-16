<script lang="ts">
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import { createEventDispatcher } from 'svelte';

	export let groupedMovements: Map<string, IMovementTransaction[]>;
	export let groupedMovementKeys: string[];
	export let isViewOnly: boolean = false;

	const dispatch = createEventDispatcher();
</script>

{#each groupedMovementKeys as key}
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title mb-4 capitalize">{key}</h3>

			<div class="overflow-x-auto">
				<table class="table-zebra table w-full">
					<thead>
						<tr>
							<th>Set #</th>
							<th>Reps</th>
							<th>Weight</th>
							<th>Muscle Value</th>
							{#if !isViewOnly}
								<th>Action</th>
							{/if}
						</tr>
					</thead>
					<tbody>
						{#each groupedMovements.get(key) ?? [] as movement, i}
							<tr>
								<th>{i + 1}</th>
								<td>{movement.reps} times</td>
								<td>{movement.weight} kg</td>
								<td>{movement.reps * movement.weight} MV</td>
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
			</div>
		</div>
	</div>
{:else}
	<div>No movements yet.</div>
{/each}
