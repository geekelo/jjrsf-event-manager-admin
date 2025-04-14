

import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'

import { Suspense } from 'react';

import AppLoader from './components/AppLoader/AppLoader';

import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';


const App = () => {



  return (
<div className="app-container">
      <Suspense fallback={<AppLoader />}>
        <Routes>
          <Route path="/sign-in" element={ <LoginForm />} />
          <Route path="/sign-up" element={ <RegisterForm />} />
      
        </Routes>
      </Suspense>
    </div>
  );
};


export default App
