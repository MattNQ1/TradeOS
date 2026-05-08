// Hand-written descriptions for the most common recurring economic events.
// No external API, no per-request cost. Speaker events (Powell speaks, etc.)
// are intentionally NOT covered here — they don't have predictable descriptions.

export type Category =
    | "employment"
    | "inflation"
    | "central-bank"
    | "growth"
    | "manufacturing"
    | "services"
    | "housing"
    | "retail"
    | "consumer"
    | "trade"
    | "energy"
    | "general";

export interface CategoryStyle {
    icon: string;          // emoji
    label: string;
    /** Tailwind gradient utility for the modal hero. */
    gradient: string;
    /** Solid accent color for badges. */
    accent: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
    employment:    { icon: "👷", label: "Employment",    gradient: "from-sky-600/40 via-sky-700/20 to-transparent",       accent: "rgb(2 132 199)"   /* sky-600 */ },
    inflation:     { icon: "🔥", label: "Inflation",     gradient: "from-red-600/40 via-rose-700/20 to-transparent",      accent: "rgb(225 29 72)"   /* rose-600 */ },
    "central-bank":{ icon: "🏛️", label: "Central Bank", gradient: "from-violet-600/40 via-purple-700/20 to-transparent", accent: "rgb(124 58 237)"  /* violet-600 */ },
    growth:        { icon: "📈", label: "Growth",        gradient: "from-emerald-600/40 via-green-700/20 to-transparent", accent: "rgb(5 150 105)"   /* emerald-600 */ },
    manufacturing: { icon: "🏭", label: "Manufacturing", gradient: "from-orange-600/40 via-amber-700/20 to-transparent",  accent: "rgb(234 88 12)"   /* orange-600 */ },
    services:      { icon: "💼", label: "Services",      gradient: "from-indigo-600/40 via-blue-700/20 to-transparent",   accent: "rgb(79 70 229)"   /* indigo-600 */ },
    housing:       { icon: "🏠", label: "Housing",       gradient: "from-teal-600/40 via-cyan-700/20 to-transparent",     accent: "rgb(13 148 136)"  /* teal-600 */ },
    retail:        { icon: "🛒", label: "Retail",        gradient: "from-amber-600/40 via-yellow-700/20 to-transparent",  accent: "rgb(217 119 6)"   /* amber-600 */ },
    consumer:      { icon: "🛍️", label: "Consumer",     gradient: "from-pink-600/40 via-rose-700/20 to-transparent",     accent: "rgb(219 39 119)"  /* pink-600 */ },
    trade:         { icon: "🚢", label: "Trade",         gradient: "from-cyan-600/40 via-sky-700/20 to-transparent",      accent: "rgb(8 145 178)"   /* cyan-600 */ },
    energy:        { icon: "⛽", label: "Energy",        gradient: "from-yellow-600/40 via-orange-700/20 to-transparent", accent: "rgb(202 138 4)"   /* yellow-600 */ },
    general:       { icon: "📊", label: "Economic Data", gradient: "from-slate-600/40 via-slate-700/20 to-transparent",   accent: "rgb(71 85 105)"   /* slate-600 */ },
};

export interface EventDescription {
    /** Common short name e.g. "NFP". Optional. */
    aka?: string;
    category: Category;
    /** One-line summary used in the row hint. */
    summary: string;
    /** What the indicator measures (2-3 sentences). */
    explanation: string;
    /** Why traders and the Fed care (1-2 sentences). */
    whyItMatters: string;
    /** Specific market interpretation, e.g. "higher = bullish USD". */
    howToInterpret: string;
}

// ============================================================
// EXACT-MATCH DESCRIPTIONS
// Forex Factory event titles. Match is case-insensitive and ignores
// trailing currency or release qualifiers.
// ============================================================

