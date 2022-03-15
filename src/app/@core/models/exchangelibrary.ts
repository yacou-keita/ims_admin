
import { Child } from './child';

export enum BookStatus {
    PRESENT='present',
    RENTED = 'rented'
}
export interface ExchangeLibrary{
    id:number,
    title:string,
    picture: string,
    donator: string,
    child?:Child,
    comment?:string,
    author:string,
    code:string,
    status:BookStatus;
    booked_on:any,
    booked_status:any,
    returned_on:any
}