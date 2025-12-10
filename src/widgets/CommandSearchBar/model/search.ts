import { Course } from "entities/Course";
import { UserFilesList, UserGroupList } from "entities/User";


export interface SearchBar {
    courses:Course[],
    employees:UserGroupList[],
    files:UserFilesList[]
}