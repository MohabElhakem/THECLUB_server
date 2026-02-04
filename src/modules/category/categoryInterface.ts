import type { Product , Category } from "@prisma/client"

export interface FullCategoryCustom {
    id : string,
    name : string,

    parentId?: string | null,
    parent? : Category | null,

    children?: Children[],
    products?: productOverView[],
}

export type FeatchCategoryField = "name"|"id" ;


export interface FeatchCategoryResult {
    exist: boolean,
    data: FullCategoryCustom | null
}


export interface Children{
    name: string ,
    id : string
}
export interface productOverView{
    name: string ,
    id : string
}

export interface NewCategoryCtrlInput {
    name: string
}

export interface NewSubCtrlInput{
    name: string,
}

export interface CategoriesOutput {
    name: string , 
    id : string
}

export type CategoryTypeOutput = "nutural" | "sub" | "leaf" ;