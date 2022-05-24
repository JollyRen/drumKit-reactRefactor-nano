import React, { useEffect, useState } from 'react'

export default (props) => {
  const { keyPress, keyEl } = props.props

  const [code, setCode] = useState(keyEl.keyCode)
  const [soundName, setSoundName] = useState(keyEl.sound)
  const [letter, setLetter] = useState(keyEl.key)
  const [audio, setAudio] = useState(new Audio(`./src/sounds/${soundName}.wav`))
  const [isPlaying, setIsPlaying] = useState('key')

  const handleTransition = () => setIsPlaying('key')

  useEffect(
    () =>
      keyPress == code
        ? ((audio.currentTime = 0), audio.play(), setIsPlaying('key playing'))
        : null,
    [keyPress]
  )

  return (
    <>
      <div data-key={code} className={isPlaying} onTransitionEnd={handleTransition}>
        <kbd>{letter.toUpperCase()}</kbd>
        <span className="sound">{soundName}</span>
      </div>
    </>
  )
}
