

import { Route, Routes ,Navigate} from 'react-router-dom';
import './App.css'

import { Suspense } from 'react';

import AppLoader from './components/AppLoader/AppLoader';

import LoginForm from './pages/Login';



const App = () => {



  return (

      <Suspense fallback={<AppLoader />}>
        <Routes>
        <Route path="/" element={<Navigate replace to="/sign-in" />} />
          <Route path="/sign-in" element={ <LoginForm />} />
      
        </Routes>
      </Suspense>

  );
};


export default App
