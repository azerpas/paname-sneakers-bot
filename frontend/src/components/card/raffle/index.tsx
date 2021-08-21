import { Card as Crd, H4, H3, Header, Body, Sku, Date, Colorway } from "./index.style";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import {RadioButtonUnchecked} from "@styled-icons/material-rounded/RadioButtonUnchecked";
import {RadioButtonChecked} from "@styled-icons/material-rounded/RadioButtonChecked";
import { Dispatch, SetStateAction } from "react";

interface IRaffleCard {
    id: number;
    title: string;
    imgUrl?: string;
    website: string;
    sku?: string;
    colorway?: string;
    releaseAt?: string;
    currentRaffle: number;
    setRaffle: Dispatch<SetStateAction<number>>;
}

const Card = (props: IRaffleCard) => {
    if(!props.website){
        return(
            <Crd>
                <Header>
                    <div style={{marginRight: "0.7rem"}}>
                        <H4>{props.website}</H4>
                        <H3>{props.title}</H3>
                    </div>
                    {props.imgUrl ? 
                        <Avatar alt={props.title} src={props.imgUrl}/>
                        : 
                        <Avatar>{props.title[0]}</Avatar>
                    }
                </Header>
                <Body>
                    <Sku># {props.sku}</Sku>
                    <Colorway>{props.colorway}</Colorway>
                    <Date>{props.releaseAt}</Date>
                </Body>
                <CardActions>
                    <IconButton onClick={() => props.setRaffle(props.id)}>
                        <RadioButtonUnchecked width="32px"/>
                    </IconButton>
                </CardActions>
            </Crd>
        );
    }
    return(
        <Crd selected={props.currentRaffle === props.id}>
            <Header>
                <div style={{marginRight: "0.7rem"}}>
                    <H4>{props.website}</H4>
                    <H3>{props.title}</H3>
                </div>
                {props.imgUrl ? 
                    <Avatar alt={props.title} src={props.imgUrl}/>
                    : 
                    <Avatar>{props.title[0]}</Avatar>
                }
            </Header>
            
            <CardActions>
                <Body>
                    <Sku># {props.sku}</Sku>
                    <Colorway>{props.colorway}</Colorway>
                    <Date>{props.releaseAt}</Date>
                </Body>
                {
                    props.currentRaffle !== props.id ? 
                        <IconButton aria-label="Select this raffle" onClick={() => props.setRaffle(props.id)}>
                            <RadioButtonUnchecked width="32px"/>
                        </IconButton>
                    :
                        <IconButton aria-label="Unselect this raffle" onClick={() => props.setRaffle(0)}>
                            <RadioButtonChecked width="32px"/>
                        </IconButton>
                }
                
            </CardActions>
        </Crd>
    );
}

export default Card