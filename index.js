const express = require('express');
const app = express();
const cors = require('cors');
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
require('dotenv').config();
let port  = process.env.PORT || 4000;
let dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017';
let oId=0;    //oId is used to set orderId of the order.
 
app.use(express.json());
app.use(cors());

//api for getting list of products
app.get('/products', async(req, res) =>{
    try{
     let clientInfo = await mongoClient.connect(dbUrl);
     let db = clientInfo.db('app');
     let items = await db.collection("products").find().project({productId:1,model:1,price:1,pic:1,company:1}).toArray();
     res.status(200).json({message:"Success",data:items});   
     clientInfo.close();
    }
    catch(e){
        console.log(e);
    }
})

//api for gettingsingle product info 
app.get('/product/:id',async(req, res) =>{
    try{
       let clientInfo = await mongoClient.connect(dbUrl);
       let db = clientInfo.db("app");
       let item = await db.collection("products").findOne({productId:+req.params.id});
       res.status(200).json({message:"Success",data:item});
       clientInfo.close();
    }    
    catch(e){
      console.log(e);        
    }
})

//api to save order in db.
app.post('/save-order',async(req,res)=>{
    try{
        let clientInfo = await mongoClient.connect(dbUrl);
        let db = clientInfo.db("app");
        req.body.orderId=oId +1;
        await db.collection("orders").insertOne(req.body);
        res.status(200).json({message:"Success"});
        oId +=1;     
        clientInfo.close();
    }   
    catch(e){
          console.log(e);
    }  
})

//api to get order list.
app.get("/get-orders",async(req,res)=>{
    try{
    let clientInfo = await mongoClient.connect(dbUrl);
    let db = clientInfo.db("app");
    let orders = await db.collection("orders").find().toArray();
    res.status(200).json({message:"Success",data:orders});
    clientInfo.close();      
}   
    catch(e){
       console.log(e);
    }
})



app.listen(port,()=> console.log("App is listening on"+ port))
