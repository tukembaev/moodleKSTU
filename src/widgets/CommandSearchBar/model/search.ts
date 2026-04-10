import { Course, StudyTask } from "entities/Course";
import { UserFilesList, UserGroupList } from "entities/User";


export interface SearchBar {
    courses: Course[],
    employees: UserGroupList[],
    files: UserFilesList[],
    study_tasks: StudyTask[]
}