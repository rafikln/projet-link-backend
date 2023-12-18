import mongoose from "mongoose";
const cn=()=>
{
    return mongoose.connect('mongodb://127.0.0.1:27017/link')
}
export default cn;