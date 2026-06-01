window.AudioManager = {

  initialized: false,

  context: null,

  init() {

    console.log(
      'AudioManager INIT'
    )
  },

  async unlock() {

    console.log(
      'AudioManager UNLOCK'
    )

    const introVideo =
      document.querySelector(
        '#introVideo'
      )

    try {

      await introVideo.play()

      introVideo.pause()

      introVideo.currentTime = 0

      this.context =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )()

      await this.context.resume()

      this.initialized = true

      console.log(
        'AUDIO UNLOCKED'
      )

    } catch (e) {

      console.error(e)
    }
  }
}