export const DESCRIPTIONS: Record<string, EventDescription> = {
    // ----- US EMPLOYMENT -----
    "Non-Farm Employment Change": {
        aka: "NFP",
        category: "employment",
        summary: "Monthly count of new US jobs added (excluding farms, govt, households).",
        explanation: "Released the first Friday of each month by the Bureau of Labor Statistics, NFP reports how many jobs the US economy added or lost. It's the single most-watched US economic indicator because employment drives consumer spending, which drives roughly 70% of GDP.",
        whyItMatters: "Strong job growth signals a healthy economy and pressures the Fed to keep rates higher to fight inflation. Weak growth signals slowdown and increases pressure for rate cuts.",
        howToInterpret: "Higher than forecast → bullish USD (Fed stays hawkish). Lower than forecast → bearish USD. Watch the revision to last month too — large revisions can move markets as much as the headline.",
    },
    "ADP Non-Farm Employment Change": {
        aka: "ADP",
        category: "employment",
        summary: "Private-payroll job estimate released two days before NFP.",
        explanation: "ADP processes payrolls for hundreds of thousands of US businesses. They release their employment estimate the Wednesday before the official NFP. Treated as a preview of the BLS report, though correlation is imperfect.",
        whyItMatters: "Markets often move on ADP because it's the first read on job creation that week. A big surprise can pre-position trades ahead of NFP.",
        howToInterpret: "Higher than forecast → bullish USD short-term. Note: ADP and NFP frequently diverge — don't bet the farm on ADP alone.",
    },
    "Unemployment Rate": {
        category: "employment",
        summary: "Percentage of labor force without a job.",
        explanation: "Released alongside NFP. The unemployment rate measures the share of the labor force actively looking for work but unable to find it. Falling rates indicate a tightening job market.",
        whyItMatters: "The Fed has a dual mandate: stable prices AND maximum employment. Falling unemployment can pressure wages up (inflation) and keep the Fed hawkish.",
        howToInterpret: "Lower than forecast → bullish USD (Fed sees more reason to hold rates). Higher → bearish USD.",
    },
    "Average Hourly Earnings m/m": {
        category: "inflation",
        summary: "Month-over-month wage growth — the biggest input to services inflation.",
        explanation: "Reports how much hourly wages changed compared to last month. Released alongside NFP. Wage growth feeds directly into services inflation, which the Fed watches closely.",
        whyItMatters: "Sticky wage growth means inflation stays sticky. The Fed has been explicit that wages running too hot is a key reason to hold rates.",
        howToInterpret: "Higher than forecast → bullish USD (Fed stays hawkish on wage-driven inflation). Lower → bearish USD.",
    },
    "Unemployment Claims": {
        aka: "Initial Jobless Claims",
        category: "employment",
        summary: "Weekly count of new applications for unemployment insurance.",
        explanation: "Released every Thursday at 8:30 AM ET. The most timely labor-market indicator we have — only one week's lag. Reflects layoffs across the US economy.",
        whyItMatters: "Sustained spikes above ~250K signal layoffs are accelerating, which leads to slower spending. The Fed watches this for early signs of labor market weakness.",
        howToInterpret: "Lower than forecast → bullish USD (jobs market still tight). Higher → bearish USD. Look at the 4-week moving average to filter weekly noise.",
    },
    "JOLTS Job Openings": {
        category: "employment",
        summary: "Number of unfilled job openings across the US.",
        explanation: "JOLTS (Job Openings and Labor Turnover Survey) reports total open positions, hires, and separations. Released monthly with a one-month lag.",
        whyItMatters: "When openings far exceed unemployed workers, employers compete on wages, fueling inflation. The Fed watches the openings-to-unemployed ratio closely.",
        howToInterpret: "Higher than forecast → bullish USD (tight labor market). Lower → bearish USD.",
    },

    // ----- US INFLATION -----
    "CPI m/m": {
        aka: "Consumer Price Index",
        category: "inflation",
        summary: "Month-over-month change in consumer prices (headline inflation).",
        explanation: "Tracks the average price change of a fixed basket of goods and services US households buy. Includes food and energy, which can be volatile. Released monthly by the BLS.",
        whyItMatters: "CPI is the headline inflation number every Fed decision orbits around. Sustained CPI above target (2% annualized) keeps the Fed hawkish.",
        howToInterpret: "Higher than forecast → bullish USD (Fed must stay tight). Lower → bearish USD. Markets often react more to Core CPI (next entry).",
    },
    "Core CPI m/m": {
        category: "inflation",
        summary: "CPI excluding food and energy — the Fed's preferred read on underlying inflation.",
        explanation: "Strips out food and energy because those move sharply on weather, geopolitics, and commodity cycles, masking underlying inflation trends. The cleaner read on what monetary policy can actually influence.",
        whyItMatters: "This is what the Fed is really watching when it talks about 'sticky' inflation. Core CPI staying above target drives rate decisions more than headline CPI.",
        howToInterpret: "Higher than forecast → bullish USD (Fed stays hawkish). Lower → bearish USD. Even a 0.1% surprise can move the dollar materially.",
    },
    "CPI y/y": {
        category: "inflation",
        summary: "Year-over-year change in consumer prices.",
        explanation: "Same data as CPI m/m but compared against the same month last year, smoothing out monthly noise. The number journalists usually quote ('inflation is at 3.2%').",
        whyItMatters: "The Fed targets ~2% annual inflation. The y/y number tells you how far from target we are.",
        howToInterpret: "Higher than forecast → bullish USD. Lower → bearish USD.",
    },
    "Core CPI y/y": {
        category: "inflation",
        summary: "Year-over-year core inflation (ex food/energy).",
        explanation: "Same as Core CPI but year-over-year. The Fed's go-to gauge of whether inflation pressure is broad-based.",
        whyItMatters: "When this number is above ~2.5% the Fed feels real pressure to stay tight. When it cracks below 2% they feel room to cut.",
        howToInterpret: "Higher than forecast → bullish USD. Lower → bearish USD.",
    },
    "PPI m/m": {
        aka: "Producer Price Index",
        category: "inflation",
        summary: "Wholesale prices producers receive for their output.",
        explanation: "Measures price changes at the factory gate — what producers charge wholesalers, before retail markup. Often leads consumer inflation by 1-3 months.",
        whyItMatters: "PPI is an early warning system for CPI. Big PPI moves often show up in CPI a few months later.",
        howToInterpret: "Higher than forecast → bullish USD short-term (foreshadows CPI strength). Watch the energy and goods components.",
    },
    "Core PCE Price Index m/m": {
        aka: "PCE",
        category: "inflation",
        summary: "The Fed's officially preferred inflation gauge.",
        explanation: "PCE (Personal Consumption Expenditures) measures inflation differently than CPI — it adjusts for substitution as consumers shift spending. Core PCE excludes food and energy. The Fed targets 2% annual Core PCE.",
        whyItMatters: "When the Fed sets policy they look at Core PCE, not CPI. If Core PCE is above target, expect hawkish Fed. Below target, expect cuts.",
        howToInterpret: "Higher than forecast → bullish USD. Lower → bearish USD. This release moves markets even though it lags CPI by 2 weeks.",
    },

    // ----- US CENTRAL BANK -----
    "Federal Funds Rate": {
        category: "central-bank",
        summary: "The Fed's policy interest rate decision.",
        explanation: "Released ~8 times per year at 2:00 PM ET on FOMC meeting days. The federal funds rate is what banks charge each other for overnight loans — it ripples through to mortgages, business loans, savings rates, and currency values.",
        whyItMatters: "This is the single most important monetary policy event globally. Even a 25 basis point surprise can move the dollar 1-2% in seconds.",
        howToInterpret: "Hike vs forecast → bullish USD. Cut vs forecast → bearish USD. The 'dot plot' (forward rate projections) often matters more than the decision itself.",
    },
    "FOMC Statement": {
        category: "central-bank",
        summary: "Written policy statement released alongside the rate decision.",
        explanation: "A 1-2 page statement explaining the decision and the committee's view of the economy. Markets parse every word change for clues about future policy.",
        whyItMatters: "Subtle wording shifts ('inflation has eased somewhat' → 'inflation continues to ease') signal the Fed's next move. Algorithms trade these word changes within milliseconds.",
        howToInterpret: "Hawkish wording → bullish USD. Dovish wording → bearish USD. Compare line-by-line to the previous statement.",
    },
    "FOMC Press Conference": {
        category: "central-bank",
        summary: "Fed Chair Q&A held 30 minutes after FOMC decisions.",
        explanation: "The Fed Chair takes questions from reporters. Provides nuance on the statement and forward guidance. Often where market-moving comments happen.",
        whyItMatters: "Off-script remarks frequently shift the entire policy outlook. Volatility spikes during these 45-60 minute sessions.",
        howToInterpret: "Watch for tone vs the prepared statement. Surprises in either direction can move USD 1%+.",
    },
    "FOMC Meeting Minutes": {
        category: "central-bank",
        summary: "Detailed account of the previous Fed meeting, released 3 weeks later.",
        explanation: "A multi-page transcript-summary of the discussion at the previous FOMC meeting. Released at 2:00 PM ET, three weeks after the meeting.",
        whyItMatters: "The minutes reveal dissent, debate, and conditions Fed members are watching. Often surface details the official statement glossed over.",
        howToInterpret: "More hawkish than the statement → bullish USD. More dovish → bearish USD. Watch for split votes and concerns flagged by participants.",
    },

    // ----- US GROWTH -----
    "Advance GDP q/q": {
        category: "growth",
        summary: "First estimate of last quarter's GDP growth.",
        explanation: "GDP measures the total value of all goods and services produced in the US, annualized. The 'advance' release comes ~30 days after the quarter ends and is later revised in the 'preliminary' and 'final' releases.",
        whyItMatters: "Growth above ~2% is generally healthy. Negative two quarters in a row is the recession definition. Big surprises move USD and equity futures.",
        howToInterpret: "Higher than forecast → bullish USD. Lower → bearish USD. Watch consumer spending and inventories — those drive most of the variance.",
    },
    "Prelim GDP q/q": {
        category: "growth",
        summary: "Second GDP estimate, ~60 days after quarter-end.",
        explanation: "Revises the advance release with more complete data. Generally smaller surprises since the advance set the baseline.",
        whyItMatters: "Big revisions vs the advance number can shift the Fed's view of where the economy actually is.",
        howToInterpret: "Higher than forecast → bullish USD. Lower → bearish USD.",
    },
    "Final GDP q/q": {
        category: "growth",
        summary: "Third and 'final' GDP estimate, ~90 days after quarter-end.",
        explanation: "The third pass at GDP. Even this is later revised in benchmark revisions, but markets treat it as the settled number.",
        whyItMatters: "Largely backward-looking by this point — markets have moved on. Still relevant for confirming trends.",
        howToInterpret: "Surprises are smaller and reactions muted. Watch components for trend changes.",
    },

    // ----- US MANUFACTURING / SERVICES -----
    "ISM Manufacturing PMI": {
        category: "manufacturing",
        summary: "Survey-based read on US manufacturing activity. 50 = expansion vs contraction line.",
        explanation: "Institute for Supply Management surveys purchasing managers at hundreds of US manufacturers. Above 50 indicates expansion; below 50 indicates contraction. Released first business day of each month.",
        whyItMatters: "Manufacturing is only ~10% of US GDP but it's a forward-looking indicator — manufacturers cut staff and orders before the broader economy slows.",
        howToInterpret: "Higher than forecast → bullish USD. The 'New Orders' and 'Prices Paid' subcomponents are particularly market-moving.",
    },
    "ISM Services PMI": {
        category: "services",
        summary: "Survey-based read on US services activity. 50 = expansion vs contraction.",
        explanation: "Same methodology as ISM Manufacturing but covers services (~70% of US GDP). Released the third business day of each month.",
        whyItMatters: "Services dominate the US economy. Sustained services PMI below 50 is a recession warning.",
        howToInterpret: "Higher than forecast → bullish USD. Watch the Prices subindex for inflation clues.",
    },
    "Industrial Production m/m": {
        category: "manufacturing",
        summary: "Output of US factories, mines, and utilities.",
        explanation: "Measures real output of the industrial sector month-over-month. Released by the Federal Reserve Board around mid-month.",
        whyItMatters: "A confirming indicator alongside ISM. Industrial slowdowns ripple into employment within months.",
        howToInterpret: "Higher than forecast → bullish USD. Watch capacity utilization for inflation pressure.",
    },
    "Durable Goods Orders m/m": {
        category: "manufacturing",
        summary: "Orders for items meant to last 3+ years (cars, appliances, machinery, aircraft).",
        explanation: "A leading indicator of business investment. Volatile because aircraft orders alone can swing the headline. Markets often focus on the 'core' (ex-transportation) number.",
        whyItMatters: "Strong durable orders signal business confidence. Falling orders can presage recession.",
        howToInterpret: "Higher core (ex-transport) than forecast → bullish USD. Headline can be misleading due to aircraft.",
    },

    // ----- US HOUSING -----
    "Building Permits": {
        category: "housing",
        summary: "Number of new residential construction permits issued (annualized).",
        explanation: "Permits precede actual construction by 1-3 months, making this the most forward-looking housing indicator. Released monthly with Housing Starts.",
        whyItMatters: "Housing leads the broader cycle. Falling permits often warn of slowing economic activity ahead.",
        howToInterpret: "Higher than forecast → bullish USD. Sustained declines warn of housing-driven slowdown.",
    },
    "Housing Starts": {
        category: "housing",
        summary: "New residential construction projects begun (annualized).",
        explanation: "Tracks the number of new houses on which construction has started. Released alongside Building Permits, mid-month.",
        whyItMatters: "Housing starts drive jobs in construction, materials, and durable goods (appliances, furniture). A leading economic indicator.",
        howToInterpret: "Higher than forecast → bullish USD. Watch the trend more than single-month numbers — weather distorts the signal.",
    },
    "New Home Sales": {
        category: "housing",
        summary: "New single-family homes sold during the month (annualized).",
        explanation: "Captures sales of newly built homes. More volatile than existing-home sales since the market is smaller (~10% of total sales).",
        whyItMatters: "New sales feed directly into GDP; resales don't. A strong number boosts growth forecasts.",
        howToInterpret: "Higher than forecast → bullish USD.",
    },
    "Existing Home Sales": {
        category: "housing",
        summary: "Number of previously-owned homes sold (annualized).",
        explanation: "Bigger market than new sales (~90% of US home transactions). Released by NAR around the 20th of each month.",
        whyItMatters: "Indicates consumer confidence and credit conditions. Doesn't directly feed GDP but signals broader economic health.",
        howToInterpret: "Higher than forecast → bullish USD. Watch median price for inflation signal.",
    },
    "Pending Home Sales m/m": {
        category: "housing",
        summary: "Signed contracts on existing homes (leads existing-home sales by 1-2 months).",
        explanation: "When a buyer signs a contract, it counts as 'pending' until closing. Closings typically happen 1-2 months later.",
        whyItMatters: "A leading indicator for existing home sales — useful for getting ahead of that data.",
        howToInterpret: "Higher than forecast → bullish USD short-term.",
    },

    // ----- US RETAIL / CONSUMER -----
    "Retail Sales m/m": {
        category: "retail",
        summary: "Total receipts at US retailers (excluding services).",
        explanation: "Released around the 15th of each month. The most timely read on consumer spending, which drives ~70% of GDP. Includes everything from cars to clothes to gas.",
        whyItMatters: "When retail sales soften, GDP forecasts get cut and the Fed has cover to ease policy. When they stay strong, the Fed stays hawkish.",
        howToInterpret: "Higher than forecast → bullish USD. Watch the 'control group' — it strips out volatile categories (autos, gas, building materials) and feeds GDP directly.",
    },
    "Core Retail Sales m/m": {
        category: "retail",
        summary: "Retail sales excluding autos (which are volatile).",
        explanation: "Same as retail sales but with the auto category removed since car sales can swing the headline number significantly.",
        whyItMatters: "Cleaner read on underlying consumer demand.",
        howToInterpret: "Higher than forecast → bullish USD.",
    },
    "CB Consumer Confidence": {
        category: "consumer",
        summary: "Conference Board's monthly survey of US consumer sentiment.",
        explanation: "Conference Board surveys 5,000 households on their views of current and future economic conditions. Released last Tuesday of the month.",
        whyItMatters: "Consumer sentiment leads spending — when consumers feel worse, they spend less. Predictive for retail sales 1-3 months out.",
        howToInterpret: "Higher than forecast → bullish USD.",
    },
    "Prelim UoM Consumer Sentiment": {
        category: "consumer",
        summary: "University of Michigan's mid-month consumer sentiment survey.",
        explanation: "Comparable to CB Consumer Confidence but methodology differs. Includes inflation expectations, which the Fed watches closely.",
        whyItMatters: "The 5-10 year inflation expectations component is a key Fed input — it shapes whether inflation is 'unanchored.'",
        howToInterpret: "Higher than forecast → bullish USD. The inflation expectations subcomponent can move bonds and the dollar independently.",
    },

    // ----- US TRADE -----
    "Trade Balance": {
        category: "trade",
        summary: "Difference between US exports and imports.",
        explanation: "When imports exceed exports (the typical case for the US), the balance is negative. Released monthly by the Census Bureau.",
        whyItMatters: "A widening deficit can pressure the dollar in extreme cases, but markets generally treat this as backward-looking.",
        howToInterpret: "Smaller deficit than forecast → mildly bullish USD. Limited impact most months.",
    },

    // ----- ENERGY -----
    "Crude Oil Inventories": {
        category: "energy",
        summary: "Weekly change in US crude oil stockpiles.",
        explanation: "Energy Information Administration (EIA) reports weekly on Wednesdays at 10:30 AM ET. Reflects how much crude oil sits in commercial storage.",
        whyItMatters: "Inventory builds = oversupply = bearish oil. Draws = tight supply = bullish oil. Direct driver of WTI/Brent prices.",
        howToInterpret: "Larger draw than forecast → bullish oil. Larger build → bearish oil. Affects energy stocks and inflation expectations.",
    },
    "Natural Gas Storage": {
        category: "energy",
        summary: "Weekly change in US natural gas in storage.",
        explanation: "EIA reports Thursdays at 10:30 AM ET. Tracks how much natural gas is stockpiled.",
        whyItMatters: "Drives natural gas futures pricing directly. Influences power and industrial-input costs.",
        howToInterpret: "Larger draw → bullish nat gas. Larger build → bearish.",
    },
};

