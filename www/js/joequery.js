// I'll just make my own jQuery
function $(id) {
    this.id = id;
}

$.prototype.blackjackAndHookers = function() {
    return;
}

$.prototype.addClass = function(class) {
    if($(id).classList.contains(class)) {
        $(id).classList.add(class);
    }
};

$.prototype.hasClass = function(class) {
    if($(id).classList.contains(class)) {
        return true;
    } else {
        return false;
    }
};

$.prototype.removeClass = function(class) {
    if($(id).classList.contains(class)) {
        $(id).classList.remove(class);
    }
}