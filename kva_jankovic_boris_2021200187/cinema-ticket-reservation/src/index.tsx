import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppProvider } from './context/AppContext';

if (!localStorage.getItem('users')) {
    fetch('/user.json')
        .then(res => res.json())
        .then(data => localStorage.setItem('users', JSON.stringify(data)));
}

ReactDOM.render(
    <AppProvider>
        <App />
    </AppProvider>,
    document.getElementById('root')
);