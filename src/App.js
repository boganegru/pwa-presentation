import React, { Component } from 'react';
import logo from './PWA-presentation.png';
import Demo from './components/Demo';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Demo/>
        </header>
      </div>
    );
  }
}

export default App;
