export class Modal {
    constructor(modalContainer) {
        this.modalContainer = modalContainer;
        this.opened = false;
        this.modalContainer.querySelector('.close_modal').addEventListener('click', this.close.bind(this));
        document.addEventListener('keyup', this.escClose.bind(this));
    }

    open() {
        this.modalContainer.classList.add('show_modal');
        this.opened = true;
    }
    close() {
        this.modalContainer.classList.remove('show_modal');
    }

    escClose(e) {
        if (e.code === 'Escape' && this.opened) {
            this.close();
        }
    }

}