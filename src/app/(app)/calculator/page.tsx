// /calculator — protected page hosting the futures calculator.
// (Pre-trade checklist moved to /coach.)
import { CalculatorForm } from "@/features/calculator/calculator-form";

export const metadata = { title: "Calculator" };

export default function CalculatorPage() {
    return <CalculatorForm />;
}
