import { H3title } from "@components/typography/title"
import { WebsitesPaper, Colored } from "./index.style"
import Box from "@material-ui/core/Box";
import Skeleton from '@material-ui/lab/Skeleton';

const red = "#FF4500";
const orange = "#FFA700";
const green = "#11FC00";

export const Websites = ({websites}: {websites: any}) => {
    const now = new Date();
    if(websites !== undefined){
        return(
            <WebsitesPaper elevation={3}>
                <Box px={3} py={2}>
                    <H3title>Websites</H3title>
                    <div><Colored color={green}>{websites.filter((site: any) => new Date(site.node.lastTestedAt).getDay() === now.getDay()).length}</Colored> sites <Colored color={green}>tested</Colored> today</div>
                    <div><Colored color={orange}>{websites.filter((site: any) => new Date(site.node.lastTestedAt).getDay() !== now.getDay()).length}</Colored> sites <Colored color={orange}>not tested</Colored> today</div>
                    <div><Colored color={red}>{websites.filter((site: any) => site.node.working !== true).length}</Colored> sites <Colored color={red}>not working</Colored> today</div>
                    <ul>
                    {
                        websites.map((site: any) => {
                            if(!site.node.published) return null;
                            return (
                                <li key={site.node.name}>
                                    <Colored 
                                        color={
                                            site.node.working !== true ? red : 
                                                (
                                                    new Date(site.node.lastTestedAt).getDay() === now.getDay() ? green : orange
                                                )
                                        }
                                        website
                                    >
                                        {site.node.name}
                                    </Colored>
                                </li>
                            );
                        })
                    }
                    </ul>
                </Box>
            </WebsitesPaper>
        );
    }
    return(
        <WebsitesPaper elevation={3}>
            <Box px={3} py={2}>
                <H3title>Websites</H3title>
                <div><Colored color={green}><Skeleton variant="text" animation="wave" width={10}/></Colored> sites <Colored color={green}>tested</Colored> today</div>
                <div><Colored color={orange}><Skeleton variant="text" animation="wave" width={10}/></Colored> sites <Colored color={orange}>not tested</Colored> today</div>
                <div><Colored color={red}><Skeleton variant="text" animation="wave" width={10}/></Colored> sites <Colored color={red}>not working</Colored> today</div>
                <ul>
                    <li><Skeleton variant="text" animation="wave"/></li>
                    <li><Skeleton variant="text" animation="wave"/></li>
                </ul>
            </Box>
        </WebsitesPaper>
     );
    
}