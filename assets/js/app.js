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
  // PRELOAD EXPERIENCE ASSETS
  // ====================================

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

  const introVideo =
    document.querySelector(
      '#introVideo'
    )

  const outroVideo =
    document.querySelector(
      '#outroVideo'
    )

  const lockerModel =
    document.querySelector(
      '#lockerModel'
    )

  console.log(
    'STARTING ASSET PRELOAD'
  )

  introVideo.src =
    './assets/intro_video.mp4'

  outroVideo.src =
    './assets/outro_video.mp4'

  lockerModel.setAttribute(
    'gltf-model',
    './assets/locker.glb'
  )

  introVideo.load()
  outroVideo.load()
  introVideo.addEventListener(
  'loadeddata',
  () => console.log(
    'INTRO READY'
  ),
  { once:true }
)

outroVideo.addEventListener(
  'loadeddata',
  () => console.log(
    'OUTRO READY'
  ),
  { once:true }
)

lockerModel.addEventListener(
  'model-loaded',
  () => console.log(
    'MODEL READY'
  ),
  { once:true }
)

Promise.all([

  new Promise(resolve => {

    introVideo.addEventListener(
      'loadeddata',
      resolve,
      { once:true }
    )
  }),

  new Promise(resolve => {

    outroVideo.addEventListener(
      'loadeddata',
      resolve,
      { once:true }
    )
  }),

  new Promise(resolve => {

    lockerModel.addEventListener(
      'model-loaded',
      resolve,
      { once:true }
    )
  })

]).then(() => {

  console.log(
    'ALL ASSETS READY'
  )

  startButton.disabled =
    false

  buttonText.innerText =
    'START EXPERIENCE'

  loadingDots.innerText =
    ''
})

  // ====================================
  // SPLASH REFERENCES
  // ====================================

  const splashScreen =
    document.querySelector(
      '#splashScreen'
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

  try {

    const compatible =
      XR8.XrDevice.isDeviceBrowserCompatible()

    if (!compatible) {

      document.querySelector(
        '#splashScreen'
      ).style.display =
        'none'

      const fallback =
        document.querySelector(
          '#fallbackScreen'
        )

      fallback.style.display =
        'flex'

      setTimeout(() => {

        fallback.classList.add(
          'animate'
        )

      }, 250)

      document.querySelector(
        'a-scene'
      ).style.display =
        'none'

      return
    }

    startApp()

  } catch (e) {

    console.log(
      'XR not ready yet'
    )

    setTimeout(
      checkCompatibility,
      250
    )

    return
  }
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
