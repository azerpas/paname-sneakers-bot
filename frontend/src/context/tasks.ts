import { createContext } from 'react';
import { TaskInfos } from "@generated/client";

interface ITasksContext {
    tasks: TaskInfos[];
    setTasks: (t: TaskInfos[]) => void;
}

export const TasksContext = createContext<ITasksContext>({} as ITasksContext);