import React, { useState, useEffect } from 'react'
import { Keys } from './components/index.js'
import keyMap from './data/keyMap'

export default () => {
  const [keyPress, setKeyPress] = useState('')

  const handleKeyDown = (e) => setKeyPress(e.keyCode)

  useEffect(() => setKeyPress(''), [keyPress])

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <Keys props={keyMap} keyPress={keyPress} />
    </div>
  )
}
