let characterInfo = {}



function characterClicked(name) {
    let character = characterInfo[name]
    $('#character-description').html(generateCharacter(name, character))
}

function formatName(name) {
    return name.replace(/_/g, ' ')
}

function generateNameButton(name) {
    return `<button class="is-block is-character-button" onclick="characterClicked('${name}')">${formatName(name)}</button>`
}

function openModal(id) {
    $('#' + id).addClass('is-active')
}

function closeModal(id) {
    $('#' + id).removeClass('is-active')
}

function generateCharacter(name, object) {
    return `<div class="character-information">
                <div class="character-block">
                    <img onclick="openModal('${name}')" src="${object['image']}" class="character-image" style="z-index: -1;"/>
                    <div style="position: relative;">
                        <div class="character-background" style="z-index: -2; position: absolute; height: 50vh;">
                            <div class="character-image-overlay">
                            </div>
                        </div>
                    </div>
                    <div class="character-text">
                        <div class="has-text-centered">
                            <p class="title has-text-white is-marginless" style="z-index: 1;">${formatName(name)}</p>
                            <p class="subtitle has-text-white is-marginless" style="z-index: 1;">Artist: ${formatName(object['artist'])}</p>
                        </div>
                        <div class="columns" style="margin-top: 16px">
                            <div class="column has-text-left">
                                <p>${object['description']}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal img-modal" id="${name}">
                    <div class="modal-background"></div>
                    <div class="modal-content modal-content-img">
                        <img class="region-image-fullscreen" src="${object['image']}"/>
                    </div>
                    <button class="modal-close is-large" onclick="closeModal('${name}')" aria-label="close"></button>
                </div>
            </div>`
}


function renderCharacters() {
    let column = $('#character-column')
    for (let name of Object.keys(characterInfo)) {
        column.append(generateNameButton(name))
    }
}

function getCharacterInfo() {
    console.log('Getting Data')
    $.ajax({
        dataType: "json",
        type: "get",
        url: './art.json',
        cache:false,
        success: function(data){
            characterInfo = data;
            renderCharacters(data)
            console.log(data)
        },
        error: function(XHR, status, error) {
            console.log(status)
            console.log(error)
        }
    });
}

$(document).keydown(function(event) {
    if(event.key === "Escape") {
        $('.modal.img-modal').removeClass('is-active')
    }
})

$( document ).ready(function() {
    getCharacterInfo()
});