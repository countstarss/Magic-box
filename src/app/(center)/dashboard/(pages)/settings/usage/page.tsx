import React from 'react';
import { Action, UsageData } from './data';
import Usage from './_components/usage';
import { BarChartIcon, BookIcon, BoxIcon, CreditCardIcon, SettingsIcon, UserIcon } from 'lucide-react';

function UsagePage() {

    const usageData: UsageData = {
        month: "November 2024",
        nextBillingInDays: 24,
        prepaidCredits: 0.00,
        freeCredits: 25.00,
        monthlySpend: 0.00,
        totalUsage: 0.00,
        creditsUsed: 0.00,
        currentSpend: 0.00,
    };

    const actions: Action[] = [
        { title: 'Settings', url: "/dashboard/settings", description: "Manage your account settings", icon: <SettingsIcon size={32} /> },
        { title: 'Invite a team member', url: "/dashboard/invite", description: 'Collaborate with your team', icon: <UserIcon size={32} /> },
        { title: 'Set up billing', url: "/dashboard/billing", description: 'Unlock access to the API', icon: <CreditCardIcon size={32} /> },
        { title: 'View models', url: "/dashboard/models", description: 'Compare models and costs', icon: <BoxIcon size={32} /> },
        { title: 'Track your usage', url: "/dashboard/usage", description: 'Deep dive into your usage', icon: <BarChartIcon size={32} /> },
        { title: 'View our docs', url: "/dashboard/docs", description: 'Learn more about the API', icon: <BookIcon size={32} /> },
    ];


    // TODO: 这些内容移动到Settings/assets
    return (
        <Usage
            userName={"Luke"}
            teamName={"Dao Mandarin"}
            usageData={usageData}
            actions={actions}
        />
    )
}

export default UsagePage;