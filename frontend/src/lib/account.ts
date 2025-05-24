import localforage from "localforage";
import { USERS_ME_API_ENDPOINT } from "../config";
import { AccountDto } from "../types";

export async function fetchAccountData(id: number): Promise<AccountDto> {
    const request = await fetch(USERS_ME_API_ENDPOINT + '?' + new URLSearchParams({ id: id.toString() }), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const res = await request.json();
    return {
        id: res['userId'],
        firstName: res['firstName'],
        lastName: res['lastName'],
        email: res['email'],
        balance: res['balance'],
        createdAt: res['createdAt'],
        isActive: res['isActive'],
    };
}

/**
 * Returns the user we are currently logged in as, or null.
 */
export async function getAccount(): Promise<AccountDto | null> {
    const account = await localforage.getItem<number>('auth');
    console.debug('Fetching user:', account);
    if (account == null) return null;

    const data = await fetchAccountData(account);
    console.debug('We are:', data);
    return data;
}

/**
 * Stores the account ID of the user we're "logged in" as
 */
export async function setAccount(id: number | null) {
    await localforage.setItem('auth', id);
}
