<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import GroupedMovementsView from '$lib/components/GroupedMovementsView.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let currentDate: string = data.currentDate;

	$: {
		if (browser) {
			const param = new URLSearchParams({ date: currentDate });
			const url = `/history?${param}`;
			goto(url);
		}
	}
</script>

<section class="mb-4 flex flex-col items-end space-y-4">
	<label for="date">Your gym as of:</label>
	<select bind:value={currentDate} class="input-bordered input" id="date">
		{#each data.allDates as date}
			<option value={date}>{date}</option>
		{/each}
	</select>
</section>

<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
	<GroupedMovementsView movements={data.movementsInDateRange} isViewOnly />
</div>
