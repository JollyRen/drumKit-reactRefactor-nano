import React, { useState, useEffect } from 'react'
import Key from './Key'
import keyMap from '../data/keyMap.js'

export default ({ keyPress }) => {
  const [keysList, setKeysList] = useState([])

  useEffect(() => setKeysList(keyMap), [keyMap])

  return (
    <div className="keys">
      {keysList.map((keyEl, idx) => (
        <Key props={{ keyEl, keyPress }} key={idx} />
      ))}
    </div>
  )
}
