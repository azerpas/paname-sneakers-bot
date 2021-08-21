import React, { FormEvent, useState } from "react";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// MUI & Style
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import Modal from "@material-ui/core/Modal";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import { StripeBox, StripePaper, CARD_ELEMENT_OPTIONS, StripeForm, StripeCard, StripeButton,RefillPaper,RefillButton, PaperCheckout } from "./index.style";
import { H3title } from "@components/typography/title";
import {Check} from "@styled-icons/boxicons-regular/Check";

import { usePaymentIntentMutation } from "@generated/client";
import { H3 } from "@components/card/raffle/index.style";
import { Boxx } from "@components/container";
import { getVariableFee } from "@services/stripe";
import { FIXED_FEE } from "@constants/stripe";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

type StripeStateType = [
    { completed: boolean; error: string; }, 
    React.Dispatch<React.SetStateAction<{ completed: boolean; error: string; }>>
];

type CheckoutProps = {
    StripeState: StripeStateType,
    email: string,
    uid: string,
    customerId: string
}

const Checkout = ({
    StripeState,
    email,
    uid,
    customerId
}: CheckoutProps) => {

    const stripe = useStripe();
    const elements = useElements();
    const [stripeStatus, setStripeStatus] = StripeState;
    // States
    const [clientSecret, setClientSecret] = useState("");
    const [balanceError, setBalanceError] = useState("");
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState(5);
    const [paymentLoading, setPaymentLoading] = useState(false);
    
    const [paymentIntent, {loading: paymentIntentLoading}] = usePaymentIntentMutation();

    const closeModal = () => {
        if(paymentLoading) return;
        setOpen(false);
        setStripeStatus({completed: false, error: ""});
        setClientSecret("");
    }

    const initCharge = async () => {
        try{
            if(amount < 2) throw new Error("Please enter an amount superior or egal to 2€");
            const { data } = await paymentIntent({variables: {amount: amount*100, balance: true, customerId}});
            setClientSecret(data?.paymentIntent.id!);
            setOpen(true);
        }catch(e){
            setBalanceError(`Error: ${e.message}\n Please try again in a few minutes or contact an admin at hello@paname.io`);
        }
    }

    const handlePayment = async (event: FormEvent) => {
        event.preventDefault();
        setPaymentLoading(true);
        if(!stripe || !elements){
            const error = "Stripe is not initialized, please contact an admin";
            setStripeStatus({...stripeStatus, error});
            setPaymentLoading(false);
            throw new Error(error);
        }
        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements?.getElement(CardElement)!,
                    billing_details: {
                        email
                    },
                    metadata:{
                        "type": "balance",
                        "userUid": uid
                    }
                }
            });
            if (result.error) {
                setStripeStatus({...stripeStatus, error: result.error.message!});
                setPaymentLoading(false);
                throw new Error(result.error.message);
            }else {
                if(result.paymentIntent){
                    if (result.paymentIntent.status === "succeeded") {
                        setStripeStatus({completed: true, error: ""});
                        setPaymentLoading(false);
                    }
                }
                else{
                    setStripeStatus({...stripeStatus, error: "Unknow error: "+result})
                    setPaymentLoading(false);
                }
            }
        } catch (error) {
            setStripeStatus({...stripeStatus, error: error.message})
            setPaymentLoading(false);
        }
    }

    return (
        <PaperCheckout elevation={3}>
            <Boxx p={2}>
                <H3>Top-up your balance 💰</H3>
                <RefillPaper elevation={3}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            type="number"
                            value={amount}
                            inputProps={{min: 2}}
                            onChange={(e) => {
                                setAmount(parseInt(e.target.value));
                                setBalanceError("");
                            }}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            labelWidth={60}
                            error={balanceError !== "" ? true : false}
                        />
                        {balanceError !== "" ? <FormHelperText>{balanceError}</FormHelperText> : null}
                    </FormControl>

                    <Modal
                        open={open}
                        onClose={() => closeModal()}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                            <StripeBox>
                                <StripePaper elevation={3}>
                                    <Container style={{display: "inline-block"}}>
                                        <StripeForm onSubmit={handlePayment}>
                                            <H3title>Fill your informations</H3title>
                                            <p>
                                                Your balance will be increased by {amount}€<br/>
                                                <small>Please proceed to the payment through our partner Stripe</small>
                                            </p>
                                            <ul>
                                                <li>Stripe variable fees (2,9%): {getVariableFee(amount)}€</li>
                                                <li>Stripe fixed fees: {FIXED_FEE}€</li>
                                                <li>Total: {amount+getVariableFee(amount)+FIXED_FEE}€</li>
                                            </ul>
                                            <StripeCard
                                                id="card-element"
                                                options={CARD_ELEMENT_OPTIONS}
                                                onChange={(event) => { 
                                                    event.error ? 
                                                    setStripeStatus({...stripeStatus, error: event.error.message}) :
                                                    setStripeStatus({...stripeStatus, error: ""})}
                                                }
                                            />
                                            <Typography color="error">{stripeStatus.error}</Typography>
                                            <StripeButton type="submit" disabled={stripeStatus.completed}>
                                                {   paymentLoading ? 
                                                    <CircularProgress color="secondary"/>
                                                    :
                                                    "Submit payment"
                                                }
                                            </StripeButton>
                                        </StripeForm>
                                        {
                                            stripeStatus.completed ?
                                            <>
                                                <Typography style={{margin: "0.7rem 0", fontWeight: 800}} align="center">
                                                    <Check width="20%"/><br/>
                                                    Payment made successfully, it should take a few seconds to appear on your account
                                                </Typography>
                                                <p>You can close this pop up by clicking anywhere outside of it</p>
                                            </> : null
                                        }
                                        <p></p>
                                    </Container>
                                </StripePaper>
                            </StripeBox>
                    </Modal>
                    
                </RefillPaper>
                <RefillButton fullWidth variant="contained" onClick={() => initCharge()}>{paymentIntentLoading ? " Loading ..." : "Recharge"}</RefillButton>
            </Boxx>
        </PaperCheckout>
    );
}

export default Checkout;