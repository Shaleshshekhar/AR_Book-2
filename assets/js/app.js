console.log('APP INITIALIZING')

window.APP = {

  started: false,

  tracking: false,

  phase: 'splash'
}

window.addEventListener(

  'DOMContentLoaded',

  () => {

    console.log(
      'DOM READY'
    )

    AudioManager.init()
    UIManager.init()
    TrackingManager.init()
    IntroManager.init()
    InteractionManager.init()
    PuzzleManager.init()

    const splashScreen =
      document.querySelector(
        '#splashScreen'
      )

    const startButton =
      document.querySelector(
        '#startButton'
      )

    startButton.addEventListener(

      'click',

      async () => {

        if (APP.started) return

        APP.started = true

        startButton.innerText =
          'LOADING...'

        startButton.disabled = true

        await AudioManager.unlock()

        splashScreen.style.display =
          'none'

        UIManager.showMessage(
          'Scan the book'
        )
      }
    )
  }
)
