// Public landing page (/).
// Marketing CTAs that route to login/signup.
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
            <div className="max-w-md w-full text-center flex flex-col gap-6">
                <div>
                    <span className="text-[var(--color-accent)] text-2xl">▲</span>
                    <h1 className="text-3xl font-bold tracking-tight mt-2">
                        Futures Calculator
                    </h1>
                    <p className="text-[var(--color-text-muted)] mt-3">
                        Risk &amp; reward, position sizing, prop firm tracking, and a P&amp;L journal — built for serious traders.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Link href="/signup">
                        <Button className="w-full">Create free account</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" className="w-full">I already have an account</Button>
                    </Link>
                </div>

                <p className="text-xs text-[var(--color-text-subtle)]">
                    Not financial advice. Verify all calculations against your broker.
                </p>
            </div>
        </main>
    );
}
