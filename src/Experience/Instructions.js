export default class Instructions
{
    constructor()
    {
        this.element = document.querySelector('.instructions')
        this.closeButton = this.element.querySelector('.close-button')
        
        this.setEventListeners()
    }

    setEventListeners()
    {
        this.closeButton.addEventListener('click', () =>
        {
            this.element.style.display = 'none'
        })
    }
} 