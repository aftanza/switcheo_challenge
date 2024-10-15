"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReactElement, useEffect, useState } from "react";
import Swap from "./swap";
import Limit from "./limit";
import Send from "./send";
import Buy from "./buy";
import { PriceContext } from "./utils/contexts";

type CardProps = React.ComponentProps<typeof Card>;

export type Price = {
    currency: string;
    date: string;
    price: number;
    imgUrl: string;
};

export type ParsedPrice = Price & {
    parsedDate: Date;
};

export default function CurrencyFormCard({ ...props }: CardProps) {
    const tabs = [
        {
            name: "Swap",
            id: "swap",
        },
        // {
        //     name: "Limit",
        //     id: "limit",
        // },
        {
            name: "Send",
            id: "send",
        },
        // {
        //     name: "Buy",
        //     id: "buy",
        // },
    ];

    const [currentTab, setCurrentTab] = useState<string>("swap");
    const [displayedContent, setDisplayedContent] = useState<ReactElement>();

    const [prices, setPrices] = useState<Price[]>([]);

    useEffect(() => {
        // console.log(currentTab);
        switch (currentTab) {
            case "swap":
                setDisplayedContent(<Swap />);
                break;
            case "limit":
                setDisplayedContent(<Limit />);
                break;
            case "send":
                setDisplayedContent(<Send />);
                break;
            case "buy":
                setDisplayedContent(<Buy />);
                break;
        }
    }, [currentTab]);

    const cleanUpData = async (prices: Price[]) => {
        // A way to get the latest price on everything
        const parsedPrices: ParsedPrice[] = prices.map((price) => ({
            ...price,
            parsedDate: new Date(price.date),
            imgUrl: `https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${price.currency}.svg`,
        }));

        const cleanedData = new Map<string, ParsedPrice>();

        parsedPrices.forEach((price) => {
            const existing = cleanedData.get(price.currency);

            // Keep the entry if it's the most recent or if there was no existing entry
            if (!existing || price.parsedDate > existing.parsedDate) {
                cleanedData.set(price.currency, price);
            }
        });

        return Array.from(cleanedData.values()).map(({ ...rest }) => rest);
    };

    useEffect(() => {
        fetch("https://interview.switcheo.com/prices.json")
            .then((res) => res.json())
            .then((res) => cleanUpData(res))
            .then((data) => setPrices(data))
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className="w-[600px] m-4 gap-4 flex flex-col" {...props}>
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {tabs.map((tab, index) => {
                    const isActive = currentTab === tab.id;
                    return (
                        <Button
                            key={index}
                            onClick={() => setCurrentTab(tab.id)}
                            variant={isActive ? "default" : "ghost"}
                            className={`
                                flex-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                                ${
                                    isActive
                                        ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-md hover:bg-white dark:hover:bg-gray-700"
                                        : "text-gray-600 dark:text-gray-300 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-white dark:hover:bg-gray-700/50"
                                }
                                ${index === 0 ? "rounded-l-md" : ""}
                                ${
                                    index === tabs.length - 1
                                        ? "rounded-r-md"
                                        : ""
                                }
                            `}
                        >
                            {tab.name}
                        </Button>
                    );
                })}
            </div>

            <PriceContext.Provider value={prices}>
                <Card className="bg-white dark:bg-gray-800 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                    {displayedContent}
                </Card>
            </PriceContext.Provider>
        </div>
    );
}
