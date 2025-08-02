import './App.css'
import Navbar from './components/Navbar'
import Body from './components/Body';
import Restaurant from './components/Restaurant';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Coordinates,AddCartData } from '../context/ContextApi';
import { useState } from 'react';
import CartPage from './components/CartPage';
import { useSelector } from 'react-redux';
import SignInPage from './components/SignInPage';

function App() {

  const visible=useSelector((state)=>state.toggleSlice.searchBarToggle)
  const[coord,setCoord]=useState({lat:25.44250 ,long:81.85170 })

  return (
    <Coordinates.Provider value={{coord,setCoord}}>
      <div className={visible? "overflow-hidden h-screen ":""}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navbar/>} >
              <Route path='/' element={<Body/>}></Route>
              <Route path='restaurant/:id' element={<Restaurant/>}></Route>
              <Route path='Cart' element={<CartPage/>}></Route>
              <Route path="SignInPage" element={<SignInPage/>} ></Route>
              <Route path='*' element={<h1 className='text-[60px] text-red-500 font-bold bg-gray-200 p-4 px-10 rounded-2xl shadow-xl'>COMMING SOON...</h1>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Coordinates.Provider>
  )
}

export default App
