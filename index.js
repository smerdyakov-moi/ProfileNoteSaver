//Handling the route for overall home page view
app.get('/readFiles/:',(req,res)=>
    {
        fs.readdir('./Files',function(err,files){
            res.render('index',{files: files})
        })
        
})

//Handling the route for showing the files' contents 
app.get('/file/:filename',(req,res)=>
    {
        fs.readFile(`./Files/${req.params.filename}`,'utf8',(err,data)=>{
            const {filename}=req.params
            if (err){console.error(err)
                return;
            }
            res.render('show',{filename:filename,data:data})
        })
})

//Handling the route for editing the task(file)
app.get('/edit/:filename',(req,res)=>{
    
    fs.readFile(`./Files/${req.params.filename}`,'utf-8',(err,data)=>{
        const {filename} = req.params
        if(err){console.error(err) 
            return}
        res.render('edit',{filename:filename,data:data})
    })
    
})

//Update the edit
app.post('/update',(req,res)=>{
    fs.writeFile(`./Files/${req.body.title.split(' ').join('')}.txt`,req.body.description,function(err){res.redirect('/')}
)
})

//Handling the route for when you click on the submit button <on frontend, the request follows back to here>
app.post('/create',(req,res)=>
    { 
        //Writing a file into the directory which will be retrieved in the frontend aspect + req.body reason is because the title,description are under that HTML aspect
        fs.writeFile(`./Files/${req.body.title.split(' ').join('')}.txt`,req.body.description,function(err){
            res.redirect('/') // As soon you as you click on the submit button, the route is redirected to primary
        })
    })
    
app.listen(3000,'0.0.0.0')//()=>{console.log("Listening....")}) //update the ip address to the network you are connected to + ipconfig for your ip address