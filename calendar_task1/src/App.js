import React, { useState } from 'react';
import Calendar from './components/Calendar';
import './App.css';

function App() {
  const [bgColor, setBgColor] = useState(false);
  const toggleBgColor = () => {
    setBgColor(!bgColor);
  };

  return (
    <div style={{height:'100%', paddingTop:'50px'}} className={bgColor ? 'bgColor' : ''}>
      <center>
        <Calendar />
        <button className='btnToggleBg' onClick={toggleBgColor}>Toggle Background</button>
      </center>
    </div>
  );
}

export default App;