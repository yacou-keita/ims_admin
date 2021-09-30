export enum DocumentFor {
    All = 'All',
    Teacher = 'Teacher',
    Admin = 'Admin',
    Classroom = 'Classroom',
    Baobab = 'Baobab',
    Iroko = 'Iroko',
    Bamboo = 'Bamboo',
    Acajou = 'Acajou',
    Samba = 'Samba'
}
export interface Document{
    id:number,
    name:string,
    url:string,
    documentfor:DocumentFor
}