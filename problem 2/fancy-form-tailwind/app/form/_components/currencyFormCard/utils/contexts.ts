import { createContext } from "react";
import { Price } from "..";

export const PriceContext = createContext<Price[]>([]);
