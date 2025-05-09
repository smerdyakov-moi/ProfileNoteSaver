const express = require ('express')
const app = express()
const path = require ('path')
const userModel = require('./models/user.js')
const fs =require('fs')

/* ALL THE PREREQUIREMENTS INCLUDING PARSER, SETTING UP THE EJS, AND MAKING AVAILABLE USE OF css,vanilla js, img,vid*/
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set ('view engine','ejs')

//Renders main.ejs which allows user to create user(s)
app.get('/',async (req,res)=>{
    res.render('MainPage')
})

//After the main.ejs page, when the user sends a request with name="" format, that is a request stored as an object type in req.body which can be destructured
//as shown below then it adds that user to the model and redirects it to the read page 
app.post('/create', async (req,res)=>{
    let {title,email,img} = req.body

    let createdUser = await userModel.create({
        name:title, //name,email,image should be as it is in the user.js file located in the./models folder
        email,  
        image:img,
    }) 
    fs.mkdir(`./Folders/${createdUser._id}`,{recursive:true}, (err)=>{
    })
    res.redirect('/read') // Redirects to the read page
})

app.get('/read',async (req,res)=>{
    let allusers = await userModel.find() // This code is necessary as it helps to read the present user collection/model and return it as an array of objects
    // as .find() returns an array  
    res.render('ReadPage',{users:allusers}) //The read page will be rendered along with the object of all the users
})


app.get('/delete/:ID',async(req,res)=>{
    const {ID} = req.params // req.params is used only when dynamic routing is applied. Otherwise, any thing dealing with the frontend aspect will normally
    //result in req.body as seen in the /create route where the client enters

    let deletedUser = await userModel.findOneAndDelete({_id:ID}) //Simple Deletion of the record
    fs.rmdir(`./Folders/${ID}`,{recursive:true},(err)=>{})
    res.redirect('/') //Redirects to the main page
})

app.get('/edit/:id',async (req,res)=>{
    let user = await userModel.findOne({_id:req.params.id}) //We are using findOne here so we can return only an object . Thus, no destructuring is needed \
    // {user} unlike the previous /read route where {users:allusers} had to be implemented

    res.render('UpdatePage',{user}) //The update page will be rendered along with the object 'user' we are deleting
})

app.post('/update/:userid', async(req,res)=>
{
    let {name,email,image} = req.body //Stores the updated (if any) record
    let user = await userModel.findOneAndUpdate({_id:req.params.userid}, {name,email,image}, {new:true}) // Updates the user
    res.redirect('/read') // Redirects to the read page
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                  NOTESAVER                                                                */
app.get('/readFiles/:id',(req,res)=>
    {
        const id = req.params.id
        fs.readdir(`./Folders/${id}`,function(err,files){
            res.render('index',{files: files, id:id})
        })
        
})


app.post('/createFile/:id',(req,res)=>
    { 
        const id = req.params.id
        //Writing a file into the directory which will be retrieved in the frontend aspect + req.body reason is because the title,description are under that HTML aspect
        fs.writeFile(`./Folders/${id}/${req.body.title.split(' ').join('')}.txt`,req.body.description,function(err){
            res.redirect(`/readFiles/${id}`) // As soon you as you click on the submit button, the route is redirected to primary
        })
    })


app.get('/fileView/:id/:fileName', (req, res) => {
  const { id, fileName } = req.params
  fs.readFile(`./Folders/${id}/${fileName}`, 'utf8', (err, data) => {
    if (err) {console.error(err)
        return}
    res.render('show', { filename: fileName, data })
  });
});

app.get('/fileEdit/:id/:fileName',(req,res)=>{
    const {id,fileName} = req.params
    fs.readFile(`./Folders/${id}/${fileName}`,'utf-8',(err,data)=>{
        if(err){console.error(err) 
            return}
        res.render('edit',{filename:fileName,data,id})
    })
    
})

app.post('/updateFile/:id',(req,res)=>{
    const {id} = req.params
    const fileName = req.body.title.split(' ').join('') + '.txt'
    fs.writeFile(`./Folders/${id}/${req.body.title.split(' ').join('')}.txt`,req.body.description,function(err){ res.redirect(`/fileView/${id}/${fileName}`)}
)
})

app.listen(3000,()=>{
    console.log('Listening')
})