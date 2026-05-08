// Database row + the resolved "active rules" the trackers consume.

export interface PropFirmConfig {
    user_id: string;
    preset: string;                  // 'none' | 'custom' | preset id
    custom_account_size: number;
    custom_target: number;
    custom_max_loss: number;
    custom_daily: number;
    custom_trailing: number;
    updated_at: string;
}

/** Whatever the user's current effective rules are — preset values or custom. */
export interface ActiveRules {
    label: string;          // for UI display ("Topstep • $50K Combine" or "Custom")
    accountSize: number;
    target: number;
    maxLoss: number;
    daily: number;          // 0 = no daily limit
    trailing: number;       // 0 = static drawdown (no trailing)
}

export const DEFAULT_CONFIG: Omit<PropFirmConfig, "user_id" | "updated_at"> = {
    preset: "none",
    custom_account_size: 0,
    custom_target: 0,
    custom_max_loss: 0,
    custom_daily: 0,
    custom_trailing: 0,
};
