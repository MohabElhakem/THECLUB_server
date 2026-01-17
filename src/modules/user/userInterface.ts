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

export type Role = "ADMIN" | "USER" | "SELLER" | "VENDOR" ;