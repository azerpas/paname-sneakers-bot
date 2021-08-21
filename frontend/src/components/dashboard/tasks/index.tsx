// React
import React, { useEffect, useState } from "react";
import useSWR from "swr";

// Components 
import { NumberOfTasks, Button, NewChip } from "./index.style";
import { Importer } from "@components/importer/index";
import { AccessPaper } from "@components/access/access.style";
import { H3title } from "@components/typography/title";
import Raffle from "@components/card/raffle";

// Style
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Import } from "@styled-icons/boxicons-regular/Import";
import { Tick } from "@styled-icons/typicons/Tick";
import { Times } from "@styled-icons/typicons/Times";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { greenPaname, red } from "@components/components"
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import Skeleton from "@material-ui/lab/Skeleton";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import SaveAltSharpIcon from '@material-ui/icons/SaveAltSharp';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import HelpIcon from '@material-ui/icons/Help';

// Apollo
import { GET_GUIDE, GET_RAFFLES } from "@utils/api/graphql/queries";
import { client } from "@utils/api/graphql";
import { TaskInfos, useCreateTaskMutation } from "@generated/client";

// Misc 
import { TasksContext } from "@context/tasks";
import { Website } from "@typeDefs/website";
import { StateBtn } from "@components/button/button";
import { cCost } from "@constants/tasks";
import { SetJig } from "@components/accordion";
import { exportBaseFile, exportTasks } from "@components/exporter";

