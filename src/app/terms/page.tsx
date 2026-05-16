// Terms of Service. Baseline tailored to TradeOS — review with a lawyer
// before commercial launch (especially the disclaimer + liability sections).
import { LegalPage } from "@/components/legal-page";

export const metadata = {
    title: "Terms",
};

export default function TermsPage() {
    return (
        <LegalPage title="Terms of Service" lastUpdated="May 7, 2026">
            <p>
                Welcome to TradeOS. By creating an account or using the service you agree to these Terms. If you don&apos;t agree, please don&apos;t use the service.
            </p>

            <h2>1. What TradeOS is</h2>
            <p>
                TradeOS is a tool for futures traders: a calculator for risk &amp; reward, a trade journal, prop firm tracking, an economic calendar, and analytics dashboards. We help you organize your trading; we do not execute trades, hold funds, or provide trading advice.
            </p>

            <h2>2. Not financial advice — important</h2>
            <p>
                <strong>TradeOS is not a financial advisor, broker, or investment adviser.</strong> The calculations, analytics, and explanations shown in the app are informational only. They are not recommendations to buy, sell, or hold any security or futures contract. Trading futures carries substantial risk and is not suitable for everyone. You can lose more than your initial deposit.
            </p>
            <p>
                You are solely responsible for your trading decisions. Always verify calculations against your broker&apos;s figures. Consult a licensed financial professional before making investment decisions.
            </p>

            <h2>3. Your account</h2>
            <ul>
                <li>You must be at least 18 years old.</li>
                <li>You&apos;re responsible for keeping your password secure.</li>
                <li>You&apos;re responsible for all activity that happens under your account.</li>
                <li>One person, one account. Don&apos;t share accounts.</li>
            </ul>

            <h2>4. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul>
                <li>Reverse engineer, scrape, or attempt to access another user&apos;s data.</li>
                <li>Use the service for any illegal purpose.</li>
                <li>Interfere with the service or other users&apos; ability to use it.</li>
                <li>Submit malicious content (malware, spam, etc.).</li>
                <li>Resell or redistribute the service without our permission.</li>
            </ul>

            <h2>5. Your content</h2>
            <p>
                You own all data you enter into TradeOS (your trades, notes, configuration). You grant us a limited license to store, process, and display that data <em>solely</em> for the purpose of providing the service to you. We don&apos;t use your trade data for any other purpose.
            </p>

            <h2>6. Subscription &amp; payment (when launched)</h2>
            <p>
                The current version is free. When paid plans launch, terms specific to billing, refunds, and cancellation will apply and will be presented at the time of subscription. Until then, no charges apply.
            </p>

            <h2>7. Service availability</h2>
            <p>
                We work to keep TradeOS available 24/7 but make no guarantees. The service may be unavailable due to maintenance, outages at our hosting providers (Supabase, Vercel), upstream data feed issues (Forex Factory for the economic calendar), or factors outside our control. We&apos;re not liable for any losses caused by service unavailability.
            </p>

            <h2>8. Disclaimer of warranties</h2>
            <p>
                The service is provided <strong>&ldquo;as is&rdquo;</strong> without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, or non-infringement. We don&apos;t warrant that the service will be uninterrupted, error-free, or that any specific calculation or insight will result in profitable trading.
            </p>

            <h2>9. Limitation of liability</h2>
            <p>
                To the maximum extent permitted by law, TradeOS and its operators are not liable for any indirect, incidental, special, consequential, or punitive damages — including lost profits or trading losses — arising from your use of the service. Total aggregate liability for any claims related to the service is limited to the amount you&apos;ve paid us in the 12 months preceding the claim, or $50, whichever is greater.
            </p>

            <h2>10. Termination</h2>
            <p>
                You can delete your account anytime from Settings. We may suspend or terminate accounts that violate these Terms. Upon termination, your trades and configuration are permanently removed.
            </p>

            <h2>11. Changes to these Terms</h2>
            <p>
                We may update these Terms occasionally. The &ldquo;Last updated&rdquo; date reflects the latest version. Material changes will be announced via email. Continued use of the service after changes means you accept the new Terms.
            </p>

            <h2>12. Governing law</h2>
            <p>
                These Terms are governed by the laws of the jurisdiction where TradeOS&apos;s operator is based. Disputes will be resolved in the courts of that jurisdiction.
            </p>

            <h2>13. Contact</h2>
            <p>Questions about these Terms? Reach out at <a href="mailto:tradeos.support@gmail.com">tradeos.support@gmail.com</a>.</p>
        </LegalPage>
    );
}
