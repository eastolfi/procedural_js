export class MathUtils {
    public static rand_range(a: number, b: number): number {
        return Math.random() * (b - a) + a;
    }

    public static rand_normalish(): number {
        const r = Math.random() + Math.random() + Math.random() + Math.random();
        return (r / 4.0) * 2.0 - 1;
    }

    public static rand_int(a: number, b: number): number {
        return Math.round(Math.random() * (b - a) + a);
    }

    public static lerp(x: number, a: number, b: number): number {
        return x * (b - a) + a;
    }

    public static smoothstep(x: number, a: number, b: number): number {
        x = x * x * (3.0 - 2.0 * x);
        return x * (b - a) + a;
    }

    public static smootherstep(x: number, a: number, b: number): number {
        x = x * x * x * (x * (x * 6 - 15) + 10);
        return x * (b - a) + a;
    }

    public static clamp(x: number, a: number, b: number): number {
        return Math.min(Math.max(x, a), b);
    }

    public static sat(x: number): number {
        return Math.min(Math.max(x, 0.0), 1.0);
    }
}