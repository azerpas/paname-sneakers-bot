import XLSX from 'xlsx';
import { TaskInfos } from "@generated/client";
import { tasksFields } from '@constants/tasks';
import { generateData } from '@services/faker';

export const exportTasks = (tasks: TaskInfos[]) => {
    const wb = XLSX.utils.book_new();
    const fields = Object.keys(tasks[0]);
    const ws = XLSX.utils.json_to_sheet(tasks); 
    XLSX.utils.sheet_add_aoa(ws, [fields], {origin: "A1"});
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `tasks_${new Date().getTime()}.xlsx`);
}

export const exportBaseFile = (website?: string, fields?: string[]) => {
    const row1: string[] = [];
    const f = fields ? fields : tasksFields;
    for (let index = 0; index < f.length; index++) {
        try {
            row1.push(generateData(f[index]));   
        } catch (error) {
            row1.push("example");
        }
    }
    const ws = XLSX.utils.aoa_to_sheet([f, row1])
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws);
    XLSX.writeFile(wb, `tasks_example${website ? "_" + website.replace(" ","") : ""}.xlsx`);
}