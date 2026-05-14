// /calculator — protected page hosting the futures calculator + pre-trade checklist.
import { CalculatorForm } from "@/features/calculator/calculator-form";
import { ChecklistCard } from "@/features/checklist/checklist-card";
import { fetchChecklistItems } from "@/features/checklist/server";
import { getUserTier } from "@/features/billing/tier";

export const dynamic = "force-dynamic";

export default async function CalculatorPage() {
    const [items, tier] = await Promise.all([
        fetchChecklistItems(),
        getUserTier(),
    ]);

    return (
        <div className="flex flex-col gap-4">
            <CalculatorForm />
            <ChecklistCard items={items} isPaid={tier.isPaid} />
        </div>
    );
}
