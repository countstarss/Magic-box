import React from 'react';
// import { Action, UsageData } from '../page';
import { ChevronRightIcon } from 'lucide-react';
import { Action, UsageData } from '../data';

interface UsageProps {
    userName: string;
    teamName: string;
    usageData: UsageData;
    actions: Action[];
}

function Usage({ userName, teamName, usageData, actions }: UsageProps) {

    // TODO: 这些内容移动到Settings/assets
    return (
        <div className="h-screen bg-gray-50 dark:bg-black/20 p-6 flex flex-col items-center overflow-auto">
            {/* Header */}
            <header className="text-center mb-8">
                <h1 className="text-2xl font-bold dark:text-white">Welcome, {userName}</h1>
                <p className="text-gray-500 dark:text-gray-400">Overview of {teamName}</p>
            </header>

            {/* Usage Snapshot */}
            <section className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">Usage Snapshot for {usageData.month}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Next billing period starts in {usageData.nextBillingInDays} days
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Credits Section */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium dark:text-gray-300">Prepaid credits</p>
                            <p className="text-lg font-semibold dark:text-white">${usageData.prepaidCredits} remaining</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium dark:text-gray-300">Free credits</p>
                            <p className="text-lg font-semibold text-blue-500 dark:text-blue-400">${usageData.freeCredits} remaining</p>
                        </div>
                    </div>

                    {/* Monthly Snapshot */}
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                        <h3 className="text-sm font-medium dark:text-gray-300">Monthly snapshot</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">You spend roughly ${usageData.monthlySpend} / month</p>
                        <div className="mt-2 bg-gray-300 dark:bg-gray-600 h-24 rounded"></div>
                    </div>
                </div>

                {/* Detailed Usage */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="dark:text-gray-300">Total usage</p>
                        <p className="font-semibold dark:text-white">${usageData.totalUsage}</p>
                    </div>
                    <div>
                        <p className="dark:text-gray-300">Credits used</p>
                        <p className="font-semibold dark:text-white">${usageData.creditsUsed}</p>
                    </div>
                    <div>
                        <p className="dark:text-gray-300">Current spend</p>
                        <p className="font-semibold dark:text-white">${usageData.currentSpend}</p>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-4 mb-20"
            //MARK: Action Cards
            >
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex items-center flex-col justify-between cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    >
                        <span className="text-5xl mr-auto p-4 items-start dark:text-gray-300">{action.icon}</span>

                        <div className="flex flex-row items-end justify-between gap-6">
                            <div className="flex flex-col items-start">
                                <h3 className="font-semibold dark:text-white">{action.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{action.description}</p>
                            </div>
                            <ChevronRightIcon className="w-6 h-6 p-1 dark:text-gray-300" />
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Usage;