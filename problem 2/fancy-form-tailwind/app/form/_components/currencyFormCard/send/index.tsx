import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Dispatch, useEffect, useState } from "react";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { usePriceContext } from "../utils/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";

import Image from "next/image";
import { Price } from "..";

const Send = () => {
    const prices = usePriceContext();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const [token, setToken] = useState<string>("");
    const [tokenImgUrl, setTokenImgUrl] = useState<string>("");

    const [valueToSend, setValueToSend] = useState<number>(0);
    const [address, setAddress] = useState<string>("");

    const getImageUrl = (prices: Price[], currency: string) => {
        return (
            prices.find((price) => price["currency"] === currency)?.imgUrl ?? ""
        );
    };
    return (
        <>
            <CardHeader className="Card--Header">
                <CardTitle className="text-2xl font-bold text-center">
                    Send
                </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 my-6">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <p className="Card--Text-Highlight">Sending</p>
                    <div className="h-14 relative flex gap-2">
                        <DialogTrigger asChild>
                            <Button className="text-3xl font-medium justify-start relative h-full p-2 flex-1 Card--Button dark:text-white">
                                <div
                                    className={`h-full aspect-square relative mr-4 ${
                                        tokenImgUrl ? "" : "hidden"
                                    }`}
                                >
                                    <Image
                                        src={tokenImgUrl}
                                        fill
                                        alt="Picture of the author"
                                    />
                                </div>

                                {token || "Select Token"}
                            </Button>
                        </DialogTrigger>
                    </div>

                    <Input
                        placeholder="0"
                        className="h-32 flex-1 text-8xl no-spinner"
                        type="number"
                        min={0}
                        value={valueToSend.toString()}
                        onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setValueToSend(val);
                        }}
                    />

                    <p className="Card--Text-Highlight">To</p>
                    <Input
                        placeholder="Address"
                        className="h-12 text-medium"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    />

                    <CardFooter className="p-0">
                        <Button
                            className="w-full Card--Footer-Button"
                            onClick={() => {
                                alert(
                                    JSON.stringify({
                                        token: token,
                                        toSend: valueToSend,
                                        address: address,
                                    })
                                );
                            }}
                        >
                            Submit
                        </Button>
                    </CardFooter>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Select a token</DialogTitle>
                        </DialogHeader>
                        <Command>
                            <CommandInput placeholder="Type a command or search..." />
                            <CommandList className="h-[300px] rounded-md border p-4">
                                <CommandEmpty>No results found.</CommandEmpty>
                                <CommandGroup heading="Tokens">
                                    <div>
                                        {prices.map((price, index) => {
                                            return (
                                                <CommandItem
                                                    key={index}
                                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onSelect={(e) => {
                                                        setToken(e);
                                                        setTokenImgUrl(
                                                            getImageUrl(
                                                                prices,
                                                                e
                                                            )
                                                        );
                                                        setDialogOpen(
                                                            (prev) => !prev
                                                        );
                                                    }}
                                                >
                                                    {/* {price["currency"]} */}
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
                                            );
                                        })}
                                    </div>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </>
    );
};

export default Send;
