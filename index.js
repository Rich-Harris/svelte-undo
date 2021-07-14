import { writable } from 'svelte/store';

/**
 * @template T
 * @param {T} current
 */
export function createStack(current) {
	/** @type {T[]} */
	const stack = [current];

	let index = stack.length;

	const state = writable({
		first: true,
		last: true,
		current
	});

	function update() {
		current = stack[index - 1];

		state.set({
			first: index === 1,
			last: index === stack.length,
			current
		});

		return current;
	}

	return {
		/** @param {T | ((current: T) => T)} value */
		push: (value) => {
			stack.length = index;
			stack[index++] =
				typeof value === 'function' ? /** @type {(current: T) => T} */ (value)(current) : value;

			return update();
		},
		undo: () => {
			if (index > 1) index -= 1;
			return update();
		},
		redo: () => {
			if (index < stack.length) index += 1;
			return update();
		},
		subscribe: state.subscribe
	};
}
