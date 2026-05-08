// /calculator — protected page hosting the futures calculator.
// Server Component (no 'use client'); the form itself is a Client Component.
import { CalculatorForm } from "@/features/calculator/calculator-form";

export default function CalculatorPage() {
    return <CalculatorForm />;
}
