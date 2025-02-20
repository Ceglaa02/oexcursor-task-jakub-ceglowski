function editBtnListeners(btn, modal = null){
    const btns = btn ? [btn] : document.querySelectorAll('button[data-bs-target="#editUserForm"]');
    btns.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            document.querySelector('button[name=editUser]').setAttribute('datasrc',btn.getAttribute('datasrc'));
            if(modal !== null){
                modal.show();
            }
        });
    });
}

function updateViewUser(user, userId){
    const row = document.querySelector('#user_' + userId);

    Object.keys(user).forEach((key)=>{
        const element = row.querySelector(`div>span[data=${key}]`);
        element.innerText = user[key];
    });
}

function clearForm(form){
    const data = form.querySelectorAll('input[name],select[name]');
    data.forEach((item)=>{
        item.value = "";
    });
}
function viewUser(user){
    if(!user){
        return;
    }

    const {id} = user;
    delete user.id;

    const usersContainer = document.querySelector('section[name=users]>div.card-body');

    const parentNode = document.createElement('div');
    parentNode.classList.add('col-12');
    parentNode.classList.add('row');
    parentNode.classList.add('my-1');
    parentNode.id = "user_" + id;
    
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

        const val = document.createElement('span');
        val.setAttribute('data', keyName);
        val.append(user[keyName]);

        span.append(validName.charAt(0).toUpperCase() + validName.slice(1));
        content.append(span);
        content.append(val);
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
    editBtn.setAttribute('datasrc', id);
    editBtn.setAttribute('name', 'edit');
    editBtn.classList.add('btn');
    editBtn.classList.add('btn-primary');
    editBtn.classList.add('btn-sm');
    editBtn.classList.add('me-1');
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type','button');
    deleteBtn.setAttribute('datasrc', id);
    deleteBtn.setAttribute('name', 'delete');
    deleteBtn.classList.add('btn');
    deleteBtn.classList.add('btn-danger');
    deleteBtn.classList.add('btn-sm');
    deleteBtn.innerText = "Delete";

    buttonsContent.append(editBtn);
    buttonsContent.append(deleteBtn);

    parentNode.append(buttonsContent);
    usersContainer.append(parentNode);

    editBtnListeners(editBtn, (new bootstrap.Modal(document.querySelector('#editUserForm'))));
    deleteUserListener(deleteBtn);
}
function addUserListener(){
    const btn = document.querySelector('button[name=addUser]');
    const form = document.querySelector('form[action="/user/add"]');

    btn.addEventListener('click',async ()=>{
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
        viewUser(result?.user);
        clearForm(form);
    });

    const modal = document.querySelector('#addUserForm');
    modal.addEventListener('hidden.bs.modal',(e)=>{
        clearForm(form);
    });
}

function deleteUserListener(node){
    const nodeList = (node !== undefined && node !== null) ? [node] : document.querySelectorAll('button[type=button][name=delete]');
    nodeList.forEach((btn)=>{
        btn.addEventListener('click',async ()=>{
            const id = btn.getAttribute('datasrc');
            const response = await fetch(`/user/delete/${id}`);
            const result = await response.json();

            if(result?.success){
                document.querySelector('#user_' + id)?.remove();
            }
            else{
                //obsługa błędu
            }
        });
    });
}

function editUserListener(){
    const btn = document.querySelector('button[name=editUser]');
    const form = document.querySelector('form[action="/user/edit"]');

    btn.addEventListener('click',async ()=>{
        const id = btn.getAttribute('datasrc');
        const data = new FormData(form);
        const response = await fetch(form.action + '/' + id, {
            method: form.method,
            body: data
        });

        if(!response.ok){
            //obsłużyć błąd
            return;
        }

        const result = await response.json();
        updateViewUser(result?.user, id);
        clearForm(form);
    });

    const modal = document.querySelector('#editUserForm');
    modal.addEventListener('hidden.bs.modal',(e)=>{
        clearForm(form);
    });
}

function editModalShowListener(){
    const modal = document.querySelector('#editUserForm');
    modal.addEventListener('shown.bs.modal',()=>{
        const confirmBtn = modal.querySelector('[name=editUser]');
        const userId = confirmBtn.getAttribute('datasrc');

        const row = document.querySelector('#user_' + userId);
        const rowData = row.querySelectorAll('span[data]');
        let name = '', surname = '';


        rowData.forEach((data)=>{
            const key = data.getAttribute('data');
            const value = data.innerText;
            if(key === 'name'){
                name = value;
            }
            else if(key === 'surname'){
                surname = value;
            }
            const modalRow = modal.querySelector(`[name=${key}]`);
            modalRow.value = value;
        });

        modal.querySelector('#userInfo').innerText = name + " " + surname;
    });
}


window.onload = () => {
    (function init(){
        addUserListener();
        deleteUserListener();
        editUserListener();
        editBtnListeners();
        editModalShowListener();
    })();
}