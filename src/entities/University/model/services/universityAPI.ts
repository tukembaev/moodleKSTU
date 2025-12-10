import $api2 from "shared/api/api2";
import {  Faculty } from "../types/course";
import { Employee } from "entities/User/types/user";


export const getUniversityList = async ():Promise<Faculty[]> => {
    const response = await $api2.get(`institutes-dep`)
    return response.data;
  };
export const getProfessorsOfDepartment = async (id: number | null):Promise<Employee[]> => {
    const response = await $api2.get(`department-employees/${id}`); 
    return response.data;
  };

