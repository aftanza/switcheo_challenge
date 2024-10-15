import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InputBlock from "../_components/inputBlock";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type TokenSwapState = {
    sell: {
        token: string | null;
        price: number;
        imgUrl: string;
    };
    buy: {
        token: string | null;
        price: number;
        imgUrl: string;
    };
};

const Swap = () => {
    const initialState: TokenSwapState = {
        sell: {
            token: "ETH",
            price: 0,
            imgUrl: " https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/ETH.svg",
        },
        buy: { token: null, price: 0, imgUrl: "" },
    };
    const [tokenSwapState, setTokenSwapState] =
        useState<TokenSwapState>(initialState);
    return (
        <>
            <CardHeader className="Card--Header">
                <CardTitle className="text-2xl font-bold text-center">
                    Swap
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-10 p-10">
                <InputBlock
                    type={"sell"}
                    tokenSwapState={tokenSwapState}
                    setTokenSwapState={setTokenSwapState}
                />
                {/* <div className="flex justify-center">{Arrow}</div> */}
                <InputBlock
                    type={"buy"}
                    tokenSwapState={tokenSwapState}
                    setTokenSwapState={setTokenSwapState}
                />
            </CardContent>
            <CardFooter>
                <Button
                    className="Card--Footer-Button"
                    onClick={() => {
                        alert(JSON.stringify(tokenSwapState));
                    }}
                >
                    Submit
                </Button>
            </CardFooter>
        </>
    );
};

export default Swap;
