import { writable } from 'svelte/store';

/**
 * @template T
 * @param {T} initial
 * @returns {import('svelte/store').Readable<{ first: boolean, last: boolean }> & {
 *   push: (value: T) => T;
 *   undo: () => T;
 *   redo: () => T;
 * }}
 */
export function createStack(initial) {
	/** @type {T[]} */
	const stack = [initial];

	let index = stack.length;

	const state = writable({
		first: true,
		last: true
	});

	function update() {
		state.set({
			first: index === 1,
			last: index === stack.length
		});
	}

	return {
		push: (value) => {
			stack.length = index;
			stack.push(value);
			index = stack.length;

			update();

			return value;
		},
		undo: () => {
			if (index > 1) index -= 1;

			update();

			return stack[index - 1];
		},
		redo: () => {
			if (index < stack.length) index += 1;

			update();

			return stack[index - 1];
		},
		subscribe: state.subscribe
	};
}
