import { createContext } from 'react';

interface IToken {
    token: string;
    setToken: (s: string) => void;
} 

export const TokenContext = createContext<IToken>({} as IToken);