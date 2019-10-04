class True {} class False {}

class Program {
    static void Main() {
        Var(x1 => Var(x2 => Var(x3 => Var(x4 => Var(x5 => Var(x6 => Var(x7 => Var(x8 =>
            Var(x9 => Var(x10 => Var(x11 => Var(x12 => Var(x13 => Var(x14 => Var(x15 => Var(x16 =>
                Var(x17 => Var(x18 => Var(x19 => Var(x20 => Var(x21 => Var(x22 => Var(x23 => Var(x24 =>
                    null
                ))))))))
            ))))))))
        ))))))));
    }

    static object Var(System.Func<True, object> f) => null;
    static object Var(System.Func<False, object> f) => null;
}