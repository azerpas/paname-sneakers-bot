// React & Next
import React, { useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import "reflect-metadata";
import dynamic from 'next/dynamic';

// Style
import { StylesProvider, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppTheme from '../src/theme';

// Apollo
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../src/apollo/client';

// Misc
import SessionContext from '@context/session';
import NProgress from 'nprogress';
import '@components/progress/nprogress.css';
import withApollo from 'src/apollo/withApollo';
import { SWRConfig } from 'swr';
import { signOut } from '@utils/auth/sessionHandler';


Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, session }: any /* TODO: AppProps */) {
	const apolloClient= useApollo(pageProps.initialApolloState);
	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement!.removeChild(jssStyles);
		}
	}, []);
	const CrispDynamic = dynamic(() => import("@components/crisp"))

	return (
		<React.Fragment>
			<Head>
				<title>paname.io</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>
			<SWRConfig value={{
				onError: (err) => {
					if(err.message === "401") signOut();
				}
			}}>
				<SessionContext.Provider value={session}>
					<ApolloProvider client={apolloClient}>
						<MuiThemeProvider theme={AppTheme}>
							<StyledThemeProvider theme={AppTheme}>
								<StylesProvider injectFirst>
									{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
									<CssBaseline />
									<Component {...pageProps} />
								</StylesProvider>
							</StyledThemeProvider>
						</MuiThemeProvider>
					</ApolloProvider>
				</SessionContext.Provider>
			</SWRConfig>
			<CrispDynamic/>
		</React.Fragment>
	);
}

//export default MyApp

//MyApp.getServerSideProps = async (appContext: any /* TODO: AppContext */) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
/*
	const { Component, ctx } = appContext;
	const isServer = ctx.req || ctx.res;
	const { session } = nextCookie(ctx);
	console.log(`App: SSR Session: ${session}`);
	if(Component.isAuthorized && !Component.isAuthorized(session)){
		if (isServer) {
			ctx?.res?.writeHead(302, { Location: ROUTES.JOIN });
			ctx?.res?.end();
		} else {
			Router.push(ROUTES.LOGIN);
		}
		return {};
	}
	const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
	
	return { pageProps, session }
}
*/

export default withApollo(MyApp);
