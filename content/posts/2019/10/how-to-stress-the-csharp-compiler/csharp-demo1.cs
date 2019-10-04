using System;

class True {}
class False {}

class Program {
    // `Or` can only be called if one of its arguments is of type True.
    // I.e. `Or(new False(), new False())` won't be accepted by the type checker.
    static void Or(True a, object b) {}
    static void Or(False a, True b) {}
    
    static True Not(False a)  => new True();
    static False Not(True a) => new False();

    // Var introduces a variable whose type can be True or False,
    // depending on which overloading the compiler choses.
    static object Var(Func<True, object> f) => null;
    static object Var(Func<False, object> f) => null;

    static void Main() {
        // This states that 3 pigeons fit into 2 pigeon holes.
        // This is obviously false, thus the type checker will complain that False cannot be assigned to True.
        Var(p1h1 => Var(p1h2 =>   // Pigeon 1 can be in hole 1 or 2.
        Var(p2h1 => Var(p2h2 =>   // Pigeon 2 can be in hole 1 or 2.
        Var(p3h1 => Var(p3h2 => { // Pigeon 3 can be in hole 1 or 2.
            // A conjunction of disjunctions follows.
            // This example is a 2-SAT instance (every disjunction has at most 2 literals)
            // and could be solved in polynomial time.
            // By extending `or` to 3 arguments, we get 3-SAT which is NP-complete.
            // No algorithm is known to solve any NP-complete problem in polynomial time.

            // Every pigeon is in at least one hole.
            Or(p1h1, p1h2);
            Or(p2h1, p2h2);
            Or(p3h1, p3h2);

            // No two pigeons are in hole 1.
            Or(Not(p1h1), Not(p2h1));
            Or(Not(p1h1), Not(p3h1));
            Or(Not(p2h1), Not(p3h1));

            // No two pigeons are in hole 2.
            Or(Not(p1h2), Not(p2h2));
            Or(Not(p1h2), Not(p3h2));
            Or(Not(p2h2), Not(p3h2));

            return null;
        }))))));
    }
}