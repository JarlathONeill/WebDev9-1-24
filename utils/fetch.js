const axios = require('axios');

const baseURL = 'http://localhost:3002'

const  get = async function(path,config){
   try{
    const response = await axios.get(`${baseURL}${path}`,{
        headers:{
            'Content-Type': 'application/json'
           },
        ...config,
      
    });
    
    return response?.data ?? {}
   }catch(err){
    console.error(err);
   }
}



const  post = async function(path,data,config){
    try{
     const response = await axios.post(`${baseURL}${path}`,JSON.stringify(data ),{
         ...config,
         headers:{
          'Content-Type': 'application/json'
         }
     });
     
    }catch(err){
     console.error(err);
    }
 }



 module.exports =   {
    get,
    post
 }

