import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";

import { darkBackground } from "../../components/components";

// Global style of Access Components (Join, Login)
export const AccessStyle = () => (
    <Box>
        {/* Adding background with SVG repeat */}
        <style jsx global>{`
            body{
                background-color: ${darkBackground};
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='355' height='42.6' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%237f5af0' stroke-width='3.7' stroke-opacity='0.27'%3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E");
            }
        `}</style>
    </Box>
);

// Paper with custom properties (background color)
export const AccessPaper = styled(Paper)`
    ${({theme}) => `
        background-color: ${theme.palette.background.default};
    `}
`;