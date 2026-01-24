import joi from 'joi';



const NewCategoryAPIinput = joi.object({
    name:joi.string().min(2).required()
})


const index = {
    NewCategoryAPIinput,
}

export default index;