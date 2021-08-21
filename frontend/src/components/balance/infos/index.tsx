import { H3title } from "@components/typography/title";
import { InfosPaper,InfosTitle, InfosText } from "./index.style";
import Box from "@material-ui/core/Box";

export const Infos = () => {
    return(
        <InfosPaper >
          <Box  py={8}>
                <InfosTitle>ENTRIES PRICE</InfosTitle>
                
                <InfosText>For each entries your Balance will dimiss by the amount of power required for this action. ⚡</InfosText>
                <InfosText>Paname uses powerfull proxies which allows to enter all raffles. 🔥</InfosText>
                <InfosText>The price for each entries will depends on which website you choose. You can know the price of your task before launching it ! 🚀 </InfosText>
                </Box>
        </InfosPaper>
    );
}