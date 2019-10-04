using System;

class Foo<T1, T2> { public Foo<Foo<T1, T2>, Foo<T1, T2>> f; }

class Program {
    static void Main() {
        var f = new Foo<string, string>();
        var x = f.f.f.f.f.f.f.f.f.f.
                f.f.f.f.f.f.f.f.f.f.
                f.f.f.f.f.f.f.f.f.f.
                f.f.f.f.f.f.f.f.f.f.
                f.f.f.f.f.f.f.f.f.f.
                f.f.f.f.f.f;
    }
}