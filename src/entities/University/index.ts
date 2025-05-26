import { getProfessorsOfDepartment, getUniversityList } from "./model/services/universityAPI";
import { universityQueries } from "./model/services/universityQueryFactory";

import { Faculty } from "./model/types/course";
import UniversityList from "./ui/UniversityList";


//ui
export { UniversityList };
//queries
export { universityQueries };
//api
export { getProfessorsOfDepartment, getUniversityList };
//types 
export type { Faculty };
