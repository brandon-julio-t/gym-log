import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import { writable } from 'svelte/store';

export const currentMovement = writable<IMovementTransaction | null>(null);
