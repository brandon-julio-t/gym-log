<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import type { PageData } from '../$types';
	import type { IProgramme } from '../+page';

	export let data: PageData;
	export let programme: IProgramme;

	const dispatch = createEventDispatcher();

	let programmeToBeEdited: IProgramme | null = null;

	function handleNewMovement(programme: IProgramme) {
		programme.movements = [...programme.movements, 'New movement'];

		const newProgrammes = data.programmes.map((p) => (p.id === programme.id ? programme : p));
		localStorage.setItem('programmes', JSON.stringify(newProgrammes));

		invalidateAll();
	}

	function handleStartEdit(programme: IProgramme) {
		programmeToBeEdited = { ...programme };
	}

	function handleDoneEdit() {
		if (!programmeToBeEdited) return;
		const newProgrammes = data.programmes.map((p) =>
			p.id === programmeToBeEdited?.id ? programmeToBeEdited : p
		);
		localStorage.setItem('programmes', JSON.stringify(newProgrammes));
		programmeToBeEdited = null;
		invalidateAll();
	}

	function handleCancelEdit() {
		programmeToBeEdited = null;
		invalidateAll();
	}

	function handleDelete(programme: IProgramme) {
		if (!confirm(`Are you sure to delete programme ${programme.name}?`)) return;
		const filtered = data.programmes.filter((p) => p.id !== programme.id);
		localStorage.setItem('programmes', JSON.stringify(filtered));
		invalidateAll();
	}

	function handleChangeMovementOrder(
		programme: IProgramme,
		movement: string,
		indexToBeSwappedWith: number
	) {
		if (indexToBeSwappedWith < 0 || indexToBeSwappedWith >= programme.movements.length) return;

		const currentIdx = programme.movements.indexOf(movement);
		const temp = programme.movements[indexToBeSwappedWith];
		programme.movements[indexToBeSwappedWith] = movement;
		programme.movements[currentIdx] = temp;

		const newProgrammes = data.programmes.map((p) => (p.id === programme.id ? programme : p));
		localStorage.setItem('programmes', JSON.stringify(newProgrammes));
		invalidateAll();
	}

	function handleDeleteMovement(position: number) {
		const programme = programmeToBeEdited;
		if (!programme) return;
		const movement = programme.movements[position];
		if (!confirm(`Are you sure to delete movement ${movement}?`)) return;
		programme.movements = programme.movements.filter((_, i) => i !== position);
		const newProgrammes = data.programmes.map((p) => (p.id === programme.id ? programme : p));
		localStorage.setItem('programmes', JSON.stringify(newProgrammes));
		invalidateAll();
	}
</script>

<section class="card shadow">
	<div class="card-body">
		{#if programmeToBeEdited}
			<input
				bind:value={programmeToBeEdited.name}
				type="text"
				placeholder="Programme name..."
				class="input-bordered input w-full"
			/>
		{:else}
			<h2 class="card-title flex justify-between">
				<div>
					<button
						on:click={() => dispatch('reorder', { programme, delta: -1 })}
						class="btn-outline btn-ghost btn"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</button>
				</div>
				<div>{programme.name}</div>
				<div>
					<button
						on:click={() => dispatch('reorder', { programme, delta: +1 })}
						class="btn-outline btn-ghost btn"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
						</svg>
					</button>
				</div>
			</h2>
		{/if}

		<section>
			<h3 class="font-medium">Movements</h3>
			<div class="flex flex-col divide-y">
				{#each programme.movements as movement, i}
					<div class="flex items-center justify-between space-x-4 py-4">
						<div>
							<span class="mr-2">{i + 1}.</span>
							{#if programmeToBeEdited}
								<input
									bind:value={programmeToBeEdited.movements[i]}
									type="text"
									placeholder="Movement name..."
									class="input-bordered input my-2"
								/>
								<button on:click={() => handleDeleteMovement(i)} class="btn-error btn"
									>Delete</button
								>
							{:else}
								{movement}
							{/if}
						</div>
						{#if !programmeToBeEdited}
							<div class="flex space-x-2">
								<button
									on:click={() => handleChangeMovementOrder(programme, movement, i - 1)}
									class="btn-outline btn-ghost btn-square btn"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-6 w-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M4.5 15.75l7.5-7.5 7.5 7.5"
										/>
									</svg>
								</button>
								<button
									on:click={() => handleChangeMovementOrder(programme, movement, i + 1)}
									class="btn-outline btn-ghost btn-square btn"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="h-6 w-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19.5 8.25l-7.5 7.5-7.5-7.5"
										/>
									</svg>
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<div>No movement yet.</div>
				{/each}
			</div>
		</section>

		<section class="card-actions justify-end">
			{#if programmeToBeEdited}
				<button on:click={() => handleDoneEdit()} class="btn-primary btn">Done</button>
				<button on:click={() => handleCancelEdit()} class="btn-error btn">Cancel</button>
			{:else}
				<button on:click={() => handleNewMovement(programme)} class="btn">New Movement</button>
				<button on:click={() => handleStartEdit(programme)} class="btn-outline btn-ghost btn">
					Edit
				</button>
				<button on:click={() => handleDelete(programme)} class="btn-error btn">Delete</button>
			{/if}
		</section>
	</div>
</section>
