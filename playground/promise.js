function async (a,b){

    return new Promise((resolve,reject)=>{
        if(typeof a === 'number' && typeof b === 'number'){
            setTimeout(()=>{
                resolve(a+b);
            },2000)
        }else{
            reject('Parameters are not numbers. Please Enter Numbers Please....');
        }
    })
}
var data = async(23,67);

data.then((result)=>{
    console.log(result)
}).catch((message)=>{
    console.log(message);
});
