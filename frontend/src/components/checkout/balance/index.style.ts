import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import { white, darkGrey } from "@components/components";
import { CardElement } from "@stripe/react-stripe-js";
import Button from "@material-ui/core/Button";
import { CcMastercard } from "@styled-icons/fa-brands/CcMastercard";
import { greenPaname } from "@components/components";

export const StripeBox = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 35%;
    margin: 0 auto;
    height: 40vh;
    outline: none;
    @media (max-width: 780px){
        top: 35%;
        width: 80%;
    }
`;

export const StripePaper = styled(Paper)`
    background-color: ${darkGrey};
`;

export const StripeForm = styled.form`
    margin-top: 1.3rem;
`;

export const StripeCard = styled(CardElement)`
    background: ${white};
    border-radius: 4px;
    padding: 10px 12px;
    box-shadow: rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px;
    transition: box-shadow 150ms ease;
    &:focus{
        box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    }
    .StripeElement--focus{
        box-shadow: rgba(50, 50, 93, 0.109804) 0px 4px 6px, rgba(0, 0, 0, 0.0784314) 0px 1px 3px;
    }
`;

export const StripeButton = styled.button`
    margin-bottom: 0.9rem;
    white-space: nowrap;
    border: 0;
    outline: 0;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    color: #fff;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    background-color: #556CD6;
    text-decoration: none;
    -webkit-transition: all 150ms ease;
    transition: all 150ms ease;
    margin-top: 10px;
    float: right;
    &:hover {
        color: #fff;
        cursor: pointer;
        //background-color: #7795f8;
        filter: contrast(120%);
        transform: translateY(-1px);
        box-shadow: 0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
    }
    &:disabled{
        opacity: 0.6;
    }
    @media (max-width: 790px){
        width: 100%;
    }
`;

export const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

export const RefillPaper = styled(Paper)`
    margin-top: 1.2rem;
    ${({theme}) => `
        background-color: ${theme.palette.background.default};
    `}
`;

export const PaperCheckout = styled(Paper)`
    ${({theme}) => `
        background-color: ${theme.palette.background.default};
    `}
`;

export const RefillButton = styled(Button)`
    color: ${white};
    background-color: ${greenPaname};
    font-weight: 600;
    text-transform: capitalize;
    font-size:20px;
    margin-top:5px;
`;