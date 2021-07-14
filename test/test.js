import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { createStack } from '../index.js';

test('returns the first/last value if stack is in initial state', () => {
	const value = { x: 1 };
	const stack = createStack(value);

	assert.is(stack.undo(), value);
	assert.is(stack.redo(), value);
});

test('goes back and forward through history state', () => {
	const stack = createStack({ x: 1 });
	stack.push({ x: 2 });
	stack.push({ x: 3 });
	stack.push((value) => ({ x: value.x + 1 }));

	assert.equal(stack.undo(), { x: 3 });
	assert.equal(stack.undo(), { x: 2 });
	assert.equal(stack.undo(), { x: 1 });
	assert.equal(stack.redo(), { x: 2 });
	assert.equal(stack.redo(), { x: 3 });
	assert.equal(stack.redo(), { x: 4 });
});

test('clears later values when pushing', () => {
	const stack = createStack({ x: 1 });
	stack.push({ x: 2 });
	stack.push({ x: 3 });

	assert.equal(stack.undo(), { x: 2 });
	stack.push({ x: 4 });

	assert.equal(stack.undo(), { x: 2 });
	assert.equal(stack.undo(), { x: 1 });
	assert.equal(stack.redo(), { x: 2 });
	assert.equal(stack.redo(), { x: 4 });
});

test('updates first/last state', () => {
	const stack = createStack({ x: 1 });

	let first = null;
	let last = null;

	const unsubscribe = stack.subscribe((state) => {
		({ first, last } = state);
	});

	assert.equal(first, true);
	assert.equal(last, true);

	stack.push({ x: 2 });
	assert.equal(first, false);
	assert.equal(last, true);

	stack.push({ x: 3 });
	assert.equal(first, false);
	assert.equal(last, true);

	stack.undo();
	assert.equal(first, false);
	assert.equal(last, false);

	stack.undo();
	assert.equal(first, true);
	assert.equal(last, false);

	unsubscribe();
});

test('updates $stack.current', () => {
	const stack = createStack({ x: 1 });

	let current = null;

	const unsubscribe = stack.subscribe((state) => {
		current = state.current;
	});

	assert.equal(current, { x: 1 });

	stack.push({ x: 2 });
	assert.equal(current, { x: 2 });

	stack.push({ x: 3 });
	assert.equal(current, { x: 3 });

	stack.undo();
	assert.equal(current, { x: 2 });

	stack.undo();
	assert.equal(current, { x: 1 });

	unsubscribe();
});

test.run();
