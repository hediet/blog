---
date: 2019-07-02
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
    start() {
        this.handle = setInterval(() => {
            // ...
        }, 1000);
    }

    stop() {
        clearInterval(this.handle);
    }
}

class MyService {
    private myClass = new MyClass();

    public foo() {
        // ...
        this.myClass.start();
        // ...
    }

    public bar() {
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
As JS classes have no destructors, a method named `dispose` is used to
mark the end of a component's lifetime.

This is how `MyClass` would be implemented when thinking in components.
Rather than starting an interval here, we now compose a new interval.
The effect is the same, but the meaning is different:

```ts
class MyClass {
    public readonly timer: Disposable;

    constructor() {
        this.timer = createInterval(() => {
            // ...
        }, 1000);
    }

    dispose() {
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

    dispose() {
        this.disposer.dispose();
    }
}
```

When `disposer` would dispose all its tracked components when called as method, it could be used directly as the `dispose` method, make the code even shorter:

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

If implemented like this, it becomes clear that `MyService`
composes zero or one instances of `MyClass`:

```ts
class MyService {
    public readonly dispose = Disposable.fn();
    private myClass: MyClass | undefined = undefined;

    public foo() {
        // ...
        this.myClass = this.dispose.track(new MyClass());
        // ...
    }

    public bar() {
        // ...
        this.dispose.untrack(this.myClass).dispose();
        this.myClass = undefined;
        // ...
    }
}
```

The use of `Disposable.fn` ensures that the instance of `MyClass`
is also disposed when `bar` is not called.
