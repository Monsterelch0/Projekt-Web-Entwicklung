import { useEffect, useState } from "react";
import { AccountDto } from "../types";
import { getAccount } from "./account";

/**
 * Provides current account data, or null if not logged in.
 */
export function useAccount(): AccountDto | null {
    const [account, setAccount] = useState<AccountDto | null>(null);

    // This fetches the account from the API every time useAccount() is used,
    // which isn't great performance wise but we don't currently have any
    // form of global state so this is the best we can do for now.
    // Might be worth fixing in the future.
    useEffect(() => {
        getAccount()
            .then(setAccount)
            .catch(console.error);
    }, []);

    return account;
}
