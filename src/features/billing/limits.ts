// Free-tier limits, in one place so they're easy to tune.
// Keep these aligned with what the upgrade prompts promise.

export const FREE_TRADE_LIMIT = 25;

/** Show the "you're approaching the limit" banner at this point. */
export const FREE_TRADE_WARNING_THRESHOLD = Math.floor(FREE_TRADE_LIMIT * 0.8); // 20

export const FREE_TIER_FEATURE_GATES = {
    // Number of un-blurred events the calendar shows to free users.
    economicCalendarTeaser: 2,
} as const;
