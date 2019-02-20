const focusButtonClasses = ['animate-world', 'focus-khalesh', 'focus-eryltell', 'focus-azuros', 'focus-verzug', 'focus-mohram']
const classNames = ['khalesh', 'eryltell', 'azuros', 'verzug']
var worldInfo = {};
let continentInfo = {};


function getAnimationStyle(obj) {
    return {
        backgroundSize: obj.css('background-size'),
        backgroundPositionX: obj.css('background-position-x'),
        backgroundPositionY: obj.css('background-position-y')
    }
}

function setAnimationStyle(obj, style) {
    obj.css('background-size', style.backgroundSize)
    obj.css('background-position-x', style.backgroundPositionX)
    obj.css('background-position-y', style.backgroundPositionY)
}

function createAnimation(object, name) {
    $.keyframe.define([{
        name: 'to-' + name,
        from: {},
        to: {
            'background-size': object.size,
            'background-position-x': object.x,
            'background-position-y': object.y
        }
    }]);
}

function doAnimation(jqueryObject, object, duration, name) {
    createAnimation(object, name)
    jqueryObject.playKeyframe({
        name: 'to-' + name, // name of the keyframe you want to bind to the selected element
        duration: duration + 'ms', // [optional, default: 0, in ms] how long you want it to last in milliseconds
        timingFunction: 'steps(' + Math.floor((duration*30)/1000) + ')', // [optional, default: ease] specifies the speed curve of the animation
        fillMode: 'forwards', //[optional, default: 'forward']  how to apply the styles outside the animation time, default value is forwards
    });
}

function applyFocusClass(className, isCity) {
    let obj = $('#top-hero')
    obj.removeClass('animate-world')
    setAnimationStyle(obj, getAnimationStyle(obj))
    let overlay = $('#world-overlay')
    overlay.removeClass('animate-world-overlay')
    overlay.css('background-color', '#00000090')
    if (isCity) {
        doAnimation(obj, continentInfo[className], 1000, className)
    } else {
        doAnimation(obj, worldInfo[className], 500, className)
    }
}

function setText(className, isCity) {
    if (worldInfo === {} || (isCity && continentInfo === {}) ) {
        console.log("Descriptions are empty...")
        return
    }
    let info = worldInfo
    if (isCity) {
        info = continentInfo
    }
    let infoBlock = $('#info-block')
    let descriptionBlock = $('#description')

    infoBlock.html(info[className].description);
    infoBlock.animate({ scrollTop: 0 }, "slow");

    descriptionBlock.addClass('active-description')
}

function showCities(className) {
    let subMenu = $('#sub-menu')
    subMenu.html('')
    for (let name of Object.keys(worldInfo[className].cities)) {
        let r= $('<button id="button-' + name + '" onclick="focusCity(\'' + name + '\')" class="continent-button subtitle is-block">' + name.replace('_', ' ') + '</button>');
        subMenu.append(r);
    }
    continentInfo = worldInfo[className].cities
}

function setActive(className, isCity) {
    let names = classNames
    if (isCity) {
        names = Object.keys(continentInfo)
    }
    for (let oldClassName of names) {
        $('#button-' + oldClassName).removeClass('active-continent-button')
    }
    $('#button-' + className).addClass('active-continent-button')
    $('#sub-menu').removeClass('is-hidden')
}


function showImages(name, isCity) {
    let info = worldInfo
    if (isCity) {
        info = continentInfo
    }
    let imageLevel = $('#img-level')
    let worldObject = info[name]
    let i = 0

    imageLevel.html('')
    for (let image of worldObject.images) {
        imageLevel.append($(generateImageItem('img-' + i, image)))
        i += 1
    }
}


function onFocusButton(className) {
    applyFocusClass(className, false)
    setText(className, false)
    setActive(className, false)
    showCities(className)
    showImages(className, false)
}

function onFocusCityButton(className) {
    applyFocusClass(className, true)
    setText(className, true)
    setActive(className, true)
    showImages(className, true)
}


function getWorldInfo() {
    console.log('Getting Data')
    $.ajax({
        dataType: "json",
        type: "get",
        url: './descriptions.json',
        cache:false,
        success: function(data){
            worldInfo = data;
            console.log(data)
        },
        error: function(XHR, status, error) {
            console.log(status)
            console.log(error)
        }
    });
}

// City Buttons

function focusCity(name) {
    onFocusCityButton(name)
}

// Continent Buttons

function focusContinent(name) {
    onFocusButton(name)
}

let isHidden = false;

function hideOverlays() {
    let obj = $('#world-overlay')
    if (isHidden) {
        obj.removeClass('is-hidden')
    } else {
        obj.addClass('is-hidden')
    }
    isHidden = !isHidden
}

function loadingDone() {
    $('#loading').addClass('is-hidden')
    $('#not-loading').removeClass('is-hidden')
}

function openModal(id) {
    $('#' + id).addClass('is-active')
}

function closeModal(id) {
    $('#' + id).removeClass('is-active')
}

function generateImageItem(id, imageUrl) {
    return `<div class="level-item">
        <img class="region-image" onclick="openModal('${id}')" src="${imageUrl}"/>
        <div class="modal img-modal" id="${id}">
            <div class="modal-background"></div>
            <div class="modal-content modal-content-img">
                <img class="region-image-fullscreen" src="${imageUrl}"/>
            </div>
            <button class="modal-close is-large" onclick="closeModal('${id}')" aria-label="close"></button>
        </div>
    </div>`
}

$(document).keydown(function(event) {
    if(event.key === "Escape") {
        $('.modal.img-modal').removeClass('is-active')
    }
})

$( document ).ready(function() {
    getWorldInfo()
    $.keyframe.define([]); // Init the keyframe shizzle
    $('<img/>').attr('src', './World.jpg').on('load', function() {
        $(this).remove(); // prevent memory leaks as @benweet suggested
        $('#top-hero').css('background-image', 'url("./World.jpg")');
        loadingDone()
    });
});