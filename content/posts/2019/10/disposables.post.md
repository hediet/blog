---
date: 2019-10-04
title: The Disposable Pattern in TypeScript
---

JavaScript and TypeScript developers are used to implement life cycles and side effects imperatively.
Examples are `setInterval`/`clearInterval` for starting and stopping a timer
and `addEventListener`/`removeEventListener` for adding and removing an event listener.
The JavaScript browser API has much more such examples.

This principle is adopted for own code too, which often results in something similar to this:

```ts
class MyClass {
    private handle: number;
    public start(): void {
        this.handle = setInterval(() => {
            // ...
        }, 1000);
    }

    public stop(): void {
        clearInterval(this.handle);
    }
}

class MyService {
    private myClass = new MyClass();

    public foo(): void {
        // ...
        this.myClass.start();
        // ...
    }

    public bar(): void {
        // ...
        this.myClass.stop();
        // ...
    }
}
```

This is verbose, hard to read and maintain and prone to bugs
since it is easy to forget calling the right method for cleanup.

But it also leads to unclear architecture:
How are `MyClass` and `MyService` associated?
What is the structure of `MyClass`?

## Thinking in Components

When thinking in components,
instead of having in mind that you set and clear an interval in `MyClass`,
you would think of `MyClass` as something that composes an interval component.

The idea of components is that they have a specific lifetime that starts on construction and ends on destruction.
When modeling components in JS with classes,
the `constructor` marks the beginning of the lifetime.
As JS classes have no destructors, a method named `dispose` is commonly used to
mark the end of a component's lifetime.

This is how `MyClass` would be implemented when thinking in components.
Rather than starting an interval, we now compose a new interval.
The effect is the same, but the meaning is different:

```ts
class MyClass {
    public readonly timer: Disposable;

    constructor() {
        this.timer = createInterval(() => {
            // ...
        }, 1000);
    }

    public dispose(): void {
        this.timer.dispose();
    }
}
```

As such components provide an abstraction for how to destroy them,
a `Disposer` component could be used for composing components in a way that
you cannot forget to dispose all sub-components:

```ts
class MyClass {
    private readonly disposer = new Disposer();

    constructor() {
        this.disposer.track(
            createInterval(() => {
                // ...
            }, 1000)
        );
    }

    public dispose(): void {
        this.disposer.dispose();
    }
}
```

When `disposer` would dispose all its tracked components when called as method, it could be used directly as the `dispose` method, making the code even shorter:

```ts
class MyClass {
    public readonly dispose = Disposable.fn();

    constructor() {
        this.dispose.track(
            createInterval(() => {
                // ...
            }, 1000)
        );
    }
}
```

The downside of using such a function `Disposable.fn` in the presented way is
that it publicly exposes its API to track and untrack disposables.

If implemented with components in mind, it becomes now clear that `MyService`
composes zero or one instances of `MyClass`:

```ts
class MyService {
    public readonly dispose = Disposable.fn();
    private myClass: MyClass | undefined = undefined;

    public foo() {
        // ...
        assert(this.myClass === undefined);
        this.myClass = this.dispose.track(new MyClass());
        // ...
    }

    public bar() {
        // ...
        assert(this.myClass !== undefined);
        this.dispose.untrack(this.myClass).dispose();
        this.myClass = undefined;
        // ...
    }
}
```

The use of `Disposable.fn` ensures that the instance of `MyClass`
is also disposed when `bar` is not called.
