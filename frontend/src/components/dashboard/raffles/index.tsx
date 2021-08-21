import { H3title,H4title } from "@components/typography/title";
import { RafflePaper, Info,StatsPaper,RaffleInfos,TitleRaffle } from "./index.style";
import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

export const Raffles = ({websites}: {websites: any}) => {

    const getCurrentDate=()=>{

        const date = ("0" + new Date().getDate()).slice(-2);
        const month = ("0" + (new Date().getMonth() + 1)).slice(-2);
        const year = new Date().getFullYear();

        const hours =("0" + new Date().getHours()).slice(-2);
        const mins = ("0" +new Date().getMinutes()).slice(-2);
        const seconds = ("0" +new Date().getSeconds()).slice(-2);
  
        return year + '-' + month + '-' + date +"T"+hours+":"+mins+":"+seconds+"+00:00" ;
  }
    return(
        <StatsPaper elevation={3}>
            <Box px={3} py={2}>
                <H3title mb={0.4}>New raffles</H3title>
                <Typography variant="body2">Checkout the latest raffles available per websites on paname.io, then select your the website in "Create tasks" above to start making your entries</Typography>
                {
                    websites === undefined ? <Skeleton animation="wave" variant="text"/> 
                    :
                        websites.map((site: any) => {
                            if(!site.node.published) return null;
                            return (
                                <div key={site.node.id}>
                                    
                                    <H4title>{site.node.name}</H4title>
                                    
                                    {
                                        site.node.raffles.edges.length == 0 ?
                                            <>No raffles available</>
                                        :
                                        <>
                                            {
                                                site.node.raffles.edges.map((edge:any) => {
                                                    return (
                                                        <div key={edge.node.id}>
                                                            {edge.node.endAt > getCurrentDate() ? 
                                                                <RafflePaper>
                                                                        <Avatar alt={edge.node.product.name} src={edge.node.product.imageUrl} variant="square" style={{width:"30%",marginRight:" 4px", borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px"}}/>
                                                                        <RaffleInfos>
                                                                            <TitleRaffle style={{fontWeight:"bold"}}>{edge.node.product.name}   <div style={{marginLeft:"5px",color:"green"}}> #{edge.node.product.pid}</div></TitleRaffle> 
                                                                            <Info >{edge.node.product.colorway}</Info>  
                                                                        </RaffleInfos>
                                                                </RafflePaper>
                                                            : ""}
                                                        </div>
                                                    );
                                                })
                                            }
                                            <p style={{textAlign: "center"}}>End of the raffles available...</p>
                                        </>
                                    }

                                </div>
                            );
                        })
                    }
            </Box>
        </StatsPaper>
    );
}