var searchs = []

function search ( query, page ) { 
    if( !query ) query = document.getElementById("query").value
    if ( !query ) return
    if ( !page ) page = 1

    fetch ( "http://localhost:3000/search/"+query+"&page="+page )
    .then ( res => res.json( ) )
    .catch ( err => { return ErrorFunction ( err ) } )
    .then ( data => {
        if ( !data.result ) return ErrorFunction ( "Sem Resultados" )
        let pager = ""
        if ( page > 1 && page < data.num_pages ) {
            pager =
            `<br>
            <span id="paginator" onclick="search('${query}',${page-1})">⬅️</span>
            <span  id="paginator" onclick="search('${query}',${page+1})">➡️</span>`
        }
        if( page === 1 ) {
            pager =
            `<br><span id="paginator" onclick="search('${query}',${page+1})">➡️</span>`
        }
        if( page === data.num_pages ) {
            pager =
            `<br><span id="paginator" onclick="search('${query}',${page-1})">⬅️</span>`
        }
        if ( data.num_pages === 1 ) {
            pager = ""
        }
        let Dater = document.querySelector(".content-body")
        Dater.innerHTML = ""
        Dater.innerHTML +=
        `
        <div class="pager">
            <span>Paginas</span><br><br>
            <span>${page}/${data.num_pages}</span><br>
            ${pager}
        </div>
        `
        data.result.forEach ( doujin => {
            searchs.push(doujin)
            let CoverExt = doujin.images.cover.t
            if ( CoverExt === "p" ) CoverExt = "png"
            if ( CoverExt === "j" ) CoverExt = "jpg"
            Dater.innerHTML +=
            `
            <div class="card" onclick=read(${doujin.id})>
                <div class="name">
                    <span>${doujin.title.pretty}</span>
                </div><br>
                <div class="image">
                    <img src="https://t.nhentai.net/galleries/${doujin.media_id}/cover.${CoverExt}">
                </div><br>
                <div class="tags">
                    ${doujin.tags.slice(0,3).map ( tag => `<span>${tag.name}</span>` ).join("")}
                </div>
            </div>
            `
        })

        Dater.innerHTML +=
        `<br><br>
        <div class="pager">
            <span>Paginas</span><br><br>
            <span>${page}/${data.num_pages}</span><br>
            ${pager}
        </div>
        `
    })
}

function read ( doujin ) {
    doujin = searchs.find ( _id => _id.id === doujin )
    console.log(doujin)
    let CoverExt = doujin.images.cover.t
    if ( CoverExt === "p" ) CoverExt = "png"
    if ( CoverExt === "j" ) CoverExt = "jpg"
    if ( !doujin ) return alert ( `Doujin nao encontrado ${doujin}` )
    let Dater = document.querySelector(".content-body")
        Dater.innerHTML = ""

        Dater.innerHTML =
            `
            <div class="doujin">
                <div class="header">
                    <div class="image">
                        <img src="https://t.nhentai.net/galleries/${doujin.media_id}/cover.${CoverExt}">
                    </div>

                    <div class="cont">
                        <div class="name">
                            <span>${doujin.title.pretty}</span>
                        </div><br>

                        <div class="tags">
                            ${doujin.tags.map ( tag => `<span>${tag.name}</span>` ).join("")}
                        </div>
                    </div>

                </div>
                <br><br><br>
                <div class="pages">
                </div>
            </div>
            `
    setTimeout ( ( ) => {
        let p = 0
        doujin.images.pages.forEach ( img => {
            p+=1
            let ext;
            if ( img.t ==="p" ) ext = "png"
            if ( img.t ==="j" ) ext = "jpg"

            let newImage = new Image()
            newImage.src = `https://i.nhentai.net/galleries/${doujin.media_id}/${p}.${ext}`
    
            newImage.onload = document.querySelector(".doujin .pages").appendChild(newImage)
        })
    },1000)
}