// Futures contract specifications.
//   pointValue = $ per 1.00 price point per 1 contract
//   tickSize   = smallest price increment (in points)
//   tickValue  = $ per 1 tick per 1 contract  (= pointValue * tickSize)
//
// These constants are reused by the journal (Phase 3) for trade P&L,
// so keep them in this dedicated file rather than inside the form component.

export interface ContractSpec {
    name: string;
    pointValue: number;
    tickSize: number;
    tickValue: number;
}

export const CONTRACTS = {
    ES:  { name: "E-mini S&P 500",        pointValue: 50,   tickSize: 0.25, tickValue: 12.50 },
    MES: { name: "Micro E-mini S&P 500",  pointValue: 5,    tickSize: 0.25, tickValue: 1.25  },
    NQ:  { name: "E-mini Nasdaq 100",     pointValue: 20,   tickSize: 0.25, tickValue: 5.00  },
    MNQ: { name: "Micro E-mini Nasdaq",   pointValue: 2,    tickSize: 0.25, tickValue: 0.50  },
    YM:  { name: "E-mini Dow",            pointValue: 5,    tickSize: 1,    tickValue: 5.00  },
    MYM: { name: "Micro E-mini Dow",      pointValue: 0.50, tickSize: 1,    tickValue: 0.50  },
    RTY: { name: "E-mini Russell 2000",   pointValue: 50,   tickSize: 0.10, tickValue: 5.00  },
    M2K: { name: "Micro E-mini Russell",  pointValue: 5,    tickSize: 0.10, tickValue: 0.50  },
} as const satisfies Record<string, ContractSpec>;

export type ContractSymbol = keyof typeof CONTRACTS;

export const CONTRACT_SYMBOLS = Object.keys(CONTRACTS) as ContractSymbol[];
