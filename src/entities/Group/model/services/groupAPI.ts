
//Все курсы/дисциплины преподавателя
// export const getCoursesOfProfessor = async (id: number | null):Promise<Course> => {
//     const response = await $api2.get(`course/?owner_id=${id}`); 
//     return response.data;
//   };
  
// //Все задания выбранной дисциплины
//   export const getCourseAllTasks = async (id: number | null):Promise<AllCourses[]> => {
//     const response = await $api2.get(`course-detail/?course=${id}`); 
//     return response.data;
//   };
// //Все уроки и материалы выбранного задани

// export const getTaskMaterials = async (id: number | null):Promise<TaskMaterial[]> => {
//   const response = await $api2.get(`course-detail/course/${id}`); 
//   return response.data;
// };
// //
// export const createCourse = async (id: number | null) => {
//   const response = await $api2.post(`course/${id}`); 
//   return response.data;
// };

// export const editCourseDetails = async (id: number | null , data: any) => {
//   const response = await $api2.patch(`course/${id}`, data); 
//   return response.data;
// };
// export const deleteCourse = async (id: number | null) => {
//   const response = await $api2.delete(`course/${id}`); 
//   return response.data;
// };