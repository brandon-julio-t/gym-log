<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
	import 'crypto';
	import { onMount } from 'svelte';
	import type { PageData } from '../$types';
	import syncMovements from '../_logics/syncMovements';
	import { movementForm } from '../_stores/movementForm';

	export let data: PageData;

	let movementIdToUpdate = '';
	let name = '';
	let reps = 0;
	let weight = 0;
	let isEdit = false;

	onMount(() => {
		const unsubscribe = movementForm.subscribe((form) => {
			const { movement, isEdit: _isEdit } = form;
			isEdit = _isEdit;
			name = movement?.name ?? '';
			reps = movement?.reps ?? 0;
			weight = movement?.weight ?? 0;
			movementIdToUpdate = movement?.id ?? '';
		});

		return () => {
			unsubscribe();
		};
	});

	function handleSubmit() {
		if (isEdit) {
			handleUpdateMovement();
		} else {
			handleAddMovement();
		}
	}

	function handleAddMovement() {
		const newMovement: IMovementTransaction = {
			id: crypto.randomUUID(),
			name,
			reps,
			weight,
			created_at: new Date().toISOString()
		};
		const newMovements = [...data.allMovements, newMovement];
		syncMovements(data.session, newMovements);
		invalidateAll();
		alert('Movement added!');
	}

	function handleUpdateMovement() {
		const [movementToUpdate] = data.allMovements.filter((m) => m.id === movementIdToUpdate);

		if (!movementToUpdate) {
			console.log({ movementIdToUpdate });
			return alert('Movement does not exist.');
		}

		const newMovements = data.allMovements.map((m) =>
			m.id === movementIdToUpdate ? movementToUpdate : m
		);

		movementToUpdate.reps = reps;
		movementToUpdate.weight = weight;

		syncMovements(data.session, newMovements);
		invalidateAll();
		alert('Movement updated!');
	}

	function handleCancelUpdate() {
		movementForm.update((form) => ({ ...form, isEdit: false, movement: null }));
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="card bg-base-100 shadow-xl">
	<div class="card-body grid grid-cols-1 gap-4 xl:grid-cols-12">
		<section class="flex-col justify-start space-y-2 xl:col-span-6">
			<label for="name">Movement name</label>
			<input
				type="text"
				name="name"
				id="name"
				class="input-bordered input col-span-12 w-full"
				placeholder="Movement name"
				required
				bind:value={name}
				list="all-movements"
				disabled={isEdit}
			/>
			<datalist id="all-movements">
				<option value="cake" />
				{#each data.groupedMovementKeys as key}
					<option value={key} />
				{/each}
			</datalist>
		</section>

		<section class="flex-col space-y-2 xl:col-span-2">
			<label for="name">Reps</label>
			<input
				type="number"
				name="reps"
				class="input-bordered input col-span-12 w-full"
				placeholder="Reps"
				min={1}
				required
				bind:value={reps}
			/>
		</section>

		<section class="flex-col space-y-2 xl:col-span-2">
			<label for="name">Weight (Kg)</label>
			<input
				type="number"
				name="weight"
				class="input-bordered input col-span-12 w-full"
				placeholder="Weight (kg)"
				min={1}
				step="0.01"
				required
				bind:value={weight}
			/>
		</section>

		<section class="flex flex-col items-end justify-end space-y-4 xl:col-span-2">
			<button class="btn-primary btn-block btn col-span-12">
				{isEdit ? 'Update' : 'Add'} Movement
			</button>

			{#if isEdit}
				<button on:click={handleCancelUpdate} class="btn-secondary btn-block btn col-span-12"
					>Cancel Update</button
				>
			{/if}
		</section>
	</div>
</form>
