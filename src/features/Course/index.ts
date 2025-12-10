import Add_Answer_Theme from "./forms/add-answer-theme";
import Add_Course from "./forms/add-course";
import Add_Material_file from "./forms/add-material-file";
import Add_Theme from "./forms/add-theme";
import Add_Theme_FAQ from "./forms/add-theme-faq";
import End_Course from "./forms/end-course";
import { SetMark } from "./hooks/SetMark";

import { useCreateTheme, useRegistrateCourse } from "./model/services/course_queries";
import { CreateCoursePayload, CreateFAQPayload, CreateThemePayload ,editPermissionPayload ,UploadMaterialPayload ,UploadAnswerPayload , FinishCoursePayload,FinishCourseFormPayload,ExtraPointPayload} from "./model/types/course_payload";
import RegistrationList from "./ui/RegistrationList";




export {
    Add_Course, Add_Theme, Add_Theme_FAQ, useCreateTheme, RegistrationList, useRegistrateCourse,Add_Material_file,Add_Answer_Theme,SetMark,End_Course,
};
export type { CreateCoursePayload, CreateFAQPayload, CreateThemePayload,editPermissionPayload ,UploadMaterialPayload ,UploadAnswerPayload ,FinishCoursePayload,FinishCourseFormPayload,ExtraPointPayload};
