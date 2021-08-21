import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styled from "styled-components";

import { Locales } from "@constants/faker";
import { JigSettings } from "@typeDefs/task";

const Accord = styled(Accordion)`
`;

type SetJigProps = {
    jigSettings: JigSettings, 
    setJigSettings: React.Dispatch<React.SetStateAction<JigSettings>>,
    jigActivated: boolean,
    setJigActivation: React.Dispatch<React.SetStateAction<boolean>>
}

export const SetJig = ({jigSettings, setJigSettings, jigActivated, setJigActivation}: SetJigProps) => {
    return(
        <Accord>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-label="Expand"
            aria-controls="additional-actions1-content"
            id="additional-actions1-header"
            >
            <FormControlLabel
                aria-label="Activate fake data gen on empty cells"
                onClick={(event) => { event.stopPropagation(); setJigActivation(!jigActivated) }}
                control={<Checkbox />}
                value={jigActivated}
                label="Generate fake data on empty cells"
            />
            </AccordionSummary>
            <AccordionDetails>
                <Select
                    labelId="locale-label"
                    value={jigSettings.locale}
                    fullWidth
                    onChange={async (e) => {
                        //@ts-ignore
                        setJigSettings({locale: e.target.value});
                    }}
                    label="Choose your locale"
                    style={{minWidth:"120px"}}
                >
                    {
                        Locales.map((locale: any) => {
                            return <MenuItem key={locale} value={locale}>{locale}</MenuItem>;
                        })
                    }
                </Select>
            </AccordionDetails>
      </Accord>
    )
}