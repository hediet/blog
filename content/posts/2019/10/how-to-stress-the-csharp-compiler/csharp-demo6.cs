using System;

interface Word {}
interface Word<T1> { }
interface Word<T1, T2> { }
interface Word<T1, T2, T3> { }
interface Word<T1, T2, T3, T4> { }

interface Open {}
interface Close {}

interface A : Word<Open, A, A, Close>, Word { }



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
