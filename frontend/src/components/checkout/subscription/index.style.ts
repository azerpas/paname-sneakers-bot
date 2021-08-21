import styled from "styled-components";
import { white, darkGrey } from "@components/components";
import Button from "@material-ui/core/Button";
import { greenPaname } from "@components/components";


export const SubscriptionButton = styled(Button)`
    color: ${white};
    background-color: ${greenPaname};
    font-weight: 600;
    text-transform: capitalize;
    font-size:20px;
    width:100%;
    margin-top:5px;
`;