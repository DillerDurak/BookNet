const BtnEl = document.getElementById('btn-el')
const key = 'AIzaSyDRU01fa_QTXe8wR0daXBcvEIywTqffzKY'
const bookList = document.querySelector('.book__list')
const quantity = document.querySelector('.info__quantity')
const NextPage = document.getElementById('next-page')
const bookInfo = document.querySelector('.info')
const spinnerEl = document.querySelector('.spinner')

const popup = document.getElementById('popup')

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


async function BookFecth(url){

    fetch(url)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        bookList.innerHTML = ''
        spinnerEl.style.display = 'none'
        let title = document.querySelector('#input-el').value
        bookInfo.innerHTML = `<h1 class="info__title">${title}</h1>`
        bookInfo.innerHTML += `<p class="info__quantity">Найдено ${data.totalItems}!</p>`
        for (let i=0; i<=20; i++){
            let title = data.items[i].volumeInfo.title.length < 30 ? data.items[i].volumeInfo.title: data.items[i].volumeInfo.title.slice(0,30) + '...'
            console.log(title)
            // let author = data.items[i].volumeInfo.authors
            // let snippet = data.items[i].searchInfo.textSnippet.slice(0,20)
            let category = data.items[i].volumeInfo.categories

            let image =  data.items[i].volumeInfo.imageLinks.thumbnail
            bookList.innerHTML += `
            <div class="new-book_item">
                <div class="new-book_img">
                    <a href="#">
                        <img src="${image}" alt="" class="img">
                    </a>

                </div>

                <div class="new-book_content">
                    <div class="new-book_title">
                        <span class="book__title">${title}</span>
                        <p class="book__category">${category}</p>
                    </div>
                    <a href="#" class="new-book_add" id="item-${i}">Добавить</a>
                </div>
            </div>
            `
            NextPage.style.display = 'block';
        }
    })
    .catch(error=>{
        console.log(error)
    })
}


async function BookAdd(url, csrftoken){
    const data = {
        'title': document.querySelector('.popup__title').textContent,
        'author': document.querySelector('#book_author').textContent,
        'category': document.querySelector('#book_category').textContent,
        'date_created': document.querySelector('#book_year').textContent,
        'description': document.querySelector('.popup__text').textContent,
        'image': document.querySelector('.book__img').src
    }
    console.log(JSON.stringify(data))
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))


}


BtnEl.addEventListener('click', function(){
    spinnerEl.style.display = 'block'
    let title = document.querySelector('#input-el').value
    let url = `https://www.googleapis.com/books/v1/volumes?q=${title}&projection=full&filter=paid-ebooks&key=${key}&maxResults=20`
    let elements = 20

    BookFecth(url)
    .then(
        NextPage.addEventListener('click', function(){
            let title = document.querySelector('#input-el').value
            let url = `https://www.googleapis.com/books/v1/volumes?q=${title}&projection=full&filter=paid-ebooks&key=${key}&maxResults=20&startIndex=${elements}`
            console.log(url)
            BookFecth(url)
            .then(elements += 20)
        })
    )
    .then(
        document.addEventListener('click', e=>{
            let num = e.target.id

            let popupTitle = document.querySelector('.popup__title')
            let popupImage = document.querySelector('.popup__image')
            let popupText = document.querySelector('.popup__text')
            let popupAuthor = document.querySelector('.popup__author')
            let popupCategory = document.querySelector('.popup__category')
            let popupYear = document.querySelector('.popup__year')

            if (num.slice(0,4) == 'item'){

                fetch(url)
                .then(response=>response.json())
                .then(data=>{
                    let url_of_book = `https://www.googleapis.com/books/v1/volumes/${data.items[num.slice(5,6)].id}`
                    fetch(url_of_book)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        let category = data.volumeInfo.categories[0].split('/')[0]
                        try{
                            popupText.textContent = data.volumeInfo.description.replace( /(<([^>]+)>)/ig, '')
                        }
                        catch{
                            popupText.textContent = 'У этой книги нету описания...'
                        }

                        popupTitle.textContent = data.volumeInfo.title
                        popupImage.innerHTML = `<img src=${data.volumeInfo.imageLinks.thumbnail} class='book__img' alt=''>`
                        popupAuthor.innerHTML = `<b>Authors</b>: <span id='book_author'>${data.volumeInfo.authors}</span>`
                        popupCategory.innerHTML = `<b>Category</b>: <span id='book_category'>${category}</span>`
                        popupYear.innerHTML = `<b>Year of publication</b>: <span id='book_year'>${data.volumeInfo.publishedDate}</span>`
                    })
                    .then(
                        popup.classList.add('open')
                    )
                    .then(
                        document.querySelector('#form-el').addEventListener('submit', ()=>{
                            BookAdd('/add-book/', csrftoken)
                        })
                    )
                    .then(
                        document.querySelector('.popup__close').addEventListener('click', ()=>{
                            popup.classList.remove('open')
                        })
                    )

                })


            }
        })
    )




})

