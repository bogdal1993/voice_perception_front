import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';
import { NavigationState } from './context/navContext';
import { BrowserRouter } from 'react-router-dom';
import { ChartState } from './context/chartsContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <NavigationState>
      <ChartState>
        <App /> 
      </ChartState>
    </NavigationState>
  </BrowserRouter>
);