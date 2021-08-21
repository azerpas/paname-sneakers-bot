// MUI
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
// Style
import { Title } from "../../typography/title";
import { Paragraph } from  "../../typography/paragraph/paragraph";
import { Icon, GridItem } from "./feature.style";

interface props {title: string, paragraph: string, icon?: string, iconSize?: number};

export const Feature = ({title, paragraph, icon, iconSize}: props) => (
    <GridItem item xs={12} md={6}>
        <Card style={{height: "100%"}}>
            <CardContent>
                <Box display="inline-flex">
                    { icon ? 
                    <Icon name={icon} size={iconSize ? iconSize : 2} />
                    :
                    ``
                    }
                    <Box ml={2}>
                        <Title size={2.5} variant="h4" component="h4">{title}</Title>
                    </Box>
                </Box>
                <Paragraph>{paragraph}</Paragraph>
            </CardContent>
        </Card>
    </GridItem>
);