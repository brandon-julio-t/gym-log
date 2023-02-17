<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let selectedMovementName = data.currentMovementName;

	$: {
		if (browser) {
			const params = new URLSearchParams({ movement: selectedMovementName });
			const url = `/leaderboard?${params}`;
			goto(url);
		}
	}
</script>

<section class="mb-4">
	<div class="mb-2">
		<label for="movement-name">Filter by movement</label>
	</div>

	<select bind:value={selectedMovementName} class="input-bordered input" id="movement-name">
		<option value="all">All</option>
		{#each data.movementNames as movementName}
			<option class="capitalize" value={movementName}>{movementName}</option>
		{/each}
	</select>
</section>

<div class="overflow-x-auto">
	<table class="table-zebra table w-full">
		<thead>
			<tr>
				<th>Rank</th>
				<th>User</th>
				<th>Movement</th>
				<th>Reps</th>
				<th>Weight</th>
			</tr>
		</thead>
		<tbody>
			{#each data.movements as movement, i}
				<tr>
					<th>
						#{i + 1}

						{#if i === 0}
							👑
						{:else if i === 1}
							🥈
						{:else if i === 2}
							🥉
						{/if}
					</th>
					<td>{movement.username}</td>
					<td>{movement.name}</td>
					<td>{movement.reps} times</td>
					<td>{movement.weight} kg</td>
				</tr>
			{:else}
				<tr>
					<th colspan="5">No data.</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
