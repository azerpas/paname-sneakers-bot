// React
import React from 'react';
// MUI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Style
import { Title } from "../../typography/title";
import { Paragraph } from  "../../typography/paragraph/paragraph";
import styled, { css } from 'styled-components';

export enum PlanType {
    FREE = "FREE",
    PAID = "PAID"
}

type NoticeProps = {
    type: PlanType,
    title: string
}

type plan = {
    price: number,
    list: Array<string>,
    checklist: Array<string>,
    footer?: string,
    primary: boolean
}

export class Plan extends React.Component<NoticeProps>{
    constructor(props: NoticeProps){
        super(props);
    }
    static defaultProps = {
        type: PlanType.PAID,
        title: "Get this"
    }
    paid: plan = {
        price: 30,
        list:["Unlimited entries","Support on every websites"],
        checklist:["Discord access","Power-proxies beta support","Account generator"],
        footer: "Also include every functionalities from the Free plan",
        primary: true
    }
    free: plan = {
        price: 0,
        list: ["2 free entries per month","Support on a few websites"],
        checklist: ["Captcha solver support"],
        primary: false
    }
    PlanCard = styled(Card)<{primary?: boolean}>`
        background-color: ${props => props.primary ? "#7f5af0" : "#1D1D22"};
        color: white;
    `;
    PlanButton = styled(Button)<{primary?: boolean}>` 
        width: 100%;
        background-color: ${props => props.primary ? "#5823FA" : "#72757E"};
        color: white;
        font-weight: 700;
    `;
    PlanText = styled(Typography)<{size?: number}>`
        display: inline;
        font-size: ${props => props.size ? props.size+"rem" : "inherit"};
        font-weight: bold;
    `;
    getPlan() {
        return this.props.type.toString().charAt(0) + this.props.type.toString().slice(1).toLowerCase();
    }
    Check () {
        return <svg xmlns="http://www.w3.org/2000/svg" width="24.853" height="18.599" viewBox="0 0 24.853 18.599"> <path data-name="fa-check" d="M8.441 18.234L.364 10.123a1.25 1.25 0 010-1.764l1.757-1.764a1.239 1.239 0 011.757 0l5.441 5.46L20.973.355a1.24 1.24 0 011.757 0l1.757 1.764a1.25 1.25 0 010 1.764L10.2 18.234a1.24 1.24 0 01-1.759 0z" fill="#00ff0a"/> </svg>;
    }
    getListElement({item, index, checked=false}: {item:string, index:number, checked?: boolean}){
        const ListItem = styled.li`
            list-style: none;
            font-size: 1.4rem;
        `;
        const Check = this.Check;
        return (
            <ListItem key={index}>
                <Box display="inline" mr={2}>
                    {checked && <Check/>}
                </Box>
                {item}
            </ListItem>
        );
    }
    render() {
        let plan = this.props.type === PlanType.FREE ? this.free : this.paid; 
        const PlanCard = this.PlanCard;
        const PlanButton = this.PlanButton;
        const PlanText = this.PlanText;
        return (
            <Grid item xs={12} md={6}>
                <Title size={2.5} variant="h4" component="h4">{this.getPlan()} plan</Title>
                <PlanCard primary={plan.primary}>
                    <CardContent>
                        <Title size={2.5} variant="h5" component="h5"><PlanText size={1.9}>€</PlanText>{plan.price}/<PlanText size={1.5}>mo</PlanText></Title>
                        <ul>
                            {plan.list.map((item: string, index:number) => this.getListElement({item, index}) )}
                        </ul>
                        <ul>
                            {plan.checklist.map((item: string, index:number) => this.getListElement({item, index, checked:true}) )}
                        </ul>
                        <PlanButton variant="contained" primary={plan.primary}>{this.props.title}</PlanButton>
                    </CardContent>
                </PlanCard>
            </Grid>
        );
    }
}