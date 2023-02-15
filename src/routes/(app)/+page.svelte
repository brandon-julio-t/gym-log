<script lang="ts">
	import 'crypto';
	import type { PageData } from './$types';
	import Form from './_components/Form.svelte';
	import TodayMovements from './_components/TodayMovements.svelte';

	export let data: PageData;
</script>

<div class="my-8 flex flex-col space-y-4">
	<Form {data} />
	<TodayMovements {data} />
</div>
