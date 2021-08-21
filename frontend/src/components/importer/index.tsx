import React, { useContext, useRef, useState } from 'react';
import { Importer as Import, ErrMessage } from './index.style';
import { TasksContext } from "@context/tasks";
import { TaskInfos } from "@generated/client";
import { tasksFields as allFields } from "@constants/tasks";

import XLSX from 'xlsx';

import { JigSettings } from '@typeDefs/task';
import Typography from '@material-ui/core/Typography';
import { generateData } from '@services/faker';

type ImporterProps = { 
    type: string, fieldsRequired: string[] | undefined, children: React.ReactNode,
    jigActivated: boolean,
    jigSettings: JigSettings
}

export const Importer = ({type, fieldsRequired, children, jigActivated, jigSettings}: ImporterProps) => {
    const [dragged, setDragged] = useState(false);
    const [error, setError] = useState("");
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragged(true);
        setError("");
    };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragged(false);
        setError("");
    };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragged(true);
        setError("");
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragged(false);
        setError("");
        let files = e.dataTransfer.files, f = files[0];
        let reader = new FileReader();
        reader.onload = async (e) => {
            // @ts-ignore
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, {type: 'array'});
            let data_json = await to_json(workbook);
            extract(data_json)
                .then(list => context.setTasks(list))
                .catch((e) => console.error(e));
        };
        reader.readAsArrayBuffer(f);
    };
    const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");
        if(fileInput.current && fileInput.current.files){
            let files = fileInput.current.files, f = files[0];
            let reader = new FileReader();
            reader.onload = async (e) => {
                // @ts-ignore
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, {type: 'array'});
                let data_json = await to_json(workbook);
                extract(data_json)
                    .then(list => context.setTasks(list))
                    .catch((e) => console.error(e));
            };
            reader.readAsArrayBuffer(f);
        }else{
            return 0;
        }
    };

    const to_json = async (workbook: XLSX.WorkBook) => {
		let result = {};
		workbook.SheetNames.forEach((sheetName: string) => {
			let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
            if(roa.length){
                //@ts-ignore
                result[sheetName] = roa;
            }
		});
		return result;
    };
    const extract = async (data: any) => {
        let tasks: TaskInfos[] = [];
        let xlsx_name = Object.keys(data)[0];
        if(!fieldsRequired || fieldsRequired.length == 0){
            setError("Please choose a valid website to import tasks.");
            throw new Error("Please choose a valid website to import tasks.");
        }
        let fields = allFields.filter(e => fieldsRequired.indexOf(e) !== -1);
        let excelColumns: Array<string> = [];
        
        // 1. On récupère les index des colonnes nécessaires dans une array
        let indexsOfNeededColumns: Array<number> = [];

        // 2. On boucle sur les rows
        data[xlsx_name].forEach((row: any[],rowIndex: number)=>{
            // if table is empty
            if(row === [] || row.length === 0) return tasks;

            if(rowIndex === 0){
                excelColumns = row;
                row = row.filter(column => fields.indexOf(column.toLowerCase()) !== -1);
                fields = fields.slice().sort();
                row = row.slice().sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));
                if( 
                    fields.length !== row.length || 
                    !fields.every((value, index) => value.toLowerCase() === row[index].toLowerCase()) 
                ){
                    for(let i = 0; i < fields.length; i++){
                        if(fields[i].toLowerCase() !== row[i].toLowerCase()){
                            console.error(`${fields[i].toLowerCase()} != ${row[i].toLowerCase()}`)
                            let _error = `Missing column inside the Excel: have you forgot "${fields[i]}"?`;
                            setError(_error);
                            throw new Error(_error);
                        }
                    }
                }
                for(let i = 0; i < row.length; i++){
                    indexsOfNeededColumns.push(excelColumns.indexOf(row[i]))
                }
            }else{
                let task: TaskInfos = {size: "", fname: "", lname: "", email: ""};
                // 3. On boucle sur la liste d'index nécessaire en récupérant à chaque fois leur valeur
                for(let index of indexsOfNeededColumns){
                    if(row[index] === null || row[index] === undefined){

                        if(jigActivated){
                            // Give generate data name of the column
                            try {
                                row[index] = generateData(excelColumns[index].toLowerCase(), jigSettings.locale);
                            } catch (error) {
                                let _error = `Could not generate data at row: ${rowIndex+1} | column: "${excelColumns[index]}. ${error}"`;
                                setError(_error);
                                throw new Error(_error);
                            }
                        }else{
                            let _error = `Missing data at row: ${rowIndex+1} | column: "${excelColumns[index]}". If you want to auto generate data, consider checking the box below to activate data auto-generation.`;
                            setError(_error);
                            throw new Error(_error);
                        }
                    }
                    // 4. Grâce à l'index on peut récupérer le "name" d'une colonne
                    //@ts-ignore
                    task[excelColumns[index].toLowerCase()] = row[index].toString();
                }
                tasks.push(task);
            }
        });
        console.log(tasks);
        return tasks;
    }

    const context = useContext(TasksContext);
    const fileInput = useRef<HTMLInputElement>(null);
    return(
            <Import
                onDrop={e => handleDrop(e)}
                onDragOver={e => handleDragOver(e)}
                onDragEnter={e => handleDragEnter(e)}
                onDragLeave={e => handleDragLeave(e)}
                dragged={dragged}
            >
                {children}
                <br/>Import {type}<br/>Drag and drop Excel files (.xlsx)<br/>{/*How to import your {type}? Click here!<br/>*/}
                Download the excel below and fill it <br/>
                <input type="file" ref={fileInput} onChange={(e)=>handleInput(e)}/>
                { error !== "" ? 
                    <ErrMessage>ERROR<br/>{error}</ErrMessage> 
                    : null
                }
            </Import>
    );
}