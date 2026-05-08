// Prop firm preset rules. Numbers reflect commonly published evaluation rules —
// users can switch firms freely or pick "custom" to enter their exact rules.

export interface PropFirmPreset {
    id: string;
    firm: string;
    account: string;       // human label like "$50K Combine"
    accountSize: number;
    target: number;        // profit target in $
    maxLoss: number;       // max loss / drawdown in $
    daily: number;         // daily loss limit in $ (0 = none)
    trailing: number;      // trailing distance in $ (0 = static drawdown)
}

export const PROP_FIRM_PRESETS: ReadonlyArray<PropFirmPreset> = [
    { id: "topstep-50k",  firm: "Topstep",         account: "$50K Combine",  accountSize: 50000,  target: 3000,  maxLoss: 2000, daily: 1000, trailing: 2000 },
    { id: "topstep-100k", firm: "Topstep",         account: "$100K Combine", accountSize: 100000, target: 6000,  maxLoss: 3000, daily: 2000, trailing: 3000 },
    { id: "topstep-150k", firm: "Topstep",         account: "$150K Combine", accountSize: 150000, target: 9000,  maxLoss: 4500, daily: 3000, trailing: 4500 },
    { id: "apex-25k",     firm: "Apex",            account: "$25K Eval",     accountSize: 25000,  target: 1500,  maxLoss: 1500, daily: 0,    trailing: 1500 },
    { id: "apex-50k",     firm: "Apex",            account: "$50K Eval",     accountSize: 50000,  target: 3000,  maxLoss: 2500, daily: 0,    trailing: 2500 },
    { id: "apex-100k",    firm: "Apex",            account: "$100K Eval",    accountSize: 100000, target: 6000,  maxLoss: 3000, daily: 0,    trailing: 3000 },
    { id: "apex-150k",    firm: "Apex",            account: "$150K Eval",    accountSize: 150000, target: 9000,  maxLoss: 5000, daily: 0,    trailing: 5000 },
    { id: "apex-250k",    firm: "Apex",            account: "$250K Eval",    accountSize: 250000, target: 15000, maxLoss: 6500, daily: 0,    trailing: 6500 },
    { id: "mff-50k",      firm: "MyFundedFutures", account: "$50K Starter",  accountSize: 50000,  target: 3000,  maxLoss: 2000, daily: 1250, trailing: 2000 },
    { id: "mff-100k",     firm: "MyFundedFutures", account: "$100K Expert",  accountSize: 100000, target: 6000,  maxLoss: 3000, daily: 2500, trailing: 3000 },
    { id: "mff-150k",     firm: "MyFundedFutures", account: "$150K Master",  accountSize: 150000, target: 9000,  maxLoss: 4500, daily: 3500, trailing: 4500 },
    { id: "ftmo-25k",     firm: "FTMO Futures",    account: "$25K",          accountSize: 25000,  target: 1500,  maxLoss: 1250, daily: 750,  trailing: 1250 },
    { id: "ftmo-50k",     firm: "FTMO Futures",    account: "$50K",          accountSize: 50000,  target: 3000,  maxLoss: 2500, daily: 1500, trailing: 2500 },
    { id: "ftmo-100k",    firm: "FTMO Futures",    account: "$100K",         accountSize: 100000, target: 6000,  maxLoss: 5000, daily: 3000, trailing: 5000 },
];

export function findPreset(id: string): PropFirmPreset | undefined {
    return PROP_FIRM_PRESETS.find((p) => p.id === id);
}
