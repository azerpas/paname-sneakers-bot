import { useEffect } from 'react'
import Router from 'next/router'
import useSWR from 'swr'
import cookie from 'js-cookie';

import { ServerRequest, ServerResponse } from '@typeDefs/server';
import * as ROUTES from '@constants/routes';
import { ApolloClient } from '@apollo/client';

export const signOut = (req?: ServerRequest, res?: ServerResponse, apolloClient?: any ) => {
    const isServer = req || res;
    
    if (apolloClient){
        apolloClient.cache.reset();
        apolloClient.resetStore();
    }

    if (isServer) {
        if(!res?.headersSent){ // Check if res already gave response
            res?.writeHead(302, { Location: ROUTES.LOGIN });
            res?.end();
        }
    } else {
        cookie.remove('session');
        cookie.remove('token');
        window.location.href = ROUTES.LOGIN;
    }
};

export const toSubscription = (req?: ServerRequest, res?: ServerResponse, apolloClient?: any ) => {
    const isServer = req || res;
    if (isServer) {
        if(!res?.headersSent){ // Check if res already gave response
            res?.writeHead(302, { Location: ROUTES.DASHBOARD });
            res?.end();
        }
    } else {
        window.location.replace(ROUTES.DASHBOARD);
    }
}

export const toDashboard = (req?: ServerRequest, res?: ServerResponse, apolloClient?: any ) => {
    const isServer = req || res;
    if (isServer) {
        if(!res?.headersSent){ // Check if res already gave response
            res?.writeHead(302, { Location: ROUTES.DASHBOARD });
            res?.end();
        }
    } else {
        window.location.replace(ROUTES.DASHBOARD);
    }
} 

export const setSession = (user: any) => {
	// Log in.
	if (user) {
		return user.getIdToken().then((token: string) => {
			return fetch('/api/login', {
				method: 'POST',
				// TODO: eslint-disable-next-line no-undef
				headers: new Headers({ 'Content-Type': 'application/json' }),
				credentials: 'same-origin',
				body: JSON.stringify({ token }),
			})
		})
	}
	
	// Log out.
	return fetch('/api/logout', {
		method: 'POST',
		credentials: 'same-origin',
	})
}

export const useUser = () => {
    const swr = useSWR(ROUTES.API_USER)
    useEffect(() => {
            if (swr.data && !swr.data.user) {
                // redirect to login
                Router.push(ROUTES.LOGIN)
            }
    }, [swr.data])
    //@ts-ignore
    swr.isLoggedOut = swr.data && !swr.data.user
    //@ts-ignore
    swr.user = swr.data?.user

    return swr
}