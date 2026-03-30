import React, { Component } from 'react';
import './App.css';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <MyProvider>
        <Login />
        <BrowserRouter >
        <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;
