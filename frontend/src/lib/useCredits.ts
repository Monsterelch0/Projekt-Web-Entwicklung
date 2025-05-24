import { useCallback, useEffect, useState } from "react";
import { USERS_SET_CREDITS_API_ENDPOINT } from "../config";
import { useAccount } from "./useAccount";

// The default value if we can't fetch credits from an account (e.g. if not logged in)
const DEFAULT_CREDITS = 0;

type ReturnVal = [
    number | null,
    (credits: number) => Promise<void>,
];

/**
 * Hook that provides the current credit value, and a callback to update the value.
 */
export function useCredits(): ReturnVal {
    const [credits, setCredits] = useState<number | null>(null);
    const account = useAccount();

    // Since fetching the current credit value is asynchronous, we use an
    // effect to update `credits` once it's available - Meaning `credits`
    // will briefly be null until useAccount() provides us the data we need.
    useEffect(() => {
        if (account?.balance != null) {
            console.debug("Retrieved credits:", account.balance);
            setCredits(account.balance);
        } else {
            // Set to default if it's not set already
            setCredits(DEFAULT_CREDITS);
            console.debug("Set credits to default value");
        }
    }, [account]);

    const setCreditsCb = useCallback(async (newCredits: number) => {
        if (account) {
            const request = await fetch(USERS_SET_CREDITS_API_ENDPOINT + '?' + new URLSearchParams({ id: account.id.toString() }), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCredits),
            });
            if (!request.ok) throw new Error("Failed to update credits");
            console.info("Updated server-side credits");
        }

        setCredits(newCredits);
    }, [account]);

    return [credits, setCreditsCb];
}
