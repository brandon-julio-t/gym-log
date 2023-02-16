<script lang="ts">
	import GroupedMovementsView from '$lib/components/GroupedMovementsView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log({ data });
</script>

<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
	<GroupedMovementsView
		groupedMovementKeys={data.groupedMovementKeys}
		groupedMovements={data.groupedMovements}
		bestMovements={data.bestMovements}
		isViewOnly
	/>
</div>
