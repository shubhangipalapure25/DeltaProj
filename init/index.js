const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const sampleData = require("../init/data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
   }
    main().then(()=>{
       console.log("Connected sucessfully to DB.");
    }).catch((err) =>{
       console.log(err);
    });

    
    const initDB = async() =>{
       await Listing.deleteMany({});
       sampleData.data = sampleData.data.map((obj) =>({...obj , owner:"6664794626ceab7c833f8122"

         }));
       await Listing.insertMany(sampleData.data);
       console.log("inserted data sucessfully.");
    }

     initDB();

     
//    async function insertOneData(){
//       let list = new Listing({
//         title:"Ramoji FilmCity2",
//         description:"Ramoji film city for making moves and many more... save date",
//         image:"https://images.unsplash.com/photo-1715630914788-71ec3db8bf6b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         price:2500,
//         location:"hyderabad",
//         country:"India",
//           });
  
//       await list.save().then((result)=>{
//         console.log(result);
//       }).catch((err)=>{
//         console.log(err);
//       });
//     }
//     insertOneData();
