<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import GroupedMovementsView from '$lib/components/GroupedMovementsView.svelte';
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import syncMovements from '$lib/services/movements/syncMovements';
	import type { PageData } from '../$types';
	import { movementForm } from '../_stores/movementForm';

	export let data: PageData;

	function handleEdit(movement: IMovementTransaction) {
		movementForm.update((form) => ({
			...form,
			isEdit: true,
			movement: movement
		}));
	}

	function handleCopy(movement: IMovementTransaction) {
		movementForm.update((form) => ({
			...form,
			isEdit: false,
			movement
		}));
	}

	function handleDelete(movement: IMovementTransaction) {
		if (!confirm('Are you sure to delete?')) return;
		const newMovements = data.movementsInDateRange.filter((m) => m.id !== movement.id);
		syncMovements(data.session, newMovements);
		invalidateAll();
		alert('Movement removed!');
	}
</script>

<section class="card bg-base-100 shadow-xl">
	<div class="card-body flex flex-col space-y-4">
		<h2 class="card-title">Today's Movements</h2>

		<GroupedMovementsView
			movements={data.movementsInDateRange}
			on:edit={(e) => handleEdit(e.detail)}
			on:copy={(e) => handleCopy(e.detail)}
			on:delete={(e) => handleDelete(e.detail)}
		/>
	</div>
</section>
