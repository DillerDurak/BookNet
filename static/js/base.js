document.querySelector('.header__burger').addEventListener('click', ()=>{
    document.querySelector('.header__burger').classList.toggle('active')
    document.querySelector('.menu').classList.toggle('active')
    document.querySelector('.search').classList.toggle('active')
    document.body.classList.toggle('lock')
})