console.log('APP INITIALIZING')

window.APP = {

  started: false,

  tracking: false,

  phase: 'splash'
}

// ====================================
// START APP
// ====================================

function startApp() {

  console.log(
    'APP STARTING'
  )

  // ====================================
  // SHOW SPLASH
  // ====================================

  document.querySelector(
    '#splashScreen'
  ).style.display = 'flex'

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
  // LOADING DOTS
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

  // ====================================
  // START BUTTON
  // ====================================

  startButton.addEventListener(

    'click',

    async () => {

      if (APP.started)
        return

      APP.started = true

      startButton.disabled = true

      startButton.style.opacity =
        '0.7'

      buttonText.innerText =
        'STARTING'

      loadingDots.style.display =
        'inline-block'

      await AudioManager.unlock()

      splashScreen.style.display =
        'none'

      UIManager.showMessage(
        'Scan the book'
      )
    }
  )
}

// ====================================
// COMPATIBILITY CHECK
// ====================================

function checkCompatibility() {

  if (

    !window.XR8 ||

    !XR8.XrDevice ||

    !XR8.XrDevice.isDeviceBrowserCompatible

  ) {

    console.log(
      'WAITING FOR XR8...'
    )

    setTimeout(
      checkCompatibility,
      250
    )

    return
  }

  const compatible =
    XR8.XrDevice.isDeviceBrowserCompatible()

  console.log(
    'COMPATIBLE:',
    compatible
  )

  // ====================================
  // UNSUPPORTED DEVICE
  // ====================================

 if (!compatible) {

  console.log(
    'UNSUPPORTED DEVICE'
  )

  setTimeout(() => {

    document.querySelector(
      '#fallbackScreen'
    ).style.display =
      'flex'

  }, 1000)

    document.querySelector(
      '#splashScreen'
    ).style.display =
      'none'

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
  // SUPPORTED DEVICE
  // ====================================

  startApp()
}

// ====================================
// WINDOW LOAD
// ====================================

window.addEventListener(

  'load',

  () => {

    console.log(
      'WINDOW LOADED'
    )

    checkCompatibility()
  }
)
