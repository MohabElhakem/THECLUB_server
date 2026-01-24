import type { Request , Response } from "express";
import * as categoryService from "./categoryService.js";
import err from "../../error/index.js";
import asyncHandler from "../../lib/asyncHandler.js";
import type {
    NewCategoryCtrlInput,
    NewSubCtrlInput,
    Children
} from "./categoryInterface.js"
import e from "cors";


//-------------------------------
// New Category Ctrl
//-------------------------------
const newCategory = asyncHandler(
    async (
        req : Request<{},{},NewCategoryCtrlInput>,
        res : Response
    ) => {
        console.log("Proccessing the creation of the new category......");
        const {name} = req.body;
        if(!name){
            console.log("No name provided for the new Category");
            throw new err.BadRequest("لا يوجد اسم للفئه الجديده");
        }
        const nameT = name.trim();

    // Look for the category in the DB 
        const InDB = await categoryService.featchCategory("name" , nameT)
        if (InDB.exist === true){
            console.log("Already in the DB");
            throw new err.Conflict("يوجد بالفعل فئه بهذا الاسم");
        }

    // now make a new one 
        await categoryService.createCategory(nameT);

        return res.status(201).json({
            message: "تم اضافه الفئه بنحاح",
        })
    }
)
/**
 * notes: 
 *  - The endpoint only take the name Of the new Category;
 *  - Cheacks if there is any other category with the same name
 *  - Then if every thing okay it creates the new category
 */


//---------------------
// Make a SubCategory
//---------------------
const newSubcategory = asyncHandler(
    async(
        req: Request<{parentId?: string},{},NewSubCtrlInput>,
        res: Response
    ) => {
        console.log("Proccesing the creation of SubCategory.....");
        const {name } = req.body;
        const {parentId} = req.params
        if(!name || !parentId){
            console.log("Name and ParentId is not provided......");
            throw new err.BadRequest("لا يوجد اسم و الرقم التعريفي للفئه الاب لانشاءالفئه الفرعيه");
        }
    // Look of the parent
        const parent = await categoryService.featchCategory('id' , parentId)
        if (parent.exist === false || !parent.data){
            console.log("There is no parent with that id.......!");
            throw new err.NotFound('لا يوجد فئه اب بهذا الرقم التعريفي');
        }
        if (!parent.data){
            console.log("There is no data feteched........!!!!");
            throw new err.InternalError('لم يتم تحميل بينات هذه الفئه');
        }
    // Now look inside the children
        const inChildren = categoryService.isNameInChildren(name , parent.data?.children as Children[]);
        if(inChildren === true){
            console.log("There is A child with the same name....!");
            throw new err.Conflict('يوجد بالفعل فئه فرعيه بهذارالاسم');
        }
    // now make the subCategory
        await categoryService.createSubCategory(name , parentId);
        return res.status(201).json({
            message: "لقد تم تكوين فئه فرعيه بنجاح"
        })
    }
)


const index = {
    newCategory,
    newSubcategory
}
export default index