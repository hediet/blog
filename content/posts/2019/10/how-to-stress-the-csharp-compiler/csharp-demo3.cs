using Internal;
// This namespace is meant to be within its own assembly
// so that users cannot use non-public members of it (hence the name).
namespace Internal {
    // This represents a stack. Two stacks make up the tape of a turing machine.
    // `TSymbol` is the top most symbol, `TRestStack` the stack without `TSymbol`.
    public class Stack<TSymbol, TRestStack> {}
    // In case of turing machines, we need infinitly deep stacks.
    // `Sym1` is our blank symbol here and
    // fills the eternal deepness of our infinitly deep stacks:
    // Whenever we encounter an `EmptyStack`, C# can unfold it to
    // a stack having `Sym1` as topmost symbol and `EmptyStack` as the rest.
    public class EmptyStack : Stack<Sym1, EmptyStack> {}

    // `Sym1` and `Sym2` represent the tape alphabet, in this case consisting of 2 symbols.
    public class Sym1 {} public class Sym2 {}

    // Now we declare the states of our turing machine.
    // Later we want to encode the busy beaver machine with 4 states, so we need 4 of them.
    // An (S, Q)-busy beaver is the turing machine that has the longest
    // runtime (but still comes to an halt) when started on an empty tape
    // among all turing machines using |S| tape symbols and |Q| states.
    // In case of S={Sym1, Sym2} and Q={State1, State2, State3, State4},
    // the busy beaver will take 107 steps until it halts.
    // Every machine using |S| symbols and |Q| states that
    // still doesn't halt after 107 steps will never do so.
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

    // There is no other C# interface that is harder to implement than this one:
    // It can only be implemented if there are extension methods that describe
    // a turing machine that halts!
    // Figuring out whether a turing machine halts, even on the empty tape,
    // is pretty hard.
    public interface IChallenge {
        FinalConfig Run(InitialConfig config);
    }

    // The extension methods provided by this static class describe the
    // step semantics of the 4-state busy beaver turing machine on a tape with 2 symbols.
    // Each method represents a rule that matches against a machine configuration
    // and returns the type of the next configuration.
    // I generated these rules from a more readable representation of the turing machine.
    public static class BusyBeaver4State2Symbols {
        public static IConfig<State2, Stack<Sym2, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State1, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State2, Stack<Sym2, TLeftStack>, TSymbol, TRightStack>(); }
        public static IConfig<State2, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State1, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State2, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State1, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State2, Stack<TSymbol, TLeftStack>, Sym1, TRightStack> m) { return new ArbitraryConfig<State1, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State3, TLeftStack, TSymbol, Stack<Sym1, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State2, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State3, TLeftStack, TSymbol, Stack<Sym1, TRightStack>>(); }
        public static FinalConfig Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State3, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new FinalConfig(); }
        public static IConfig<State4, TLeftStack, TSymbol, Stack<Sym2, TRightStack>> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State3, Stack<TSymbol, TLeftStack>, Sym2, TRightStack> m) { return new ArbitraryConfig<State4, TLeftStack, TSymbol, Stack<Sym2, TRightStack>>(); }
        public static IConfig<State4, Stack<Sym2, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State4, TLeftStack, Sym1, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State4, Stack<Sym2, TLeftStack>, TSymbol, TRightStack>(); }
        public static IConfig<State1, Stack<Sym1, TLeftStack>, TSymbol, TRightStack> Step<TRightStack, TLeftStack, TSymbol>(
                 this IConfig<State4, TLeftStack, Sym2, Stack<TSymbol, TRightStack>> m) { return new ArbitraryConfig<State1, Stack<Sym1, TLeftStack>, TSymbol, TRightStack>(); }
    }
}

class Program : IChallenge {
    static void Main() {
        var c = new InitialConfig();
        FinalConfig f = new Program().Run(c);
    }

    public FinalConfig Run(InitialConfig c) {
        // The Busy Beaver Turing Machine with 4 states and 2 letters takes 107 steps to halt.
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