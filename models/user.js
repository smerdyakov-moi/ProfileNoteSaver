const mongoose = require ('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/User_Database')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    image: String,
    folder:String
})

module.exports=mongoose.model('user',userSchema)