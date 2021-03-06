
let db;
const request=indexedDB.open('budgt_tracker',1)



request.onupgradeneeded=function(event){
    const db=event.target.result;
    db.createObjectStore('new_transaction',{autoIncrement:true})
}

request.onsuccess=function(event){
    db=event.target.result
    if(navigator.onLine){
        uploadTransaction()
    }
}


request.onerror = function(event) {
    console.log(event.target.errorCode);
  };
  
  function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
  
    const transitionObjectStore = transaction.objectStore('new_transaction');
  
    
    transitionObjectStore.add(record);
  }
  
  let successText = document.createElement("div");

  
  async function uploadTransaction(){
    successText.className = "alert alert-success";
    successText.textContent="";
    let form = document.querySelector(".form");
    
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction');

    const getAll = transactionObjectStore.getAll();
   
 getAll.onsuccess = function() {
     if (getAll.result.length > 0) {
       fetch('/api/transaction', {
         method: 'POST',
         body: JSON.stringify(getAll.result),
         headers: {
           Accept: 'application/json, text/plain, */*',
           'Content-Type': 'application/json'
         }
       })
         .then(response => response.json())
         .then(serverResponse => {
           if (serverResponse.message) {
             throw new Error(serverResponse);
           }
        
           const transaction = db.transaction(['new_transaction'], 'readwrite');
           
           const transactionObjectStore = transaction.objectStore('new_transaction');
          
           transactionObjectStore.clear();
 
         
           successText.textContent = "All saved transaction has been saved!!";
           form.appendChild(successText);
           setTimeout(()=>{
             location.reload()
           },3000)
         })
         .catch(err => {
           console.log(err);
         });
     }
   };
 }
 

 window.addEventListener('online',uploadTransaction)
  
  