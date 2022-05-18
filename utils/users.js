const users=[];

// Join user to chat 

function userJoin(id,username,room){
   const obj={id,username,room};
   
   users.push(obj);

   return obj;
};


// Get Current User 
function getCurrentUser(id){
    return users.find(obj=>obj.id===id);
}

// User Leaves the chat 
function userLeaves(id){
  const index=users.findIndex(obj=>obj.id===id);
  
  if(index !==-1){
      return users.splice(index,1)[0];//instead of returning wholw array we have returned the user
  }
};

// Get room Users 
function ActiveUsers(room){//here we will those elements from the array whose room no is same as given room number
    return users.filter(user =>user.room ===room);//and it will return the array

}

module.exports={
    userJoin,
    getCurrentUser,
    userLeaves,
    ActiveUsers
}