import { Input } from "@/components/ui/input";
import Arrow from "../../../arrow/arrow";
import { Button } from "@/components/ui/button";
import { usePriceContext } from "../../utils/hooks";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Price } from "../..";

type InputBlockProps = {
    type: "sell" | "buy";
    tokenSwapState: TokenSwapState;
    setTokenSwapState: Dispatch<SetStateAction<TokenSwapState>>;
};

import Image from "next/image";
import { TokenSwapState } from "../../swap";

const InputBlock = ({
    type,
    tokenSwapState,
    setTokenSwapState,
}: InputBlockProps) => {
    const prices = usePriceContext();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [localValue, setLocalValue] = useState<string>(
        tokenSwapState[type].price.toString()
    );

    useEffect(() => {
        setLocalValue(tokenSwapState[type].price.toString());
    }, [tokenSwapState[type].price]);

    useEffect(() => {
        updateOtherPrice("sell", tokenSwapState["sell"]["price"]);
    }, [tokenSwapState[type].token]);

    const handleInputChange = (key: "sell" | "buy", value: string) => {
        setLocalValue(value);

        const numericValue = parseFloat(value) || 0;

        setTokenSwapState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                price: numericValue,
            },
        }));

        updateOtherPrice(key, numericValue);
    };

    const updateOtherPrice = (key: "sell" | "buy", amount: number) => {
        const { sell, buy } = tokenSwapState;

        const sellPrice = prices.find(
            (price) => price.currency === sell.token
        )?.price;
        const buyPrice = prices.find(
            (price) => price.currency === buy.token
        )?.price;

        if (sellPrice && buyPrice) {
            const newPrice =
                key === "buy"
                    ? (amount * buyPrice) / sellPrice
                    : (amount * sellPrice) / buyPrice;

            const formattedPrice = newPrice.toFixed(4);

            const otherKey = key === "sell" ? "buy" : "sell";

            setTokenSwapState((prev) => ({
                ...prev,
                [otherKey]: {
                    ...prev[otherKey],
                    price: formattedPrice,
                },
            }));
        }
    };

    const tokenSwap = () => {
        const currentSellToken = tokenSwapState["sell"]["token"];
        const currentSellTokenImgUrl = tokenSwapState["sell"]["imgUrl"];
        const currentBuyToken = tokenSwapState["buy"]["token"];
        const currentBuyTokenImgUrl = tokenSwapState["buy"]["imgUrl"];

        const tempToken = currentSellToken;
        const tempImage = currentSellTokenImgUrl;

        setTokenSwapState((prev) => ({
            ...prev,
            sell: {
                ...prev.sell,
                token: currentBuyToken,
                imgUrl: currentBuyTokenImgUrl,
            },
        }));

        setTokenSwapState((prev) => ({
            ...prev,
            buy: {
                ...prev.buy,
                token: tempToken,
                imgUrl: tempImage,
            },
        }));
    };

    const getImageUrl = (prices: Price[], currency: string) => {
        return (
            prices.find((price) => price["currency"] === currency)?.imgUrl ?? ""
        );
    };
    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <div className="Card--Input-Container">
                <div className="flex items-stretch gap-x-4 mb-4 h-10">
                    <div className="Card--Text-Highlight h-full">
                        <p className="text-xl font-medium text-gray-800 dark:text-white">
                            {type === "sell" ? "Sell" : "Buy"}
                        </p>
                    </div>

                    <DialogTrigger asChild>
                        <Button className="Card--Button h-full w-36 dark:text-white">
                            {(type === "sell"
                                ? tokenSwapState["sell"]["token"]
                                : tokenSwapState["buy"]["token"]) ??
                                "Select Token"}
                        </Button>
                    </DialogTrigger>

                    {type === "sell" ? (
                        <Button
                            variant={"outline"}
                            // size={"icon"}
                            className="h-full rounded-full"
                            onClick={tokenSwap}
                        >
                            <Arrow />
                        </Button>
                    ) : (
                        ""
                    )}
                    <div className="h-10 w-10 relative ml-auto">
                        {tokenSwapState[type]["imgUrl"] && (
                            <Image
                                src={tokenSwapState[type]["imgUrl"]}
                                fill
                                alt="Picture of the crypto"
                            />
                        )}
                    </div>
                </div>
                <Input
                    placeholder="0"
                    className="h-28 flex-1 text-6xl no-spinner"
                    type="number"
                    // readOnly={type === "buy" ? true : false}
                    value={localValue}
                    onChange={(e) => handleInputChange(type, e.target.value)}
                    min={0}
                />
            </div>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select a token</DialogTitle>
                </DialogHeader>
                <Command>
                    <CommandInput placeholder="Search tokens..." />
                    <CommandList className="h-[300px] rounded-md border p-4">
                        <CommandEmpty>No tokens found.</CommandEmpty>
                        <CommandGroup heading="Available Tokens">
                            {prices.map((price, index) => (
                                <CommandItem
                                    key={index}
                                    onSelect={(e) => {
                                        if (type === "sell") {
                                            if (
                                                tokenSwapState["buy"][
                                                    "token"
                                                ] === e
                                            ) {
                                                tokenSwap();
                                            } else {
                                                setTokenSwapState((prev) => ({
                                                    ...prev,
                                                    sell: {
                                                        ...prev.sell,
                                                        token: e,
                                                        imgUrl: getImageUrl(
                                                            prices,
                                                            e
                                                        ),
                                                    },
                                                }));
                                            }
                                        } else {
                                            if (
                                                tokenSwapState["sell"][
                                                    "token"
                                                ] === e
                                            ) {
                                                tokenSwap();
                                            } else {
                                                setTokenSwapState((prev) => ({
                                                    ...prev,
                                                    buy: {
                                                        ...prev.buy,
                                                        token: e,
                                                        imgUrl: getImageUrl(
                                                            prices,
                                                            e
                                                        ),
                                                    },
                                                }));
                                            }
                                        }
                                        setDialogOpen(false);
                                    }}
                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 mr-2 relative">
                                            <Image
                                                src={getImageUrl(
                                                    prices,
                                                    price.currency
                                                )}
                                                fill
                                                alt={`${price.currency} icon`}
                                                className="rounded-full"
                                            />
                                        </div>
                                        {price.currency}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default InputBlock;
