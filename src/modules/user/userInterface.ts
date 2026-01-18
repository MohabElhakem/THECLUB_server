export interface userData_DB {
    
        name: string,
        email?: string | null,
        password: string,
        role: string
        address: string,
        number: string,
}

export interface userData_return { 
    id: string,
}

export interface FetechedUserData_input  {
    field : "id" | "number",
    value : string,
}

export interface FetechedUserData_return  {
    id:string,
    number:string,
    name:string,
    email : string | null,
    password:string,
    role:string,
    address :string | null,
    avatarUrl :string | null,
    avatarPuplicId? : string | null,
    isActive:boolean,
}

export interface loginRoute_input  {
    number : string,
    password : string,
}