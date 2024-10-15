import { useContext } from "react";
import { Price } from "..";
import { PriceContext } from "./contexts";

export const usePriceContext = (): Price[] => {
    const context = useContext(PriceContext);
    if (context === null) {
        throw new Error(
            "priceContext must be used within a UserContext.Provider. Or got error somewhere. PriceCOntext = null here"
        );
    }
    return context;
};