export const Tasks = ({websites, balance, token, admin}: {websites: any, balance: number | null, token?: string, admin?: boolean}) => {
    /**
     * @typedef {TaskInfos[]} state — Array containing all the users tasks from the Excel file
     */
    const [state, setState] = useState<TaskInfos[]>([]);
    const [website, setWebsite] = useState<Website>({id: -1, name:"", fields: [], handledBy: "f"});
    const [currentRaffle, setRaffle] = useState<number>(0);
    const [jigActivated, setJigActivation] = useState<boolean>(false);
    const [jigSettings, setJigSettings] = useState<{locale: string}>({locale: "en"});
    const [delay, setDelay] = useState<{activated: boolean, value: number, sizeOfBatch: number}>({activated: false, value: 5000, sizeOfBatch: 0});
    const [createTasks, {loading: createTasksLoadingApollo, error: createTasksErrorApollo}] = useCreateTaskMutation();
    const [error, setError] = useState<{message: string | null, problem: boolean}>({message: null, problem: false});
    const [created, setCreated] = useState<boolean>(false);
    const [creationWithDelay, setCreationWithDelay] = useState<{loading: boolean, message: string | null}>({loading: false, message: null});

    const {data: raffles, error: rafflesError} = useSWR(
        () => website.id !== -1 ? [token, GET_RAFFLES, website] : null, 
        (token, GET_RAFFLES, website) => client(token,GET_RAFFLES,{websiteId: website.id}), 
        { dedupingInterval: 10000, focusThrottleInterval: 10000 }
    );

    const {data: guide, error: guideError} = useSWR(
        () => website.guide ? [token, GET_GUIDE, website] : null, 
        (token, GET_GUIDE, website) => client(token, GET_GUIDE, { id: website.guide.id }), 
        { dedupingInterval: 10000, focusThrottleInterval: 10000 }
    );

    const getRequiredBalance = () => {
        return ((website.estimatedCaptchaCost ? website.estimatedCaptchaCost : 0.0) * state.length) + ((website.estimatedProxyCost ? website.estimatedProxyCost : 0.0) * state.length) + ((website.handledBy === "c" ? cCost : 0.0) * state.length);
    }

    const onCreateTasks = async () => {
        setError({message: null, problem: false})
        if(delay.activated && delay.sizeOfBatch !== 0){
            const batchs = separeTasks(state);
            setCreationWithDelay({message: `Pushing batches of tasks gradually... ⌛️`, loading: true});
            await new Promise(resolve => setTimeout(resolve, 2000));
            let batchnb = 0;
            let nbOfBatchs = batchs.length;
            for(let batch of batchs){
                batchnb += 1;
                setCreationWithDelay({message: `Pushing batch n°${batchnb}/${nbOfBatchs}...`, loading: true});
                const data = await createTasks({variables: {
                    website: website.id.toString(),
                    tasks: batch,
                    raffle: currentRaffle.toString()
                }});
                if(data.data?.CreateTasks.success){
                    let sleepTime = (delay.value < 5000) || (delay.value > 300000) ? 5000 : delay.value;
                    setCreationWithDelay({message: `Successfully pushed batch n°${batchnb}/${batchs.length}. Now sleeping ${sleepTime}ms... 😴`, loading: true});
                    await new Promise(resolve => setTimeout(resolve, sleepTime));

                    setCreated(true);
                    setCreationWithDelay({message: null, loading: false});
                }
            }
        }else{
            const data = await createTasks({variables: {
                website: website.id.toString(),
                tasks: state,
                raffle: currentRaffle.toString()
            }});
            if(data.data?.CreateTasks.success){
                setCreated(true);
            }
        }
    }
    
    const separeTasks = (tasks: TaskInfos[]): TaskInfos[][] => {
        let size = delay.sizeOfBatch;
        if(size < 5) size = Math.round(state.length/4) !== 0 ? Math.round(state.length/4) : 30;
        let arrayOfBatch = [];
        for (var i=0; i<tasks.length; i+=size) {
            arrayOfBatch.push(tasks.slice(i,i+size));
        }
        return arrayOfBatch;
    }

    if(state.length > 0 && website.name.length > 1 && website.name !== ""){
        return(
            <AccessPaper elevation={3}>
                <Box px={3} py={2}>
                    <H3title>Create tasks</H3title>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <NumberOfTasks>{state.length}</NumberOfTasks>
                            <H3title style={{display: "inline"}}> tasks loaded</H3title>
                            <H3title secondary={true} style={{marginTop: 0}}>{website.name}</H3title>
                            <Button variant="contained" fullWidth color="secondary" startIcon={<SettingsBackupRestoreIcon/>} onClick={() => { setState([]); setJigActivation(false); }}>Reset tasks</Button>
                            <Button variant="contained" fullWidth style={{marginTop: "0.7rem"}} startIcon={<SaveAltSharpIcon/>} onClick={() => { exportTasks(state) }}>Export/Modify tasks</Button>
                        </Grid>
                        <Grid item xs={12} md={6} wrap="nowrap" zeroMinWidth>
                            <div style={{display: "flex", overflow: "auto"}}>
                                {
                                    raffles ?
                                        raffles.collectionQueryRaffles.edges.length > 0 ?
                                            raffles.collectionQueryRaffles.edges.map((raffle: any) => {
                                                if(raffle.node.endAt < new Date().toISOString()) return null; 
                                                return <Raffle key={raffle.node._id} id={raffle.node._id} website={website.name} title={raffle.node.product.name} imgUrl={raffle.node.product.imageUrl} sku={raffle.node.product.pid} colorway={raffle.node.product.colorway} releaseAt={raffle.node.endAt} currentRaffle={currentRaffle} setRaffle={setRaffle}/>
                                            })
                                        :
                                        <Typography variant="h4" component="h4" color="textPrimary">No raffles found, come back later</Typography>
                                    : 
                                    <Skeleton variant="text" animation="wave" />
                                }
                            </div>
                        </Grid>
                        {
                            raffles && raffles.collectionQueryRaffles.edges.length > 0 ?
                                <Grid item xs={12} md={6}>
                                    <ul style={{listStyle: "none", paddingLeft: 0}}>
                                        {
                                            website.handledBy === "c" ? 
                                            <li>
                                                <div>⚠️ This website is using an advanced technology, the cost is higher than a regular instance.</div>
                                            </li>
                                            : ''
                                        }
                                        <li>
                                            <div>Balance sufficient { (balance ? balance : 0) > getRequiredBalance() ? <Tick width={20} style={{color: greenPaname}}/> : <Times width={20} style={{color: red}}/> }</div>
                                        </li>
                                        <li>
                                            <div>Proxy country 🇫🇷</div>
                                        </li>
                                        <li>
                                            <div>This will cost you <b>{getRequiredBalance() < 0.01 ? 0.01 : getRequiredBalance()}€</b></div>
                                        </li>
                                        <li>
                                            <div
                                                ><Checkbox
                                                    checked={delay.activated}
                                                    onChange={() => setDelay({...delay, activated: !delay.activated})}
                                                    name="checkedDelay"
                                                    color="primary"
                                                />
                                                Delay between tasks
                                                <NewChip variant="outlined" color="primary" size="small" label="New" />
                                                <NewChip variant="outlined" color="default" size="small" label="In beta" />
                                                { delay.activated ? 
                                                    <>
                                                        <FormControl style={{display: "block", marginBottom: "0.4rem"}}>
                                                            <InputLabel>Delay between batch of tasks (in ms)</InputLabel>
                                                            <Input
                                                                defaultValue={5000}
                                                                type="number"
                                                                fullWidth
                                                                onChange={(e) => setDelay({...delay, value: parseInt(e.target.value)})}
                                                                inputProps={{  min: 5000, max: 300000  }}
                                                            />
                                                        </FormControl>
                                                        <FormControl style={{display: "block"}}>
                                                            <InputLabel>How much tasks per batch (default: 30)</InputLabel>
                                                            <Input
                                                                onChange={(e) => setDelay({...delay, sizeOfBatch: parseInt(e.target.value)})}
                                                                type="number"
                                                                fullWidth
                                                                inputProps={{  min: 5, max: 1000  }}
                                                            />
                                                        </FormControl>
                                                    </>
                                                    :
                                                    null
                                                }
                                            </div>
                                        </li>
                                    </ul>
                                    { createTasksErrorApollo ? 
                                    <Box mb={1}>
                                        <Typography color="error" variant="inherit">{createTasksErrorApollo.message}</Typography>
                                    </Box> : null }
                                    { error.problem ? 
                                    <Box mb={1}>
                                        <Typography color="error" variant="inherit">{error.message}</Typography>
                                    </Box> : null }
                                    <Button 
                                        onClick={onCreateTasks}
                                        type="button" 
                                        disabled={createTasksLoadingApollo || creationWithDelay.loading}
                                        variant="contained" size="large" fullWidth color="primary"
                                        style={{marginBottom: creationWithDelay.loading ? "0.6rem" : "none"}}
                                    >   
                                        <StateBtn content="Confirm and launch" isLoading={createTasksLoadingApollo}/>
                                    </Button>
                                    {
                                        creationWithDelay.loading ? 
                                            <Typography variant="inherit">
                                                {creationWithDelay.message}
                                            </Typography> 
                                        : null
                                    }
                                </Grid>
                            :
                            null
                        }
                    </Grid>
                </Box>
                <Snackbar open={created} autoHideDuration={6000} onClose={() => setCreated(false)}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setCreated(false)} severity="success">
                        Tasks successfully created
                    </MuiAlert>
                </Snackbar>
            </AccessPaper>
        );
    }
    if(websites !== undefined){
        return (
            <AccessPaper elevation={3}>
                <Box px={3} py={2}>
                    <H3title>Create tasks
                    {
                        guide ? 
                        <Tooltip
                            title={
                                <>
                                    <h2>{website.name} guide</h2>
                                    <ul style={{padding: 0, listStyleType: "none", margin: "none", textAlign: "left"}}>
                                        { guide.guide.email ? <li> 📧 {guide.guide.email}</li> : null }
                                        { guide.guide.address ? <li>🏠 {guide.guide.address}</li> : null }
                                        { guide.guide.phone ? <li>📱 {guide.guide.phone}</li> : null }
                                        { guide.guide.name ? <li>👤 {guide.guide.name}</li> : null }
                                        { guide.guide.instagram ? <li>📷 {guide.guide.instagram}</li> : null }
                                    </ul>
                                </>
                            } arrow placement="bottom"
                            style={{float: "right"}}
                        >
                            <NewChip variant="default" color="primary" size="small" label="Help me fill it (JIG)" icon={<HelpIcon/>} />
                        </Tooltip>
                        : null
                    }
                    </H3title>
                    
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel id="website-label">Start by choosing a website</InputLabel>
                        <Select
                            labelId="website-label"
                            value={website.name}
                            fullWidth
                            onChange={async (e) => {
                                //@ts-ignore
                                let node: Website = {name: e.target.value};
                                for(let w of websites){
                                    if(w.node.name == e.target.value){
                                        node = w.node;
                                    }
                                }
                                setWebsite(node);
                            }}
                            label="Start by choosing a website"
                            style={{minWidth:"120px"}}
                        >
                            {
                                websites.map((site: any) => {
                                    if(!site.node.published && !admin){
                                        return null;
                                    }
                                    return <MenuItem key={site.node.name} value={site.node.name}>{site.node.name}</MenuItem>;
                                })
                            }
                        </Select>
                    </FormControl>
                    {
                        website.id !== -1 ? 
                        <>
                            <TasksContext.Provider value={{
                                tasks: state,
                                setTasks: (t: TaskInfos[]) => {
                                    setState(t);
                                }
                            }}>
                                <Importer fieldsRequired={website.fields} type="tasks" jigSettings={jigSettings} jigActivated={jigActivated}>
                                    <Import width={32}/>
                                </Importer>
                            </TasksContext.Provider>
                            <Box mt={2}>
                                <Button variant="contained" onClick={() => exportBaseFile(website.name, website.fields)} fullWidth >Click here to download an Excel model</Button><br/>
                            </Box>
                            <Box mt={2}>
                                <SetJig jigSettings={jigSettings} setJigSettings={setJigSettings} jigActivated={jigActivated} setJigActivation={setJigActivation}/>
                            </Box>
                        </>
                        : null
                    }
                    
                </Box>
            </AccessPaper>
        );
    }
    return(
        <AccessPaper elevation={3}>
            <Box px={3} py={2}>
                <H3title>Create tasks</H3title>
                <FormControl variant="outlined">
                    <Skeleton variant="rect" width={150} height={50} animation="pulse" />
                </FormControl>
                <Box mt={2}>
                    <TasksContext.Provider value={{
                        tasks: state,
                        setTasks: (t: TaskInfos[]) => {
                            setState(t);
                        }
                    }}>
                        <Skeleton variant="rect" width="100%" height="10rem" animation="pulse"/>
                    </TasksContext.Provider>
                </Box>
            </Box>
        </AccessPaper>
    );
}