import { Router } from "express";
import categoryControl from './categoryControl.js';
import authService from '../../authentications/index.js';
import validate from "../../validation/joiMiddleware.js";
import categoryValidation from '../../validation/categoryValidation.js'


const router = Router()


//---------------------------
router.post(
    '/new/category',
    validate(categoryValidation.NewCategoryAPIinput),
    authService.authenticateMiddleware("ADMIN"),
    categoryControl.newCategory
)
/**
 * post('/category/new/category') 
 *  _ Route to make a new main category with no children
 *  - Validate the income date 
 *  - auto assign an id for the category
 *  - It already checks the DB for any duplictaion
 * 
 *  notes:
 *  - this should be accessed only by the admin
 * 
 *  needs:
 *  - name : string more than 2 character
 */

//---------------------
router.post(
    '/new/sub/category/:parentId',
    validate(categoryValidation.NewCategoryAPIinput),
    authService.authenticateMiddleware("ADMIN"),
    categoryControl.newSubcategory
)
/**
 * post('category/new/sub/category/:parentId)
 *  - Route to make a new sub category
 *  - validate the income date
 *  - auto asigin the id 
 *  - checks the parent for any subCategory with the same name
 * 
 *  notes: 
 *  - This should be accessed only by the admin
 * 
 *  needs:
 *  - name: string more than 2 cahracter
 *  - needs the parent id in the url
 */

router.get(
    '/main/categories',
    categoryControl.mainCategories
)

export default router