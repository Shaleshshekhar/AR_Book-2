window.UIManager = {

  element: null,

  timeout: null,

  init() {

    console.log(
      'UIManager INIT'
    )

    this.element =
      document.querySelector(
        '#statusMessage'
      )
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