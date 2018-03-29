// I'll just make my own jQuery
class $ {

    constructor(selector) {
        this.selector = document.getElementById(selector);  // TODO support other selectors
    }

    blackjackAndHookers() {
        selector.innerHTML = "In fact, forget the jQuery";
    }

    addClass(class) {
        if(!hasClass(class)) {
            selector.classList.add(class);
        }
    }

    hasClass(class) {
        if(selector.classList.contains(class)) {
            return true;
        } else {
            return false;
        }
    }

    hide() {
        if(!hasClass("hidden")) {
            selector.style.display = "none";
            selector.classList.add("hidden");
        }
    }

    removeClass(class) {
        if(hasClass(class)) {
            selector.classList.remove(class);
        }
    }

    show() {
        if(hasClass("hidden")) {
            selector.style.display = "initial";
            selector.classList.remove("hidden");
        }
    }

    toggle() {
        if(hasClass("hidden")) {
            removeClass("hidden");
        } else {
            addClass("hidden");
        }
    }
    
}