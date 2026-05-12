// Privacy Policy. Reasonable baseline tailored to TradeOS — review and
// customize with a lawyer before any commercial launch.
import { LegalPage } from "@/components/legal-page";

export const metadata = {
    title: "Privacy Policy · TradeOS",
};

export default function PrivacyPage() {
    return (
        <LegalPage title="Privacy Policy" lastUpdated="May 7, 2026">
            <p>
                This Privacy Policy explains what information TradeOS (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the service&rdquo;) collects when you use the app, why we collect it, and how it&apos;s stored. The short version: we collect the minimum needed to give you a working trading journal, and we don&apos;t sell or share your data.
            </p>

            <h2>1. Information we collect</h2>
            <h3>Account information</h3>
            <ul>
                <li><strong>Email address</strong> — used to identify your account and for password resets.</li>
                <li><strong>Password</strong> — stored hashed by our auth provider (Supabase). We never see or store plaintext passwords.</li>
            </ul>
            <h3>Trading data you enter</h3>
            <ul>
                <li>Trades you log (date, contract, direction, prices, contract count, commission, planned risk, notes).</li>
                <li>Prop firm configuration (selected preset or custom rules).</li>
                <li>Calculator inputs (stored locally on your device only).</li>
            </ul>
            <h3>Technical information</h3>
            <ul>
                <li>Authentication cookies (essential — required to keep you signed in).</li>
                <li>Server logs from our hosting provider (Vercel) including IP address and request paths, retained briefly for operational diagnostics.</li>
            </ul>

            <h2>2. How we use your information</h2>
            <ul>
                <li>To provide and maintain the service (authenticate you, store your trades, compute analytics).</li>
                <li>To send transactional emails (account verification, password resets).</li>
                <li>To respond to support requests you initiate.</li>
            </ul>
            <p>We <strong>do not</strong> use your data for advertising, sell it to third parties, or share it with partners for marketing purposes.</p>

            <h2>3. Where your data is stored</h2>
            <ul>
                <li><strong>Supabase</strong> — database + authentication. Servers hosted in the United States.</li>
                <li><strong>Vercel</strong> — application hosting + edge network.</li>
                <li><strong>Forex Factory</strong> — public economic calendar feed (we read this; we don&apos;t send your data to them).</li>
            </ul>
            <p>Your trades and prop firm config are protected by Row Level Security policies — only your account can read or write them, even via direct database access.</p>

            <h2>4. Your rights</h2>
            <ul>
                <li><strong>Access:</strong> view all your trades any time in the Journal tab.</li>
                <li><strong>Export:</strong> download your trades as CSV from Settings or the Journal.</li>
                <li><strong>Correction:</strong> edit or delete any trade individually.</li>
                <li><strong>Deletion:</strong> delete your account from Settings → Danger zone. This permanently removes your trades, prop firm config, and login.</li>
            </ul>
            <p>If you&apos;re in the EU, UK, or California, additional rights may apply under GDPR / UK GDPR / CCPA. Contact us at the email below to exercise them.</p>

            <h2>5. Cookies</h2>
            <p>We use only essential cookies required to keep you signed in. We do not use analytics, advertising, or tracking cookies.</p>

            <h2>6. Security</h2>
            <p>Your data is encrypted in transit (HTTPS) and at rest. Passwords are hashed using industry-standard algorithms by our auth provider. No system is perfectly secure — please use a strong, unique password.</p>

            <h2>7. Children</h2>
            <p>TradeOS is not directed at children under 18. If we discover an account belongs to a minor we will delete it.</p>

            <h2>8. Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date above will reflect any changes. Material changes will be communicated via email when feasible.</p>

            <h2>9. Contact</h2>
            <p>Questions about this policy or your data? Reach out at <a href="mailto:tradeos.support@gmail.com">tradeos.support@gmail.com</a>.</p>
        </LegalPage>
    );
}
