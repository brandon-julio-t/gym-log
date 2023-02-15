import type IMovementTransaction from '$lib/contracts/IMovementTransaction';
import { writable } from 'svelte/store';

export const movementForm = writable<IMovementForm>({
    movement: null,
    isEdit: false,
});

interface IMovementForm {
    movement: IMovementTransaction | null;
    isEdit: boolean;
}
