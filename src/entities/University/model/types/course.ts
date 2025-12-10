export interface Department {
    id: number;
    departament_name: string;
    abbreviation: string | null;
    phone_number: string;
    institute: number;
  }
  
  export interface Faculty {
    id: number;
    title_faculty: string;
    abbreviation_faculty: string;
    department: Department[];
  }
