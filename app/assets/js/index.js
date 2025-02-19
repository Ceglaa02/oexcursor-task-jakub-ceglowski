function getEditModal(user, id){
    return (
        `<section class="modal fade" id="editUserForm${ id }" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title fs-5 h1"><span class="fw-bold">EDIT </span>${ user.name } ${ user.surname }</h2>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form action="/user/edit" method="post" class="row">
                            <div class="col-12">
                                <label for="name"><span class="fw-bold">Name:</span></label>
                                <input value="${ user.name }" id="name-${ id }" name="name" type="text" class="form-control form-control-sm" required>
                            </div>
                            <div class="col-12">
                                <label for="surname"><span class="fw-bold">Surname:</span></label>
                                <input value="${ user.surname }" id="surname-${ id }" name="surname" type="text" class="form-control form-control-sm" required>
                            </div>
                            <div class="col-12">
                                <label for="email"><span class="fw-bold">Email:</span></label>
                                <input value="${ user.email }" id="email-${ id }" name="email" type="text" class="form-control form-control-sm" required>
                            </div>
                            <div class="col-12">
                                <label for="age"><span class="fw-bold">Age:</span></label>
                                <input value="${ user.age }" id="age-${ id }" name="age" type="number" class="form-control form-control-sm" required>
                            </div>
                            <div class="col-12">
                                <label for="login"><span class="fw-bold">Login:</span></label>
                                <input value="${ user.login }" id="login-${ id }" name="login" type="text" class="form-control form-control-sm" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button name="editUser" type="button" class="btn btn-primary" data-bs-dismiss="modal" datasrc="${ id }">Save</button>
                        <button name="cancelEditingUser" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </section>`
    );
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

    const modal = (new DOMParser()).parseFromString( getEditModal(user, id), 'text/html').querySelector('section');
    editBtn.onclick = ()=>{
        (new bootstrap.Modal(modal)).show();
    }

    usersContainer.append(parentNode);
    usersContainer.append(modal);

    editUserListener(modal);
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
    modal.addEventListener('hidden.bs.modal',()=>{
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

function editUserListener(modal){
    const nodeList = (modal !== undefined && modal !== null) ? [modal] : document.querySelectorAll('section[id^=editUserForm]');
    nodeList.forEach((node)=>{
        const form = node.querySelector('form');
        const btn = node.querySelector('button[type=button][name=editUser]');

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
        });
    });
}


window.onload = () => {
    (function init(){
        addUserListener();
        deleteUserListener();
        editUserListener();
    })();
}