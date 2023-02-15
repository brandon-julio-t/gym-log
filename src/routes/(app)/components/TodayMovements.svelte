<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import 'crypto';
	import type { PageData } from '../$types';
	import syncMovements from '../logics/syncMovements';

	export let data: PageData;

	function handleDelete(movement: IMovementTransaction) {
		if (!confirm('Are you sure to delete?')) return;
		const newMovements = data.allMovements.filter((m) => m.id !== movement.id);
		syncMovements(data.session, newMovements);
		invalidateAll();
		alert('Movement removed!');
	}
</script>

<section class="card bg-base-100 shadow-xl">
	<div class="card-body flex flex-col space-y-4">
		<h2 class="card-title">Today's Movements</h2>

		{#each data.groupedMovementKeys as key}
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
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{#each data.groupedMovements.get(key) ?? [] as movement, i}
									<tr>
										<th>{i + 1}</th>
										<td>{movement.reps} times</td>
										<td>{movement.weight} kg</td>
										<td>
											<button on:click={() => handleDelete(movement)} class="btn-error btn">
												Delete
											</button>
										</td>
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
	</div>
</section>
