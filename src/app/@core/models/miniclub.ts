import { Child } from './child';

export interface MiniClub{
    id:number;
    title:string;    
    startDate:Date;
    endDate:Date;
    price:number;
    limit:number;
    comment:string;
    children:Child[]
}