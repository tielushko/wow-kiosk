import React from 'react'
import {Route} from 'react-router-dom'
import Home from './pages/Home/Home'
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <Route to='/' exact render={() => (
        <Home />
      )}/>
    </div>
  );
}

export default App;
