---
date: 2019-07-02
---

# The Disposable Pattern in TypeScript

JavaScript developers are used to implement life cycles imperatively:
For starting a timer there is `setInterval`, for stopping `clearInterval`.
For adding an event listener there is `addEventListener` and for removing `removeEventListener`.
The JavaScript browser API has much more such examples.

This principle is adopted for custom APIs too, which often results in code like this:

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

const myClass = new MyClass();
myClass.start();
// ...
myClass.stop();
```

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

const myClass = new MyClass();
// ...
myClass.dispose();
```
