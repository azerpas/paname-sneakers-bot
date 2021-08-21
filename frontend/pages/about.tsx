import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '../src/Link';

export default function About() {
	return (
		<Container maxWidth="sm">
			<Box my={4}>
				<Typography color="secondary" variant="h4" component="h1" gutterBottom>
					Next.js with TypeScript example
				</Typography>
				<Link href="/">Go to the main page</Link>
			</Box>
		</Container>
	);
}
