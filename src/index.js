import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StyledEngineProvider } from '@mui/material';
import { CssBaseline } from "@mui/material";
import { Provider } from 'react-redux';
import store from './store/store';
import { ThemeProviderWrapper } from './providers/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <StyledEngineProvider injectFirst>
        <CssBaseline />
        <Provider store={store}>

          <App />

        </Provider>
      </StyledEngineProvider>
    </ThemeProviderWrapper>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
