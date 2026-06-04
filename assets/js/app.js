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

      document.querySelector(
        '#splashScreen'
      ).style.display = 'none'

      document.querySelector(
        '#entryBackground'
      ).classList.add(
          'hidden'
      )

      setTimeout(() => {

        document.querySelector(
          '#entryBackground'
        ).style.display = 'none'

      }, 500)

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

    setTimeout(
      checkCompatibility,
      250
    )

    return
  }

  const compatible =
    XR8.XrDevice.isDeviceBrowserCompatible()

  if (!compatible) {

    document.querySelector(
      '#fallbackScreen'
    ).style.display =
      'flex'

    requestAnimationFrame(() => {

      document.querySelector(
        '#entryBranding'
      ).classList.add(
        'compact'
      )

      document.querySelector(
        '#fallbackContent'
      ).classList.add(
        'expanded'
      )
    })

    document.querySelector(
      'a-scene'
    ).style.display =
      'none'

    return
  }

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
