import { useState } from "react";

// MUI & Style
import { Button } from "@components/dashboard/tasks/index.style";
import { useStripe } from "@stripe/react-stripe-js";

import { useCreateSessionMutation } from "@generated/client";

//Button
import {SubscriptionButton} from "./index.style";

type SubscriptionProps = {
    email: string,
    priceId: string,
    customerId?: string
    addLabel?: string;
}

const Subscription = ({
    email,
    priceId,
    customerId,
    addLabel
}: SubscriptionProps) => {
    // State
    const [checkoutError, setCheckoutError] = useState("");
    //Stripe
    const stripe = useStripe();
    // Mutation
    const [createSession, {loading: createSessionLoading}] = useCreateSessionMutation();

    const createCheckout = async () => {
        if(!stripe) return;
        const { data } = await createSession({variables: {priceId, customerId}});
        stripe.redirectToCheckout({ sessionId: data?.createSession.id! })
            .then((result: any)=>{
                setCheckoutError(result.error.message)
            });
    }
    
    return (
        <>
            {checkoutError ? <p>{checkoutError}</p> : null}
            <SubscriptionButton 
                type="button" variant="contained" color="primary"
                disabled={createSessionLoading}
                // TODO: configure to disable when user is paying its subscription
                onClick={createCheckout}>
                {
                    createSessionLoading ? 
                    "Creating your session..."
                    :
                    `Configure your subscription${addLabel && addLabel}`
                }
            </SubscriptionButton>
        </>
    )
}

export default Subscription;