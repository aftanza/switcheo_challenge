"use client";

import { Switch } from "@/components/ui/switch";
import CurrencyFormCard from "./_components/currencyFormCard";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const FormPage = () => {
    const [dark, setDark] = useState<boolean>(false);
    return (
        <div
            className={`${
                dark ? "dark" : ""
            } min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 p-4`}
        >
            <div className={`flex items-center justify-center space-x-2 pt-4`}>
                <Switch
                    id="dark-mode"
                    onCheckedChange={(checked) => {
                        setDark(checked);
                    }}
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>

            <div className={`flex min-h-screen justify-center mt-28 `}>
                <CurrencyFormCard />
            </div>
        </div>
    );
};

export default FormPage;
