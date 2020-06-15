"use strict"

const $content = document.querySelector('#content');

document.querySelector('#add-new').addEventListener('click', ()=> {
    openModal(); 
});

document.querySelector('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    const filmList = JSON.parse(localStorage.storedFilms);
    const searchResult = filmList.filter(film => { 
        return film.title.includes(e.target.query.value);
    })
    showMovies(searchResult);
});

/*function fillModal(id_film) {
    const film_info = localStorage.getItem(id_film);

}*/

function openModal(id_film) {
    fetch('./add-new.html')
        .then(res => res.text())
        .then(data => {
            let modal = document.createElement('div');
            $(modal).attr({"class":"modal fade", "tabindex":"-1", "role":"dialog", "aria-hidden":"true"})
            .html(data)
            .modal('show');
            $(modal).on('hidden.bs.modal', () => {
                $(modal).remove();
            })

            const form = modal.querySelector('.modalForm');
            
            //console.log(test);

            if(id_film) {
                const film_info = JSON.parse(localStorage.getItem(id_film));
                //console.log(JSON.parse(film_info));
                form.filmName.value = film_info.title;
                modal.querySelector('.saveBtn').addEventListener('click', (e) => {
                    film_info.title = form.filmName.value;
                    localStorage.setItem(`${id_film}`, JSON.stringify(film_info));
                    /*const {
                        elements: {
                            filmName: {
                                value: title
                            }
                        }
                    } = form;*/
                    //const filmList = JSON.parse(localStorage.storedFilms);
                    $(modal).modal('hide');
                    showAllMovies();
                })

            }else{

                modal.querySelector('.saveBtn').addEventListener('click', (e) => {
                    //const form = e.target.parentElement.previousElementSibling;
                    e.preventDefault();
                    const filmList = localStorage.storedFilms ? JSON.parse(localStorage.storedFilms) : [];
                    const {
                        elements: {
                            filmName: {
                                value: title
                            },
                            nameOrigin: {
                                value: origin
                            },
                            year: {
                                value: year
                            },
                            country: {
                                value: country
                            },
                            tagline: {
                                value: tagline
                            },
                            actors: {
                                value: actors
                            },
                            imdb: {
                                value: imdb
                            },
                            describ: {
                                value: describ
                            }
                        }
                    } = form;
                    
                    const id = `film_id_${Date.now()}`;

                    filmList.push({
                        id,
                        title
                    });

                    localStorage.setItem(id, JSON.stringify({
                        title,
                        origin,
                        year,
                        country,
                        tagline,
                        actors,
                        imdb: 'IMDb: ' + imdb,
                        describ
                    }));

                    localStorage.storedFilms = JSON.stringify(filmList);
                    $(modal).modal('hide');
                    showAllMovies();
                })
            }
        })
}

document.querySelector('.all-movies').addEventListener('click', ()=> {
    showAllMovies();
})

function showAllMovies() {
    const filmList = JSON.parse(localStorage.storedFilms);
    showMovies(filmList);
}

function showMovies(filmList) {
    fetch('./card.html')
    .then(res => res.text())
    .then(data =>{
        
        const $allFilms = document.createElement('div');
        
        filmList.forEach((film) => {
            
            let {title, describ, imdb} = JSON.parse(localStorage.getItem(film.id));
            const $film = document.createElement('div');
            $film.classList.add('currentFilm');
            $film.setAttribute('film_id', film.id);
            let currentFilm = template( {title, describ, imdb}  ,data);
            $film.innerHTML = currentFilm;
            $allFilms.append($film);
        })
        
        $content.firstElementChild.replaceWith($allFilms);

        document.querySelectorAll('.btn-delete').forEach((e) => {
            e.addEventListener('click', (el)=> {
                const current_id = el.target.closest('.currentFilm').getAttribute('film_id');
                deleteFilm(current_id);  
            })
        })  

        document.querySelectorAll('.btn-edit').forEach((e) => {
            e.addEventListener('click', (el)=> {
                const current_id = el.target.closest('.currentFilm').getAttribute('film_id');
                openModal(current_id); 
            })
        }) 
        
    }) 
}

function deleteFilm(film_id) {
    localStorage.removeItem(film_id);
               
    const films =  JSON.parse(localStorage.storedFilms);
    
                
    const filmForDel = films.findIndex(function(el) {
        return (el.id === film_id); 
    });

    films.splice(filmForDel, 1);
    
    localStorage.storedFilms = JSON.stringify(films);  
    showAllMovies();    
}    



function template(data, tpl) {
    const f = (strings, ...values) => strings.reduce((res, item, index) => {
        return index === strings.length - 1 ? 
            res +=`${item}` :
            res += `${item}${data[values[index]]}`;
    }, '');

    return eval('f`' + tpl + '`');
}