import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "cmdk";
import { type } from "os";
import { usePriceContext } from "../currencyFormCard/utils/hooks";
import Image from "next/image";
import { Price } from "../currencyFormCard";

type CryptoDialogContentProps = {
    onSelect?: (value: string) => void | undefined;
};
const CryptoDialogContent = ({ onSelect }: CryptoDialogContentProps) => {
    const prices = usePriceContext();
    const getImageUrl = (prices: Price[], currency: string) => {
        return (
            prices.find((price) => price["currency"] === currency)?.imgUrl ?? ""
        );
    };
    return (
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
                                className="cursor-pointer hover:bg-gray-100 transition-colors"
                                onSelect={onSelect}
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
    );
};

export default CryptoDialogContent;
