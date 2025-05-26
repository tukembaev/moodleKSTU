import { ResidesCourse, ResidesTheme } from "entities/User"


export interface Test {
    id: string,
    title: string,
    description: string,
    status: boolean,
    deadline: Date,
    max_points: number,
    result: number,
    opening_date:Date
     resides:{
          course:ResidesCourse[],
          theme:ResidesTheme[]
        }
    test_owner: {
      id: string,
      user_id: number,
      first_name: string,
      last_name: string,
      middle_name: string,
      avatar: string,
      is_employee: true,
      position: string,
      group: string
    },
    link_form: string,
    link_doc: string
  }
export interface TestResult {
    id: string,
    name: string,
    group: string,
    user_id:number,
    result: number,

    avatar:string
  }