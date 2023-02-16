import { MOVEMENTS_ENTITY_NAME } from '$lib/constants';
import type IMovementTransaction from '$lib/contracts/IMovementTransaction';

export default function saveMovementsIntoLocalStorage(movements: IMovementTransaction[]) {
	localStorage.setItem(MOVEMENTS_ENTITY_NAME, JSON.stringify(movements));
}
