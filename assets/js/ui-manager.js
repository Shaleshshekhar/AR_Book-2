window.UIManager = {

  element: null,

  debugPanel: null,

  timeout: null,

  init() {

    console.log(
      'UIManager INIT'
    )

    this.element =
      document.querySelector(
        '#statusMessage'
      )

    this.debugPanel =
      document.querySelector(
        '#debugPanel'
      )

    this.log(
      'DEBUG PANEL READY'
    )
  },

  // ====================================
  // STATUS MESSAGE
  // ====================================

  showMessage(
    text,
    duration = 2500
  ) {

    clearTimeout(
      this.timeout
    )

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
  },

  // ====================================
  // DEBUG LOG
  // ====================================

  log(text) {

    console.log(text)

    if (
      !this.debugPanel
    ) return

    const line =
      document.createElement(
        'div'
      )

    line.innerText = text

    this.debugPanel.appendChild(
      line
    )

    // LIMIT SIZE

    while (
      this.debugPanel
        .children.length > 20
    ) {

      this.debugPanel.removeChild(
        this.debugPanel
          .firstChild
      )
    }

    this.debugPanel.scrollTop =
      this.debugPanel.scrollHeight
  }
}
