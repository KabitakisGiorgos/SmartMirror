import { EventsService } from '../services/events.service';
export class Cursor {
    private selectableDivs: Array<string>;
    private animatingDivs: Array<string>;
    private collidableElement: string;
    private isVisible = false;        // indicates whether the cursor is visible
    debug: boolean;

    constructor(private events: EventsService, debug?) {
        this.debug = debug;
        if (debug) {
            $(document).on('mousemove', (e) => {
                var mousetop = e.pageY;
                var mouseleft = e.pageX;
                if ($('#cursor').is(':visible')) {
                    this.Move(mousetop, mouseleft);
                }
            });
        }
    }

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

    async Move(x, y) {
        if (this.isVisible) {
            var doc = document.documentElement;
            var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            x = x - $('.cursor').height() / 2 + top;
            y = y - $('.cursor').width() / 2 + left;
            if (y > 1850) y = 1850;// Dont go to Navbar
            if (x > 1000) x = 1000;//Bottom constraint

            $('#cursor').css({ 'top': x, 'left': y });

            this.collidableElement = undefined;
            let collision = await this.checkCollisions() as string;
            this.setSelectedElement(collision);
            if (collision)
                this.setCursorIcon('tap');
            else
                this.setCursorIcon('normal');
        }
    }

    /**
    * Sets left or right hand orientation
    * 
    * @param {string} pos - left | right 
    */
    SetOrientation(pos) {
        var cursor = $('#cursor .cursor');
        if (pos === 'left') {
            if (cursor.hasClass('left')) return;
            else cursor.removeClass('right').addClass('left');
        } else if (pos === 'right') {
            if (cursor.hasClass('right')) return;
            else cursor.removeClass('left').addClass('right');
        }
    }

    setCursorIcon(type) {
        var cursor = $('#cursor .cursor');
        if (type === 'normal') {
            if (cursor.hasClass('normal')) return;
            else cursor.removeClass('tap').addClass('normal');
        } else if (type === 'tap') {
            if (cursor.hasClass('tap')) return;
            else cursor.removeClass('normal').addClass('tap');
        }
    }

    registerSelectableDivs(array: Array<string>) {
        if (this.selectableDivs)
            this.selectableDivs = this.selectableDivs.concat(array);
        else this.selectableDivs = array;
    }

    unregisterSelectableDivs(array: Array<string>) {
        array.forEach((element) => {
            let index = this.selectableDivs.findIndex((div) => {
                return div === element;
            });
            if (index = -1)
                this.selectableDivs.splice(index, 1);
        });
    }

    registerAnimatingDivs(array: Array<string>) {
        if (this.animatingDivs)
            this.animatingDivs = this.animatingDivs.concat(array);
        else this.animatingDivs = array;
    }

    unregisterAnimatingDivs(array: Array<string>) {
        array.forEach((element) => {
            let index = this.animatingDivs.findIndex((div) => {
                return div === element;
            });
            if (index = -1)
                this.animatingDivs.splice(index, 1);
        });
    }

    checkCollisions() {
        var cursorRect = document.getElementsByClassName('cursor')[0].getBoundingClientRect();
        let topMost = document.elementFromPoint(cursorRect.left - 1, cursorRect.top - 1);//The minus 1 is for ignoring the cursor itself
        return new Promise((resolve, reject) => {
            if (this.selectableDivs) {
                for (let i = 0; i < this.selectableDivs.length; i++) {
                    try {
                        /**
                         *  Code for overlapping divs registered
                         */
                        var element = topMost;
                        var found = false;

                        if (topMost.id != this.selectableDivs[i]) {
                            for (; element.parentElement;) {
                                if (element.parentElement.id === this.selectableDivs[i]) {
                                    found = true;
                                    break;

                                } else {
                                    element = element.parentElement;
                                }
                            }
                        } else found = true;


                        if (!found) {
                            continue;
                        }
                        //END
                        var elementRect = document.getElementById(this.selectableDivs[i]).getBoundingClientRect();
                        if (!(cursorRect.right < elementRect.left ||
                            cursorRect.left > elementRect.right ||
                            cursorRect.bottom < elementRect.top ||
                            cursorRect.top > elementRect.bottom)) {
                            if (this.animatingDivs && this.animatingDivs.includes(this.selectableDivs[i].toString())) {
                                this.events.publish('animate', { element: this.selectableDivs[i].toString() });
                            }
                            resolve(this.selectableDivs[i].toString());
                            return;
                        }
                    }
                    catch (e) {
                        resolve(null);
                        return;
                    }
                }
                resolve(null);
                return;

            } else {
                resolve(null);
                return;
            }
        });
    }

    getSelectedElement() {
        return this.collidableElement;
    }

    setSelectedElement(elementId) {
        this.collidableElement = elementId
    }

    clickElement() {
        $('#' + this.collidableElement).click();
        this.collidableElement = undefined;
    }

    tapping() {
        var cursor = $('#cursor .cursor');
        if (cursor.hasClass('normal')) return false;
        else return true;
    }
}