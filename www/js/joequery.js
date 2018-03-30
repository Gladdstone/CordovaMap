// I'll just make my own jQuery

let joeQuery = function(selector) {
    this.selector = selector;
    this.element = null;
}

joeQuery.prototype.init = function() {
    switch(this.selector[0]) {
        case ".":
            let className = this.selector.replace(".", "");
            this.element = document.getElementsByClassName(className);
            break;
        case "#":
            let id = this.selector.replace("#", "");
            this.element = document.getElementById(id);
            break;
        default:
            this.element = document.createElement(this.selector);
    }
}

joeQuery.prototype.addClass = function(className) {
    if(!this.element.classList.contains(className)) {
        this.element.classList.add(className);
    }
}

joeQuery.prototype.append = function(val) {
    this.element.innerHMTL = this.element.innerHTML + val;
}

joeQuery.prototype.blackjackAndHookers = function() {
    this.element.innerHTML = "In fact, forget the jQuery";
}

joeQuery.prototype.hasClass = function(className) {
    if(this.element.classList.contains(className)) {
        return true;
    }
    return false;
}

joeQuery.prototype.hide = function() {
    if(!this.element.classList.contains("hidden")) {
        this.element.style.display = "none";
        this.element.classList.add("hidden");
    }
}

joeQuery.prototype.html = function(val) {
    this.element.innerHTML = val;
}

joeQuery.prototype.removeClass = function(className) {
    if(this.element.classList.contains(className)) {
        this.element.classList.remove(className);
    }
}

joeQuery.prototype.show = function() {
    if(this.element.classList.contains("hidden")) {
        this.element.style.display = "initial";
        this.element.classList.remove("hidden");
    }
}

joeQuery.prototype.toggle = function() {
    if(this.element.classList.contains("hidden")) {
        this.element.style.display = "initial";
        this.element.classList.remove("hidden");
    } else {
        this.element.style.display = "none";
        this.element.classList.add("hidden");
    }
}

joeQuery.prototype.val = function(val) {
    return this.element.value = val;
}

$ = function(selector) {
    let element = new joeQuery(selector);
    element.init();
    return element;
}