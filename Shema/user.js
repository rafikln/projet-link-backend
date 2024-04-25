import mongoose from "mongoose";
const user= new mongoose.Schema(
    {
        mail :
        {
            type : 'String',
            unique : true,
            required :true,
            validate: {
                validator: function (value) {
                  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                  return emailRegex.test(value);
                },
                message: 'Invalid email format',
              },
        },
        password :  
        {
        type :'String',
        required :true,
        },
        
        

    }
)
user.methods.toJSON = function () {
  const userOBJ = this.toObject();
  userOBJ.id = userOBJ._id;
  delete userOBJ._id;
  delete userOBJ.__v;
  return userOBJ;
};
export default mongoose.model("User",user) 