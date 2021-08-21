interface Bot {
    makeEntry(options?: RaffleOptions, profile?: Profile | null, account?: UserAccount | null): Promise<EntryResponse>;
    grabLink(): string;
    baseUrl: string;
}

type RaffleOptions = {
    size?: number | string;
    colorway?: string;
    url?: string;
    directUrl?: string;
    discordWebhook?: string;
}

type EntryResponse = {
    finalStatusCode: number;
    responseText: string;
    error?: EntryError | null | undefined;
    paypalUrl?: string;
}

type EntryError = {
    message: string;
    originalError: any;
}

type Profile = {
    fname: string;
    lname: string;
    email: string;
    phone?: string;
    housenumber?: string;
    address?: string;
    address2?: string;
    zip?: string;
    state?: string;
    city?: string;
    country?: string;
    dob?: Date;
    instagram?: string;
    paypal?: string;
}

type UserAccount = { 
    email: string;
    password: string;
}