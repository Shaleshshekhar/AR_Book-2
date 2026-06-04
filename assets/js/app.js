console.log('APP INITIALIZING')

window.APP = {

  started: false,

  tracking: false,

  phase: 'splash'
}

// ====================================
// WAIT FOR FULL WINDOW LOAD
// ====================================

window.addEventListener(

  'load',

  () => {

    console.log(
      'WINDOW LOADED'
    )
    
    // ====================================
    // UNSUPPORTED DEVICE
    // ====================================

    if (

      window.XR8 &&
      XR8.XrDevice &&
      !XR8.XrDevice.isDeviceBrowserCompatible()

    ) {

      console.log(
        'UNSUPPORTED DEVICE'
      )

      document.querySelector(
        '#fallbackScreen'
      ).style.display = 'flex'

      const splash =
        document.querySelector(
          '#splashScreen'
        )

      if (splash) {

        splash.style.display =
          'none'
      }

      const scene =
        document.querySelector(
          'a-scene'
        )

      if (scene) {

        scene.style.display =
          'none'
      }

      return
    }

    // ====================================
    // INIT MANAGERS
    // ====================================

    AudioManager.init()
    UIManager.init()
    TrackingManager.init()
    IntroManager.init()
    InteractionManager.init()
    PuzzleManager.init()

    console.log(
      'ALL MANAGERS INITIALIZED'
    )

    // ====================================
    // SPLASH REFERENCES
    // ====================================

    const splashScreen =
      document.querySelector(
        '#splashScreen'
      )

    const startButton =
      document.querySelector(
        '#startButton'
      )

    const buttonText =
      document.querySelector(
        '#buttonText'
      )

    const loadingDots =
      document.querySelector(
        '#loadingDots'
      )
      
    // ====================================
    // LOADING DOTS ANIMATION
    // ====================================

    let dots = ''

    const loadingInterval =
      setInterval(() => {

        if (
          !startButton.disabled
        ) {

          clearInterval(
            loadingInterval
          )

          loadingDots.innerText =
            ''

          return
        }

        if (
          dots.length >= 3
        ) {

          dots = ''

        } else {

          dots += '.'
        }

        loadingDots.innerText =
          dots

      }, 420)

    console.log(
      'SPLASH REFERENCES:',
      splashScreen,
      startButton
    )

    // ====================================
    // START BUTTON
    // ====================================

    startButton.addEventListener(

      'click',

      async () => {

        console.log(
          'START BUTTON CLICKED'
        )

        if (APP.started) {

          console.log(
            'APP ALREADY STARTED'
          )

          return
        }

        APP.started = true

        // ====================================
        // BUTTON STATE
        // ====================================

        startButton.disabled = true

        startButton.style.opacity =
          '0.7'

        buttonText.innerText =
          'STARTING'

        loadingDots.style.display =
          'inline-block'

        // ====================================
        // AUDIO UNLOCK
        // ====================================

        await AudioManager.unlock()

        console.log(
          'AUDIO READY'
        )

        // ====================================
        // HIDE SPLASH
        // ====================================

        splashScreen.style.display =
          'none'

        console.log(
          'SPLASH HIDDEN'
        )

        // ====================================
        // SHOW STATUS
        // ====================================

        UIManager.showMessage(
          'Scan the book'
        )
      }
    )
  }
)
