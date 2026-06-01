window.AudioManager = {

  initialized: false,

  context: null,

  sounds: {},

  init() {

    console.log(
      'AudioManager INIT'
    )

    // ====================================
    // SOUND PLACEHOLDERS
    // ====================================

    this.sounds.tick =
      new Audio(
        './assets/audio/tick.mp3'
      )

    this.sounds.solved =
      new Audio(
        './assets/audio/solved.mp3'
      )

    this.sounds.unlock =
      new Audio(
        './assets/audio/unlock.mp3'
      )

    // PRELOAD

    Object.values(
      this.sounds
    ).forEach(sound => {

      sound.preload = 'auto'
    })
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

      // WARM UP AUDIO

      Object.values(
        this.sounds
      ).forEach(sound => {

        sound.volume = 0

        sound.play()

        sound.pause()

        sound.currentTime = 0

        sound.volume = 1
      })

      this.initialized = true

      console.log(
        'AUDIO UNLOCKED'
      )

    } catch (e) {

      console.error(e)
    }
  },

  playTick() {

    const sound =
      this.sounds.tick.cloneNode()

    sound.volume = 1

    sound.play()
  }
}