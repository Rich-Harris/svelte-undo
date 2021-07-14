import { writable } from 'svelte/store';

/**
 * @template T
 * @param {T} value
 * @returns {import('svelte/store').Readable<{ first: boolean, last: boolean, current: T }> & {
 *   push: (value: T) => T;
 *   undo: () => T;
 *   redo: () => T;
 * }}
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
		push: (value) => {
			stack.length = index;
			stack[index++] = value;

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
