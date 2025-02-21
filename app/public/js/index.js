function checkEmailRegEx(email){
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

function duplicateValue(name, value, form){
    const currentId = document.querySelector('input[name=currentUserId]').value;
    let result = false;
    const rows = document.querySelectorAll(`span[data=${name}]`);

    rows.forEach((row)=>{
        const span = document.querySelector('#user_' + currentId)
            ?.querySelector(`[data=${name}]`);
        if(form.action.includes('/user/edit') && span.innerText === String(value)){
            return;
        }
        if(String(row.innerText) === String(value)){
            result = true;
        }
    });

    return result;
}
function validateForm(form){
    let result = true;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach((input)=>{
        const feedback =
            form.querySelector(`div:has(input[name=${input.name}])>div`) ??
            document.createElement('div');

        feedback.classList.add('d-flex');
        const span = feedback.querySelector('span') ?? document.createElement('span');
        span.innerHTML = '';
        const container = form.querySelector(`div:has(input[name=${input.name}])`);

        if(!input.value){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Value can't be empty");
            result = false;
        }
        else if(input.name === 'email' && !checkEmailRegEx(input.value)){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Value must be email");
            result = false;
        }
        else if((input.name === 'email' || input.name === 'login') && duplicateValue(input.name, input.value, form)){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Value can't be duplicate");
            result = false;
        }
        else if((input.value.length > 50)){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Value is too long, max chars number must be not more than 50");
            result = false;
        }
        else if(input.name === 'age' && input.value > 130){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Max age is 130");
            result = false;
        }
        else if(input.name === 'age' && input.value < 1){
            feedback.classList.add('invalid-feedback');
            feedback.classList.remove('valid-feedback');
            span.append("Min value is 1");
            result = false;
        }
        else {
            feedback.classList.add('valid-feedback');
            feedback.classList.remove('invalid-feedback');
            span.append("Value is fine");
        }


        feedback.append(span);
        container.appendChild(feedback);
    });
    return result;
}
function editBtnListeners(btn, modal = null){
    const btns = btn ? [btn] : document.querySelectorAll('button[data-bs-target="#editUserForm"]');
    btns.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            document.querySelector('input[name=currentUserId]').value = btn.getAttribute('datasrc');
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

    const communicates = form.querySelectorAll('div.d-flex.invalid-feedback, div.d-flex.valid-feedback');
    communicates.forEach(item => item.remove());
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

        span.append(validName.charAt(0).toUpperCase() + validName.slice(1) + ':');
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
    const modal = document.querySelector('#addUserForm');
    const btn = document.querySelector('button[name=addUser]');
    const form = document.querySelector('form[action="/user/add"]');

    modal.addEventListener('hidden.bs.modal',(e)=>{
        clearForm(form);
    });

    btn.addEventListener('click',async ()=>{
        const data = new FormData(form);

        if(!validateForm(form)){
            return;
        }
        else{
            const hideBtn = modal.querySelector('button[name=cancelAddingUser]');
            hideBtn.click();
        }

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

    const modal = document.querySelector('#editUserForm');
    modal.addEventListener('hidden.bs.modal',()=>{
        clearForm(form);
    });

    btn.addEventListener('click',async ()=>{
        const id = document.querySelector('input[name=currentUserId]').value;
        const data = new FormData(form);

        if(!validateForm(form)){
            return;
        }
        else{
            const hideBtn = modal.querySelector('button[name=cancelEditingUser]');
            hideBtn.click();
        }

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
}

function tooggleSpinner(){}

function editModalShowListener(){
    const modal = document.querySelector('#editUserForm');
    modal.addEventListener('shown.bs.modal',()=>{
        const confirmBtn = modal.querySelector('[name=editUser]');
        const userId = document.querySelector('[name=currentUserId]').value;

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