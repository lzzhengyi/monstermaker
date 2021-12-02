import React from 'react';
import { render } from 'react-dom';
import App from './components/App';

// uncomment so that webpack can bundle styles
import styles from './scss/application.scss';
// import './scss/application.scss';
// import "./style.scss";

render(
  <App />,
  document.getElementById('root')
);
