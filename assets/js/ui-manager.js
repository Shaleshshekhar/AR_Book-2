window.UIManager = {

  element: null,

  timeout: null,

  init() {

    console.log(
      'UIManager INIT'
    )
        
    this.debugPanel =
      document.querySelector(
        '#debugPanel'
      )
      
    this.element =
      document.querySelector(
        '#statusMessage'
      )
  },
  
    
  log(text) {

    console.log(text)

    if (!this.debugPanel)
      return

    const line =
      document.createElement('div')

    line.innerText = text

    this.debugPanel.appendChild(
      line
    )

    // LIMIT LOGS

    while (
      this.debugPanel.children
        .length > 20
    ) {

      this.debugPanel.removeChild(
        this.debugPanel.firstChild
      )
    }

    this.debugPanel.scrollTop =
      this.debugPanel.scrollHeight
  },

    showMessage(text, duration = 2500) {

      clearTimeout(this.timeout)

      this.element.innerText =
        text

      this.element.classList.add(
        'visible'
      )

      this.timeout =
        setTimeout(() => {

          this.hideMessage()

        }, duration)
    },

  hideMessage() {

    this.element.classList.remove(
      'visible'
    )
  }
}