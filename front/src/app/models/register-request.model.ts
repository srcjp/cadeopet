export enum Gender {
    MALE   = 'MALE',
    FEMALE = 'FEMALE',
  }
  
  export interface RegisterRequest {
    firstName:   string;
    lastName:    string;
    email:       string;
    phoneNumber: string;
    gender:      Gender;
    password:    string;
    role?:       string;
  }
  