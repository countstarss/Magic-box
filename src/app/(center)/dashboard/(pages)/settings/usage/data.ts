import React from 'react';

export interface UsageData {
    month: string;
    nextBillingInDays: number;
    prepaidCredits: number;
    freeCredits: number;
    monthlySpend: number;
    totalUsage: number;
    creditsUsed: number;
    currentSpend: number;
}

export interface Action {
    title: string;
    url: string;
    description: string;
    icon: React.ReactNode;
}
