<script lang="ts">
	import GroupedMovementsView from '$lib/components/GroupedMovementsView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log({ data });
</script>

<div class="flex flex-col space-y-4">
	<GroupedMovementsView
		groupedMovementKeys={data.groupedMovementKeys}
		groupedMovements={data.groupedMovements}
		isViewOnly
	/>
</div>
