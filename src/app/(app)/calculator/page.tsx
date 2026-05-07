// Placeholder. We'll port the existing vanilla calculator to React in Phase 2.
import { Card, CardTitle } from "@/components/ui/card";

export default function CalculatorPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Calculator</h1>
            <Card>
                <CardTitle>Coming in Phase 2</CardTitle>
                <p className="text-sm text-[var(--color-text-muted)]">
                    We&apos;ll port the existing futures calculator (8 contracts, position sizing, commission-aware math) to a React component here.
                </p>
            </Card>
        </div>
    );
}
