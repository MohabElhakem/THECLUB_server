import prisma from "../../lib/prisma.js";
import err from "../../error/index.js";
import { nanoid } from "nanoid";
import type {
    FullCategoryCustom,
    FeatchCategoryField,
    FeatchCategoryResult,
    Children,
    CategoriesOutput,
    CategoryTypeOutput,
    Breadcrumb,
} from './categoryInterface.js'






//-----------------
// Categories
//-----------------
export async function createCategory (Cname : string): Promise<string> {

    console.log("Creating the Catrgory.......\n");
    if(!Cname){
        console.log("There is no name Provided for the Creation of the category");
        throw new err.BadRequest("لايوجد اسم للفئه الجديده");
    }
    const trimmedName = Cname.trim();
    console.log({ name: trimmedName });
    const GeneratedId = nanoid(10); // and you will use it in two palces 
    const newCategory = await prisma.category.create({
        data: { 
            id : GeneratedId, // make the for the category
            name: trimmedName ,
            path: GeneratedId}
    });

    return newCategory.id;

}
/*
* - this function only add an empty category nothing else
* _ the id id det automaticully
* - the output is the id for future steps
**/






//------------------------
// Featch the A category
//------------------------
export async function featchCategory(
    field : FeatchCategoryField ,
    value:string
): Promise<FeatchCategoryResult> {
    console.log("featching the category from the Db.......");
    const category = await prisma.category.findFirst({
        where : field === "name" ?
        {name : {equals: value.trim(), mode: "insensitive"}} : 
        {id : value},
        include: {
            children: {
                select : {id: true, name : true }
            },
            products: {
                select: {id:true , name:true}
            }
        }
    })
    if (!category) {
        return {
            exist: false,
            data: null,
        }
    }

    // breadcrumb logic for the tree
    let breadcrumb :  Breadcrumb = [];
    if(category.path){
        try {
            const ids = category.path.split(".") // split pathes id 
            breadcrumb = await prisma.category.findMany({
                where: {id: {in: ids}},
                orderBy: {path : "asc"},
                select:{id:true , name:true},
            })
        } catch (error) {
            throw new err.InternalError("proplem featching the breadcrumb")
        }
    }


    return {
        exist : true,
        data: category as FullCategoryCustom,
        breadcrumb 
    }
}
/*
*   - this function chick for the catgory
*   - gives back the a boolean response 
*   - and hole category with the children name and id only
*/





//-----------------------
// Create SubCategory
//-----------------------
export async function createSubCategory(subName: string , parentId: string , parentPath: string) : Promise<string>{
    console.log("creating sub category...........")
    const subNameT = subName.trim().toLocaleLowerCase()
    const GeneratedId = nanoid(10)//
    const SubCategory = await prisma.category.create({
        data: {
            id : GeneratedId,
            name: subNameT,
            parentId,
            path: `${parentPath}.${GeneratedId}`
        }
    })

    return SubCategory.id
}
/* 
    -makes the subcategory in the db
    - gives back the id
    - trims the name and make it lowercase

*/


//---------------------
// Name in Children
//---------------------
export function isNameInChildren (newName : string , children : Children[]){
    console.log("Looking for the name in the Children");
    // first deal with the given name 
    const newNameT = newName.trim().toLocaleLowerCase();
    const childrenSet = new Set(
        children.map( c => c.name.trim().toLocaleLowerCase())
    )
    return childrenSet.has(newNameT)
}
/*
    - the Function take the children array from the category
    - it returns either true or false
 */





//---------------------
// Get All Category
//---------------------
export async function allCategories (): Promise<CategoriesOutput[]> {

    console.log('Featching all the main categories');
    const categoryArray = await prisma.category.findMany({
        where: {parentId: null},
        select:{id: true ,name: true}
    });
    return categoryArray;
}
/**
 * - featch all the avaliable categories with no parent id
 * - the out but is an array of objects[ {.....} , {.....} , {.....} ];
 */


//--------------------
//Decide the type
//--------------------
export function categoryType (category : FullCategoryCustom | null): CategoryTypeOutput {
    if(category === null){
        throw new err.BadRequest("There is no object to decide");
    }
    const hasChildren = (category.children?.length ?? 0) > 0 ;
    const hasProducts = (category.products?.length ?? 0) > 0;

    if(hasChildren && !hasProducts) return "sub";
    if(!hasChildren && hasProducts) return "nutural";
    return "nutural";
}
