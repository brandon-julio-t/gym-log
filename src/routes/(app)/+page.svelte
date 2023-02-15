<script lang="ts">
	import type IMovementTransaction from '$lib/contracts/movement-transaction';
	import supabase from '$lib/supabaseClient';
	import 'crypto';
	import type { PageData } from './$types';

	export let data: PageData;

	let name: string;
	let reps: number;
	let weight: number;
	let movements: IMovementTransaction[] = data.movements;

	function handleSubmit() {
		const newMovement: IMovementTransaction = {
			id: crypto.randomUUID(),
			name,
			reps,
			weight,
			created_at: new Date().toISOString()
		};
		movements = [...movements, newMovement];
		syncMovements();
		alert('Movement added!');
	}

	function handleDelete(movement: IMovementTransaction) {
		if (!confirm('Are you sure to delete?')) return;
		const filtered = movements.filter((m) => m.id !== movement.id);
		movements = filtered;
		syncMovements();
		alert('Movement removed!');
	}

	async function syncMovements() {
		if (data.session) {
			const { user } = data.session;

			const now = new Date();
			const nowStr = now.toISOString().slice(0, 'yyyy-mm-dd'.length);
			const newData = movements.map((m) => ({ ...m, user_id: user.id }));

			{
				const { error } = await supabase
					.from('movements')
					.delete()
					.gte('created_at', `${nowStr} 00:00:00`)
					.lte('created_at', `${nowStr} 23:59:59`);

				if (error) {
					return alert('An error occurred when sync data (1).');
				}
			}

			{
				const { error } = await supabase.from('movements').insert(newData);

				if (error) {
					return alert('An error occurred when sync data (1).');
				}
			}
		}

		localStorage.setItem('movements', JSON.stringify(movements));
		alert('Data synced!');
	}
</script>

<div class="my-8 flex flex-col space-y-4">
	<form on:submit|preventDefault={handleSubmit} class="card bg-base-100 shadow-xl">
		<div class="card-body grid grid-cols-1 gap-4 xl:grid-cols-12">
			<section class="flex-col space-y-2 xl:col-span-6">
				<label for="name">Movement name</label>
				<input
					type="text"
					name="name"
					id="name"
					class="input-bordered input col-span-12 w-full"
					placeholder="Movement name"
					required
					bind:value={name}
					list="ice-cream-flavors"
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
					required
					bind:value={weight}
				/>
			</section>

			<section class="flex items-end justify-end xl:col-span-2">
				<button class="btn-primary btn col-span-12 gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Add Movement
				</button>
			</section>
		</div>
	</form>

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
</div>
