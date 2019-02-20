let characterInfo = {}



function characterClicked(name) {
    let character = characterInfo[name]
    $('#character-description').html(generateCharacter(name, character))
}

function formatName(name) {
    return name.replace('_', ' ')
}

function generateNameButton(name) {
    return `<button class="is-block is-character-button" onclick="characterClicked('${name}')">${formatName(name)}</button>`
}

function generateCharacter(name, object) {
    return `<div class="character-information">
                <div class="character-block">
                    <div style="position: relative;">
                        <div class="character-background" style="z-index: -2; position: absolute; height: 50vh;">
                            <div class="character-image-overlay">
                                <img src="./images/arysa.png" class="character-image ${object['known'] ? '' : 'is-unknown'}" style="z-index: -1;"/>
                            </div>
                        </div>
                    </div>
                    <div class="character-text">
                        <div class="has-text-centered">
                            <p class="title has-text-white is-marginless" style="z-index: 1;">${formatName(name)}</p>
                            <p class="subtitle has-text-white is-marginless" style="z-index: 1; font-weight: bold;">${formatName(object['location'])}</p>
                            <p class="subtitle has-text-white" style="z-index: 1;">${formatName(object['profession'])}</p>
                        </div>
                        <div class="columns">
                            <div class="column has-text-left">
                                <p>${object['description']}</p>
                            </div>
                        </div>
                    </div>
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
        url: './characters.json',
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


$( document ).ready(function() {
    getCharacterInfo()
});