# svelte-undo

A small utility for managing an undo stack, that you can subscribe to in your Svelte applications (or indeed anywhere else).

## Usage

```js
import { createStack } from 'svelte-undo';

let value = { answer: 42 };

const stack = createStack(value);

// undo/redo have no effect if we're at the
// beginning/end of the stack
console.log(value = stack.undo()); // { answer: 42 }
console.log(value = stack.redo()); // { answer: 42 }

// stack.push returns the pushed value
value = stack.push({ answer: 43 });
value = stack.push({ answer: 44 });
value = stack.push({ answer: 45 });

console.log(value); // { answer: 45 }

console.log(value = stack.undo()); // { answer: 44 }
console.log(value = stack.undo()); // { answer: 43 }
console.log(value = stack.undo()); // { answer: 42 }
console.log(value = stack.undo()); // { answer: 42 }

console.log(value = stack.redo()); // { answer: 43 }

// pushing clears anything 'forward' in the stack
value = stack.push({ answer: 99 });

console.log(value = stack.redo()); // { answer: 99 }
console.log(value = stack.undo()); // { answer: 43 }
console.log(value = stack.redo()); // { answer: 99 }
console.log(value = stack.redo()); // { answer: 99 }

// you can subscribe to the state of the undo stack
const unsubscribe = stack.subscribe(state => {
	console.log(state.first); // false
	console.log(state.last); // true — we're currently at the end of the stack
});

unsubscribe();
```

In a Svelte component, you can reference `first` and `last` as store properties without manually subscribing:

```svelte
<button disabled={$stack.first} on:click={() => value = stack.undo()}>Undo</button>
<button disabled={$stack.last} on:click={() => value = stack.redo()}>Redo</button>
```

Don't mutate the objects you push to the undo stack; chaos will result. Instead, create a fresh copy each time, either manually or using something like [Immer](https://immerjs.github.io/immer/).

## License

MIT