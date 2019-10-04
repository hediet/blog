class Program {
    public static void Main() {
        int f = 0; int x = 0; int y = 0;
        System.Console.WriteLine(
            "{0} {1}",
            f < x, // is f smaller than x?
            y > (1) // is y larger than 1?
        );
    }
}

class x {} class y {}
class Program2 {
    public static int f<T1, T2>(int i) { return i; }
    public static void Main2() {
        System.Console.WriteLine(
            "{0}",
            f<x, y>(1)
        );
    }
}