// Aliases — events that match different titles but mean the same thing.
// Mapped to the canonical key in DESCRIPTIONS.
export const ALIASES: Record<string, string> = {
    "NFP": "Non-Farm Employment Change",
    "Non-Farm Payrolls": "Non-Farm Employment Change",
    "Initial Jobless Claims": "Unemployment Claims",
    "ISM Non-Manufacturing PMI": "ISM Services PMI",
    "Federal Funds Target Rate": "Federal Funds Rate",
    "Federal Open Market Committee Statement": "FOMC Statement",
};

// ============================================================
// MATCHING
// ============================================================

const SPEAKER_KEYWORDS = ["speaks", "speech", "testifies", "testimony", "remarks", "comments"];

function categoryFromTitle(title: string): Category | null {
    const t = title.toLowerCase();
    if (/(gdp)/.test(t)) return "growth";
    if (/(cpi|ppi|pce|inflation|prices? paid|price index)/.test(t)) return "inflation";
    if (/(employment|payroll|jobless|jolts|labor|unemployment|hiring)/.test(t)) return "employment";
    if (/(rate decision|policy rate|interest rate|cash rate|main refinancing|bank rate|deposit rate|fomc|monetary policy|press conference)/.test(t)) return "central-bank";
    if (/(manufacturing|industrial|factory|durable|capacity)/.test(t)) return "manufacturing";
    if (/(services pmi|non-manufacturing)/.test(t)) return "services";
    if (/(housing|home sales|building permits|construction|mortgage)/.test(t)) return "housing";
    if (/(retail sales)/.test(t)) return "retail";
    if (/(consumer confidence|consumer sentiment|consumer credit|personal spending|personal income)/.test(t)) return "consumer";
    if (/(trade balance|current account|import|export)/.test(t)) return "trade";
    if (/(crude oil|natural gas|gasoline|energy)/.test(t)) return "energy";
    return null;
}

