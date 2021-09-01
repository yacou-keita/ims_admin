import { NameOfClass, Child } from './child';

export enum USERROLE {
    SuperAdmin = 'SuperAdmin',
    Admin = 'Admin',
    Teacher = 'Teacher',
    Parent = 'Parent'
  }
  export enum ROLE {
    SuperAdmin = 1,
    Admin = 2,
    Teacher = 3,
    Parent = 4,
    Child = 5,
    Assistant = 6,
    Personnel = 7
  }
export interface User{
    id:number,
    username:string,
    first_name:string,
    last_name:string,
    email:string,
    role:ROLE,
    role_name:USERROLE,
    classNames?:NameOfClass[],
    picture:string,
    child?:any;
}

export interface ClassName{
  className:string,
  Comment:any
}