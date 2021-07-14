# svelte-undo

A small utility for managing an undo stack, that you can subscribe to in your Svelte applications (or indeed anywhere else).

[Demo here](https://svelte.dev/repl/5af74b1765414b46927414815a6477d1?version=3.38.3).

## Usage

```js
import { createStack } from 'svelte-undo';

let value = { answer: 42 };

const stack = createStack(value);

// undo/redo have no effect if we're at the
// beginning/end of the stack
console.log((value = stack.undo())); // { answer: 42 }
console.log((value = stack.redo())); // { answer: 42 }

// stack.push returns the new value
value = stack.push({ answer: 43 });
value = stack.push({ answer: 44 });
value = stack.push({ answer: 45 });

console.log(value); // { answer: 45 }

console.log((value = stack.undo())); // { answer: 44 }
console.log((value = stack.undo())); // { answer: 43 }
console.log((value = stack.undo())); // { answer: 42 }
console.log((value = stack.undo())); // { answer: 42 }

console.log((value = stack.redo())); // { answer: 43 }

// pushing clears anything 'forward' in the stack
value = stack.push({ answer: 99 });

// you can also pass a function to `push`
value = stack.push((value) => ({ answer: value.answer + 1 }));

console.log((value = stack.undo())); // { answer: 99 }
console.log((value = stack.undo())); // { answer: 43 }
console.log((value = stack.redo())); // { answer: 99 }
console.log((value = stack.redo())); // { answer: 100 }
console.log((value = stack.redo())); // { answer: 100 }

// you can subscribe to the state of the undo stack
const unsubscribe = stack.subscribe(($stack) => {
	console.log($stack.first); // false
	console.log($stack.last); // true — we're currently at the end of the stack
	console.log($stack.current); // { answer: 99 }
});

unsubscribe();
```

In a Svelte component, you can reference `first` and `last` as store properties without manually subscribing:

```svelte
<button disabled={$stack.first} on:click={() => value = stack.undo()}>Undo</button>
<button disabled={$stack.last} on:click={() => value = stack.redo()}>Redo</button>
```

You can also access the current value of the stack, if that's preferable to tracking the value manually:

```svelte
<h1>The answer is {$stack.current.answer}</h1>
```

Don't mutate the objects you push to the undo stack; chaos will result. Instead, create a fresh copy each time, either manually or using something like [Immer](https://immerjs.github.io/immer/).

## License

MIT
