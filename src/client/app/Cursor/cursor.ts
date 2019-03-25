export class Cursor {
    //REVIEW: if we need restricted buttons
    //REVIEW: click elements or somehow just use the selectable 
    //REVIEW: loading 
    
    isLoadingCursor = false;  // indicates whether the cursor is loading
    LoadingTimeout;           // loading timeout until click
    private isVisible = false;        // indicates whether the cursor is visible
    constructor() { }

    /**
    * Indicates whether the cursor is visivle
    * 
    * @returns {boolean}
    */
    IsVisible() {
        return this.isVisible;
    }

    /**
    * Show cursor's image
    */
    Show() {
        if (!this.isVisible) {
            $('#cursor').show();
            this.isVisible = true;
        }
    }

    /**
    * Hide cursor's image
    */
    Hide() {
        // Destroy(); FIXME:
        $('#cursor').hide();
        this.isVisible = false;
    }

    Move(x, y) {
        if (this.isVisible) {
            var doc = document.documentElement;
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            x = x - $('.cursor').height() / 2 + top;
            y = y - $('.cursor').width() / 2 + left;
            if (y > 1481) y = 1481;// Dont go to Navbar
            if (x > 975) x = 975;//Bottom constraint
            $("#cursor").css({ "top": x, "left": y });
            // Hover.Manager(); FIXME:
        }
    }

    /**
    * Sets left or right hand orientation
    * 
    * @param {string} pos - left | right 
    */
    SetOrientation(pos) {
        if (pos == "left") {
            $('#cursor .cursor').removeClass('right').addClass('left');
        }
        else if (pos == "right") {
            $('#cursor .cursor').removeClass('left').addClass('right');
        }
    }

}