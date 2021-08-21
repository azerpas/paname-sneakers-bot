import { FIXED_FEE, VARIABLE_FEE } from "@constants/stripe";
import Stripe from "stripe";

export const getVariableFee = (
    amount: number,
    stripeFormat?: boolean
): number => {
    return Number(( amount * (VARIABLE_FEE/100) + 0.01 ).toFixed(2));
}

/**
 * Get Stripe Total amount with variable fee and fixed fee.
 * 5€ = 500
 * @param amount 
 * @returns number
 * 500 + Math.round(500*0.029) + 0.25*100
 * 500 + 15 + 25
 * = 5€ + 0.15€ + 0.25€ = 5.4€
 */
export const getStripeTotal = (
    amount: number
): number => {
    return amount + Math.round(amount * (VARIABLE_FEE/100)) + (FIXED_FEE*100)
}

// 500 * 0.029 = 14,5