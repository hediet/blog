---
date: 2019-10-04 12:00
title: How to Stress the C# Compiler
id: how-to-stress-the-csharp-compiler
---

C# is (mostly) a strongly typed programming language.
It's type system supports generics, inference, and method overloading.
Combining these features, any C# compiler can easily be knocked out.
This blog article demonstrates a few approaches.
One of them knocks out the programmer more than the compiler, but that's not so important.

## C# is NP hard

Deciding whether a C# program is valid, i.e. parses and typechecks without errors, is NP hard.
The still unsolved P≠NP conjecture implies that there is no algorithm than can solve any NP hard problem in polynomial time!
This means that there are relatively short programs that will keep any C# compiler busy for quite a while, assuming the compiler correctly type checks the program.

To prove that C# is NP hard, it is sufficient to show that the type checker can be used to check whether a given boolean 3-SAT formula is satisfiable.
A 3-SAT formula is a conjunction (`&&`) of disjunctions (`||`) so that
each disjunction consists of at most three literales whereas
each literal is either a variable (`x`) or a negated variable (`!x`).

The idea is not hard to understand, so let's dive straight into the annotated code for an exemplary formula.

```cs
using System;

// These two classes will represent the two states of a boolean variable.
class True {}
class False {}

class Program {
    // The `Or` method can only be called if one of its arguments is of type True.
    // `Or(new False(), new False())` won't be accepted by the type checker,
    // while `Or(new True(), new False())` and `Or(new False(), new True())` are.
    static void Or(True a, object b) {}
    static void Or(False a, True b) {}

    // Not just inverts the argument.
    static True Not(False a)  => new True();
    static False Not(True a) => new False();

```

At this point, we can express boolean statements which are typechecked if and only if they are true.
For boolean 3-SAT formulas, however, we need variables.
As it turns out, we can easily bring variables into existence by using C#'s lambdas.
Using overloads, we can then let the compiler decide whether the variable should be of type `True` or `False`.

```cs
    // Var introduces a variable whose type can be True or False,
    // depending on which overload the compiler choses.
    static object Var(Func<True, object> f) => null;
    static object Var(Func<False, object> f) => null;

```

This is everything we need!
The following code states that 3 pigeons fit into 2 pigeon holes.
Even though this is a 2-SAT formula, 3-SAT formulas are expressed analogous.
This is obviously false, thus the type checker will complain that `False` cannot be assigned to `True`.
First we spawn several variables that the type checker can chose to be `True` or `False`,
then we constrain these variables to our problem.

```cs
    static void Main() {
        // Pigeon 1 can be in hole 1 or 2.
        Var(p1_in_h1 => Var(p1_in_h2 =>
        // Pigeon 2 can be in hole 1 or 2.
        Var(p2_in_h1 => Var(p2_in_h2 =>
        // Pigeon 3 can be in hole 1 or 2.
        Var(p3_in_h1 => Var(p3_in_h2 => {
            // Every pigeon is in at least one hole.
            Or(p1_in_h1, p1_in_h2);
            Or(p2_in_h1, p2_in_h2);
            Or(p3_in_h1, p3_in_h2);

            // No two pigeons are in hole 1.
            Or(Not(p1_in_h1), Not(p2_in_h1));
            Or(Not(p1_in_h1), Not(p3_in_h1));
            Or(Not(p2_in_h1), Not(p3_in_h1));

            // No two pigeons are in hole 2.
            Or(Not(p1_in_h2), Not(p2_in_h2));
            Or(Not(p1_in_h2), Not(p3_in_h2));
            Or(Not(p2_in_h2), Not(p3_in_h2));

            return null;
        }))))));
    }
}
```

If the compiler can chose overloads of `Var` so that
the entire body typechecks, the boolean formula is satisfiable and there is also only one unique variable assignment.
The concrete chosen overloads reveal how to assign the variables so that the formula becomes true.
If there are multiple variable assignments that satisfy the formula, the type checker will complain that the overload is ambigue.

As this reduction works for all 3-SAT instances, we showed that C# and in particular type checking is NP hard!
P≠NP now promises that there are C# programs causing an exponential runtime of the type checker.
As it turns out, the Microsoft C# compiler _Roslyn_ is just brute forcing every possible overload,
so this simple code is already sufficient to cause an eternal compile time:

```cs
class True {} class False {}

class Program {
    static void Main() {
        Var(x1 => Var(x2 => Var(x3 => Var(x4 => Var(x5 =>
            Var(x6 => Var(x7 => Var(x8 => Var(x9 => Var(x10 =>
                Var(x11 => Var(x12 => Var(x13 => Var(x14 => Var(x15 =>
                    Var(x16 => Var(x17 => Var(x18 => Var(x19 => Var(x20 =>
                        Var(x21 => Var(x22 => Var(x23 => Var(x24 =>
                            null
                        ))))
                    )))))
                )))))
            )))))
        )))))
    }

    static object Var(System.Func<True, object> f) => null;
    static object Var(System.Func<False, object> f) => null;
}
```

