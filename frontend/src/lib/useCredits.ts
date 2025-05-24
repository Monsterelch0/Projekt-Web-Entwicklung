import localforage from "localforage";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_CREDITS = 1000;

type ReturnVal = [
    number | null,
    (credits: number) => void,
];

/**
 * Hook that provides the current credit value, and a callback to update the value.
 */
export function useCredits(): ReturnVal {
    const [credits, setCredits] = useState<number | null>(null);

    // localforage stores data in localstorage or indexeddb, depending on
    // which is available.
    // This would eventually be replaced with an API call.
    // Since fetching the current credit value is asynchronous, we use an
    // effect to update `credits` once it's available - Meaning `credits`
    // will briefly be null.
    useEffect(() => {
        localforage.getItem<number>('credits')
            .then(async (value) => {
                if (value != null) {
                    console.debug("Retrieved credits:", value);
                    setCredits(value);
                } else {
                    // Set to default if it's not set already
                    await localforage.setItem<number>('credits', DEFAULT_CREDITS);
                    setCredits(DEFAULT_CREDITS);
                    console.debug("Set credits to default value");
                }
            })
            .catch(console.error);
    }, []);

    const setCreditsCb = useCallback((newCredits: number) => {
        setCredits(newCredits);
        localforage.setItem<number>('credits', newCredits);
    }, []);

    return [credits, setCreditsCb];
}
