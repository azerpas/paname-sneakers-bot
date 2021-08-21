import styled from "styled-components";
import { darkBlue } from "@components/components";
import Paper from "@material-ui/core/Paper";

export const TitleDOC = styled.h1`
    text-align: Left;
    font-size:30px;
    font-weight:bold;
    margin-bottom:0px;
    & span {
        display: block;
    }
    @media (max-width: 1000px){
        font-size:15px;
        float:left;
    }
`;
export const SubTitleDOC = styled.h1`
    text-align: Left;
    font-size:20px;
    margin-top:0px;
    color:#868686;
    overflow-wrap: anywhere;


    @media (max-width: 1000px){
        font-size:10px;
        float:left;
        
    }
`;

export const DocBanner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;
export const Window = styled.div`
    background: #fff;
    width: 50vw;
    margin: auto;
    margin-top: 6.5vh;
    border: 1px solid #16161a;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    box-shadow: 0px 0px 20px black;
    
`;


export const Span = styled.div`
    line-height: 9px;
    vertical-align: 50%;    
`;
  
export const Titlebar = styled.div`
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0.0, #ebebeb, color-stop(1.0, #d5d5d5)));
    background: -webkit-linear-gradient(top, #16161a, #d5d5d5);
    background: -moz-linear-gradient(top, #ebebeb, #d5d5d5);
    background: -ms-linear-gradient(top, #ebebeb, #d5d5d5);
    background: -o-linear-gradient(top, #ebebeb, #d5d5d5);
    background: linear-gradient(top, #ebebeb, #d5d5d5);
    color: #4d494d;
    font-size: 11pt;
    line-height: 20px;
    text-align: center;
    width: 100%;
    height: 22px;
    border-top: 1px solid #f3f1f3;
    border-bottom: 1px solid #b1aeb1;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    cursor: default;
`;
  

export const Close = styled.div`
    background: #ff5c5c;
    font-size: 9pt;
    width: 11px;
    height: 11px;
    border: 1px solid #e33e41;
    border-radius: 50%;
    display: inline-block;  
    &:after {
    background: #c14645;
    border: 1px solid #b03537;
    }
    &:active {
    color: #4e0002;
    }
`;

export const Buttons = styled.div`
    padding-left: 8px;
    padding-top: 3px;
    float: left;
    text-align:center;
    margin-right:-40px;
    line-height: 0px;
    &:hover {
    visibility: visible;
    }
`;

export const Zoombutton = styled.a`
    color: #006519;
    visibility: hidden;
    cursor: default;
`;

export const CloseButton = styled.a`
    color: #820005;
    visibility: hidden;
    cursor: default;
`;
  
export const Minimize = styled.div`
    background: #ffbd4c;
    font-size: 9pt;
    line-height: 11px;
    margin-left: 4px;
    width: 11px;
    height: 11px;
    border: 1px solid #e09e3e;
    border-radius: 50%;
    display: inline-block;
    &:active {
    background: #c08e38;
    border: 1px solid #af7c33;
    }
`;

export const Minimizebutton = styled.a`
    color: #9a5518;
    visibility: hidden;
    cursor: default;
`;
  
export const Zoom = styled.div`
    background: #00ca56;
    font-size: 9pt;
    line-height: 11px;
    margin-left: 6px;
    width: 11px;
    height: 11px;
    border: 1px solid #14ae46;
    border-radius: 50%;
    display: inline-block;
    &:active {
    background: #029740;
    border: 1px solid #128435;
    color: #003107;
    }
`;