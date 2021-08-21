import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#ae93ff',
			main: '#7f5af0',
		},
		secondary: {
			main: '#242629',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#16161A',
		},
		type: 'dark'
	},
	typography: {
		fontFamily: 'proxima-nova'
	},
	overrides: {
		MuiContainer: {
			root: {
				"&$focused":{
					outline: "none"
				}
			}
		}
	}
});

export default theme;