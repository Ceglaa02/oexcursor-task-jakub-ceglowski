function addUserListener(){
    const btn = document.querySelector('button[name=addUser]');
    btn.addEventListener('click',()=>{

    });
}
window.onload = () => {
    (function init(){
        addUserListener();
    })();
}