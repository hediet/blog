# Semantic Functions

```ts
async function listUsers(): User[] {
    const items = this.api.fetchUsers();
    return items.reduce(
        [],
        (prev, cur) => {
            if (prev.findIndex(item => item.id == cur.id) > -1) {
                if (cur !== undefined) {
                    return [...prev, cur];
                }
            }
            return prev;
        },
        []
    );
}
```

```ts
async function listUsers(): User[] {
    const items = this.api.fetchUsers();
    return removeDuplicatesAndUndefined(items);
}

function removeDuplicatesAndUndefined(users: (User | undefined)[]): User[] {
    return users.reduce(
        [],
        (prev, cur) => {
            if (cur !== undefined) {
                if (prev.findIndex(user => user.id == cur.id) > -1) {
                    return [...prev, cur];
                }
            }
            return prev;
        },
        []
    );
}
```

```ts
async function listUsers(): User[] {
    const items = this.api.fetchUsers();
    return distinctByKey(items.filter(isDefined), user => user.id);
}

function isDefined<T>(obj: T | undefined): obj is T {
    return obj !== undefined;
}

function distinctByKey<T, TKey>(
    items: T[],
    keySelector: (item: T) => TKey
): T[] {
    // ...
}
```
