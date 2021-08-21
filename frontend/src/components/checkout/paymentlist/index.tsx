//React
import React, { useState } from "react";

// Components
import { H3title } from "@components/typography/title";
import Box from "@material-ui/core/Box";
import { BalancePaper,SeeMoreButton } from "./index.style";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';

//Stripe (Graphql Query)
import { usePaymentIntentListQuery } from "@generated/client";

type PaymentProps = {
    customerId: string
}



export const PaymentList = ({customerId}:PaymentProps) => {
    const [limit, setLimit] = useState(3);
    const { loading, error, data } = usePaymentIntentListQuery({variables: {customerId: customerId, limit:limit }});
    return (
    <BalancePaper elevation={3}>
        <Box px={2} py={2}>
            <H3title mb={0}>Transaction History</H3title>
        </Box>
        <TableContainer>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Type</TableCell>
                    <TableCell align="center">Amount (€)</TableCell>
                </TableRow>
            </TableHead>
            
            <TableBody>
                {
                    data === undefined ? 
                    <TableRow>
                        <TableCell align="center"> <Skeleton animation="wave" variant="text"/> </TableCell>
                        <TableCell align="center"> <Skeleton animation="wave" variant="text"/> </TableCell>
                        <TableCell align="center"> <Skeleton animation="wave" variant="text"/> </TableCell>
                    </TableRow>
                    :
                    data.paymentIntentList.map(transaction => {
                        return(
                            <TableRow>
                                <TableCell align="center">{transaction.date.toString()}</TableCell>
                                <TableCell align="center">{transaction.type}</TableCell>
                                <TableCell align="center">{(transaction.amount / 100).toFixed(2)}</TableCell>
                            </TableRow>
                        );
                    })  
                }
                
            </TableBody>
            </Table>
        </TableContainer>
            <SeeMoreButton fullWidth onClick={() => {setLimit(10);}}>See More</SeeMoreButton>
    </BalancePaper>
        
    );
  }


