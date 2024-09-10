import React from 'react'
import { useNavigate } from 'react-router-dom';
import './Homepage.css'

function HomePage(){
  const navigate = useNavigate();

  const contributor = () => {
    navigate('/TaskManager');
  };

  const visitor = () => {
    navigate('/Visitor');
  }
    
    return(
      <>
      <div class='content'>
        <div className='loginPage'>
        <p className='login'><b>Belépés</b></p>
        <button onClick={visitor}>Vendégként</button>
        <button onClick={contributor}>Szerkesztőként</button>
        </div>
      </div>
      </>
    )
    
  }
  
  
  
  export default HomePage