export interface MatchResult {
    description: EventDescription | null;
    category: Category;
    /** True if this event is a "speaker" event (Powell speaks, etc.) — no description should be shown. */
    isSpeaker: boolean;
}

export function matchEvent(title: string): MatchResult {
    const isSpeaker = SPEAKER_KEYWORDS.some((kw) => title.toLowerCase().includes(kw));

    // 1. Exact match
    const exact = DESCRIPTIONS[title];
    if (exact) return { description: exact, category: exact.category, isSpeaker };

    // 2. Alias match
    const aliasKey = ALIASES[title];
    if (aliasKey && DESCRIPTIONS[aliasKey]) {
        const d = DESCRIPTIONS[aliasKey];
        return { description: d, category: d.category, isSpeaker };
    }

    // 3. Substring match against keys (e.g., "CPI m/m USD" → "CPI m/m")
    const titleLower = title.toLowerCase();
    for (const key of Object.keys(DESCRIPTIONS)) {
        if (titleLower.includes(key.toLowerCase())) {
            const d = DESCRIPTIONS[key];
            return { description: d, category: d.category, isSpeaker };
        }
    }

    // 4. Category fallback (no description, but at least categorize for visual style)
    const cat = categoryFromTitle(title);
    return { description: null, category: cat ?? "general", isSpeaker };
}