It might seem simple to drastically improve Roslyn's compile time on this example,
but regardless of what clever optimizations are added to Roslyn's overload resolution algorithm,
if P≠NP, there are always examples that cause an exponential runtime of the type checker!

## C# can be used to prove that a Turing Machine halts

C# generics are always fun to play with. They provide a very constrained macro system
that allows to describe rules that expand and, using extension methods, collapse types.
Together, they can be used to derive words from context sensitive grammars step by step.

As the execution of a turing machine on an empty tape can be encoded as a derivation of a context sensitive grammar,
it is no wonder that we can design an API in C# that can only be called when the user proves that the given turing machine halts.
This, however, merely stresses the compiler but much more the programmar. We will see later how we can use that against the compiler!
It also shows that it is undecidable whether a given C# interface can be implemented typesafely (ignoring `null` values and explicit type casts)!
This is undecidable, even though the only requirement is a typesafe but otherwise arbitrary implementation!

If you forgot what turing machines are, I don't blame you, they are rarely ever used
and in general not useful for anything pratical. You can find a
[refresher here](https://www.cl.cam.ac.uk/projects/raspberrypi/tutorials/turing-machine/one.html)
and a really nice [playground here](http://turingmachine.io/).

Lets have look at how turing machines can be encoded in C#.

```cs
using Internal;

// This namespace is meant to be within its own assembly
// so that users cannot use non-public members of it (hence the name).
namespace Internal {
```

The following class represents a stack. Two stacks make up the tape of a turing machine.
`TSymbol` is the top most symbol, `TRestStack` the stack without `TSymbol`.

```cs
    public class Stack<TSymbol, TRestStack> {}
```

In case of turing machines, we need infinitly deep stacks.
`Sym1` is our blank symbol here and
fills the eternal deepness of our infinitly deep stacks:
Whenever we encounter an `EmptyStack`, C# can unfold it to
a stack having `Sym1` as topmost symbol and `EmptyStack` as the rest.

```cs
    public class EmptyStack : Stack<Sym1, EmptyStack> {}
```

`Sym1` and `Sym2` represent the tape alphabet, in this case consisting of 2 symbols.

```cs
    public class Sym1 {} public class Sym2 {}
```

Now we declare the states of our turing machine.
Later we want to encode the busy beaver machine with 4 states, so we need 4 of them.
An (S, Q)-busy beaver is the turing machine that has the longest
runtime (but still comes to an halt) when started on an empty tape
among all turing machines using |S| tape symbols and |Q| states.
In case of S={Sym1, Sym2} and Q={State1, State2, State3, State4},
the busy beaver will take 107 steps until it halts.
Every machine using |S| symbols and |Q| states that
still doesn't halt after 107 steps will never do so.

```cs
    public class State1 {} public class State2 {}
    public class State3 {} public class State4 {}

    // These classes can only be constructed within this assembly,
    // as their constructor is internal.
    public class Secret { internal Secret() {} }
    // Only the `BusyBeaver4State2Symbols` class below can create the final config.
    public class FinalConfig { internal FinalConfig() {} }

    // We need this interface to make the configuration covariant in its stack parameters.
    // It allows the compiler to unfold
    // `Config<..., EmptyStack, ...>` to
    // `Config<..., Stack<Sym1, EmptyStack>, ...>`.
    public interface IConfig<TState, out TLeftStack, TSymbol, out TRightStack> {
        // This prevents a user to implement their own config and thus
        // working around the Step semantics of the turing machine defined below.
        // A (non-null) secret can only be instantiated in this assembly.
        Secret getSecret();
    }

    // This class is only visible in this assembly,
    // it represents an arbitrary configuration.
    class ArbitraryConfig<TState, TLeftStack, TSymbol, TRightStack>
        : IConfig<TState, TLeftStack, TSymbol, TRightStack> {
        public Secret getSecret() { return new Secret(); }
    }

    // This class can be used from the outside but only represents the initial config.
    public class InitialConfig : IConfig<State1, EmptyStack, Sym1, EmptyStack> {
        public Secret getSecret() { return new Secret(); }
    }
```

There is no other C# interface that is harder to implement than `IChallenge`:
It can only be implemented if there are extension methods that describe a turing machine that halts!
Figuring out whether a turing machine halts, even on the empty tape, is pretty hard.

```cs
    public interface IChallenge {
        FinalConfig Run(InitialConfig config);
    }
```

The extension methods provided by the static class `BusyBeaver4State2Symbols` describe the
step semantics of the 4-state busy beaver turing machine on a tape with 2 symbols.
Each method represents a rule that matches against a machine configuration
and returns the next configuration.
For example, if we would like to remove an item from a stack,
we match against the type `Stack<TSymbol, TRest>` with TSymbol and TRest
being arbitrary types that are inferred by the C# type checker and return `TRest`.

I generated the following rules from a more readable representation of the turing machine.

```cs
    public static class BusyBeaver4State2Symbols {
        // This is the final step. After reaching this configuration, the turing machine halts.
        public static FinalConfig Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State3, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new FinalConfig(); }
        // These are all the other rules. Don't try to understand the busy beaver rules.
        public static IConfig<State2, Stack<Sym2, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State1, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State2, Stack<Sym2, TLeftStack>, TSymbol, TRightStack>(); }
        public static IConfig<State2, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State1, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State2, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State1, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State2, Stack<TSymbol, TLeftStack>, Sym1, TRightStack> m) { return new ArbitraryConfig<State1, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State3, TLeftStack, TSymbol, Stack<Sym1, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State2, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State3, TLeftStack, TSymbol, Stack<Sym1, TRightStack>>(); }
        public static IConfig<State4, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State3, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State4, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State4, Stack<Sym2, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State4, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State4, Stack<Sym2, TLeftStack>, TSymbol, TRightStack>(); }
        public static IConfig<State1, Stack<Sym1, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State4, TLeftStack, Sym2, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State1, Stack<Sym1, TLeftStack>, TSymbol, TRightStack>(); }
    }
}

```

And here it is: The proof that our turing machine halts!

```cs
class Program : IChallenge {
    static void Main() {
        FinalConfig f = new Program().Run(new InitialConfig());
    }

    public FinalConfig Run(InitialConfig c) {
        // The Busy Beaver TM with 4 states and 2 symbol takes 107 steps to halt.
        return c.Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step().Step().Step().Step()
            .Step().Step().Step().Step().Step().Step().Step();
    }
}
```

Admittedly, just repeating `.Step()` until the turing machine halts does not sound that hard - until it doesn't halt, then you never now when to stop!

However, if you still want to make it more challenging to use your API, you can
encode a non-deterministic turing machine that only halts when chosing the right steps.
Rather than having a single `Step` method, you would have a method for every non-deterministic transition.
This is NP-hard by definition!

Note that this construction does not show that C#'s type system is turing complete!
It would be turing complete though, if, given a program P, `P: string = a + b + c`,
the type checker had to decide whether a `k: int` exists such that `P' := a + b^k + c` is type correct.

## Generic type instantiations can grow exponentially fast

We can also use generics to instantiate a very, very large type without much code:

```cs
using System;

// The type of `f` is two times larger than the type of Foo<T1, T2>.
class Foo<T1, T2> { public Foo<Foo<T1, T2>, Foo<T1, T2>> f; }

class Program {
    static void Main() {
        var f = new Foo<string, string>();

        // The type of `x` is very large.
        var x = f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f
               .f.f.f.f.f.f.f.f.f.f;
    }
}
```

This will crash the C# compiler due to memory limitations.
However, if Roslyn would share type instantiations and not copy them for every instantiation
(at least I guess this is what Roslyn is doing),
the last example could be checked in linear time.

## A Parser that does Backtracking

I couldn't figure out how to crash Roslyn with this one, but maybe you can.
Given this piece of code, what would you expect from the compiler?

```cs
class Program {
    public static void Main() {
        int f = 0; int x = 0; int y = 0;
        System.Console.WriteLine(
            "{0} {1}",
            f < x, // is f smaller than x?
            y > (1) // is y greater than 1?
        );
    }
}
```

The type checker will reject it, since `x` and `y` are used as types, but they aren't!

If the code is formatted differently, the problem becomes clear:

```cs
class x {} class y {}
class Program {
    public static int f<T1, T2>(int i) { return i; }
    public static void Main() {
        System.Console.WriteLine(
            "{0}",
            f<x, y>(1)
        );
    }
}
```

When designing a parser, you don't want to use type information for deciding how to interpret a piece of code,
as you need a parser to compute the type information in the first place (even though C requires it's compilers to do so).
However, in this case, `f<x, y>(1)` can both be a generic method call or two arithmetic comparisons, passed as arguments to `WriteLine`.

I guess, Roslyn just gives generic method calls precendence and that their parser uses backtracking:
Whenever an expression is expected, the parser first tries to parse the expression as method call and only if that fails it reparses it as arithmetic expression.
I wonder whether this backtracking can be exploited to force the parser into an exponential runtime!
Any ideas?

## Outlook

C#'s type system can do surprisingly much, even though, when compared to [TypeScript's turing complete type system](https://github.com/Microsoft/TypeScript/issues/14833), it is quite conservative. But still, C#'s type system is sound while TypeScript's isn't!
