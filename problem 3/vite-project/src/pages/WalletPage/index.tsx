import { useEffect, useMemo, useState } from "react";

interface WalletBalance {
    currency: string;
    amount: number;
    // Added blockchain
    blockchain: string;
}
// Implemented inheritence from wallet balance
interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

// Added Prices type
type Prices = {
    currency: string;
    date: string;
    price: number;
};

// Defined Datasource
class Datasource {
    #url: string;

    constructor(url: string) {
        this.#url = url;
    }

    async getPrices() {
        try {
            const res = await fetch(this.#url);
            if (!res.ok) {
                throw new Error(`Got HTTP error. status: ${res.status}`);
            }
            const data: Prices[] = await res.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch prices:", error);
            throw error;
        }
    }

    // Setter
    setUrl(url: string) {
        this.#url = url;
    }
}

interface BoxProps {
    // Stump interface.
    // TODO: Define
}

interface Props extends BoxProps {
    // Added children typing to Props
    children?: React.ReactNode;
}

// Add export
export const WalletPage: React.FC<Props> = (props: Props) => {
    // It doesnt look like children is used. Might be better for it to be removed. Or maybe children forgot to be implemented
    const { children, ...rest } = props;
    const balances = useWalletBalances();

    // While waiting for datasource to fetch, can have a spinner or loading component. Depending on the framework / tools, there might be better implementations of this, like NextJS' loading.tsx, and fetch before going to the page.
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Clarified the useState
    // Changed from {} to [] since its a list of objects
    const [prices, setPrices] = useState<Prices[]>([]);

    useEffect(() => {
        const datasource = new Datasource(
            "https://interview.switcheo.com/prices.json"
        );
        datasource
            .getPrices()
            .then((prices) => {
                setPrices(prices);
                setIsLoading(false);
            })
            .catch((error) => {
                // Change .err to .error to match
                console.error(error);
            });
    }, []);

    // Changed typing from any to string
    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
            case "Osmosis":
                return 100;
            case "Ethereum":
                return 50;
            case "Arbitrum":
                return 30;
            case "Zilliqa":
                return 20;
            case "Neo":
                return 20;
            default:
                return -99;
        }
    };

    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Shortens it to enhance readability
                // Also fixed the balance.amount < 0 to balance.amount > 0
                if (balancePriority !== -99 && balance.amount > 0) return true;

                return false;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // Since lhs and rhs are filtered already, we can just do
                return leftPriority - rightPriority;
                // lhs - rhs for ascending order
            });
        // removes prices as dependancy
    }, [balances]);

    // Added typing
    const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
        (balance: WalletBalance) => {
            return {
                ...balance,
                // toFixed() empty might be an error. For now, add 2
                formatted: balance.amount.toFixed(2),
            };
        }
    );

    // Seperating .filter, .sort, and .map will result in 3 iterations.
    // Can lessen themby combining into one reduce

    const filteredAndFormatted: FormattedWalletBalance[] = useMemo(() => {
        function reducer(
            accumulator: FormattedWalletBalance[],
            balance: WalletBalance
        ) {
            const balancePriority = getPriority(balance.blockchain);

            if (balancePriority !== -99 && balance.amount > 0) {
                accumulator.push({
                    ...balance,
                    formatted: balance.amount.toFixed(2),
                });
            }
            return accumulator;
        }

        // Keep sorting seperated since timsort is O(n Log n)

        return balances
            .reduce(reducer, [])
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                return (
                    getPriority(lhs.blockchain) - getPriority(rhs.blockchain)
                );
            });
    }, [balances]);

    // Changed sortedBalances here to formattedBalances
    const rows = formattedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
            // Find the price of the entryz
            const priceOfBalance = prices.find(
                (price) => price.currency === balance.currency
            );

            // Sum the total
            const usdValue = priceOfBalance
                ? priceOfBalance.price * balance.amount
                : undefined;
            return (
                <>
                    {isLoading && (
                        <WalletRow
                            // Input custom classname here
                            className={classes.row}
                            key={index}
                            amount={balance.amount}
                            usdValue={usdValue}
                            formattedAmount={balance.formatted}
                        />
                    )}
                </>
            );
        }
    );

    return <div {...rest}>{rows}</div>;
};
