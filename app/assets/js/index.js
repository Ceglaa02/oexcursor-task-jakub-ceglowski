function viewUser(user){
    if(!user){
        return;
    }

    const usersContainer = document.querySelector('section[name=users]>div.card-body');

    const parentNode = document.createElement('div');
    parentNode.classList.add('col-12');
    parentNode.classList.add('row');
    parentNode.classList.add('my-1');

    Object.keys(user).forEach((keyName)=>{
        const validName = String(keyName);
        const content = document.createElement('div');
        content.classList.add('col-6');
        
        if(validName === 'age'){
            content.classList.add('col-lg-1');
        }
        else if (validName === 'email'){
            content.classList.add('col-lg-3');
        }
        else{
            content.classList.add('col-lg-2');
        }

        content.classList.add('d-flex');
        content.classList.add('justify-content-center');
        content.classList.add('align-items-center');

        const span = document.createElement('span');
        span.classList.add('fw-bold');
        span.classList.add('me-1');

        span.append(validName.charAt(0).toUpperCase() + validName.slice(1));
        content.append(span);
        content.append(user[keyName]);
        parentNode.append(content);
    });

    const buttonsContent = document.createElement('div');
    buttonsContent.classList.add('col-12');
    buttonsContent.classList.add('col-lg-2');
    buttonsContent.classList.add('d-flex');
    buttonsContent.classList.add('justify-content-center');
    buttonsContent.classList.add('align-items-center');

    const editBtn = document.createElement('button');
    editBtn.setAttribute('type','button');
    editBtn.classList.add('btn');
    editBtn.classList.add('btn-primary');
    editBtn.classList.add('btn-sm');
    editBtn.classList.add('me-1');
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type','button');
    deleteBtn.classList.add('btn');
    deleteBtn.classList.add('btn-danger');
    deleteBtn.classList.add('btn-sm');
    deleteBtn.innerText = "Delete";

    buttonsContent.append(editBtn);
    buttonsContent.append(deleteBtn);

    parentNode.append(buttonsContent);
    usersContainer.append(parentNode);
}
function addUserListener(){
    const btn = document.querySelector('button[name=addUser]');
    btn.addEventListener('click',async ()=>{
        const form = document.querySelector('form[action="/user/add"]');
        const data = new FormData(form);

        //dodać walidacje formularza

        const response = await fetch(form.action,{
            method: form.method,
            body: data
        });

        if(!response.ok){
            //obsłużyć błąd
            return;
        }

        const result = await response.json();
        viewUser(result?.user)
    });
}
window.onload = () => {
    (function init(){
        addUserListener();
    })();
}