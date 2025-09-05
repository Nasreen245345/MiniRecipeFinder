import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/auth";
const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex justify-between py-5 m-2 mx-8 bg-white relative">
      <div>
        <h3 className="text-2xl font-bold">Receipe HUB</h3>
      </div>
      <div className="hidden md:flex gap-5 items-center">
        <ul className="flex gap-5 items-center justify-center">
          <li>
            <Link to="/" className="font-bold text-xl">Home</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/favourites" className="font-bold text-xl">Favourite</Link>
              </li>
              <li
                className="bg-orange-500 lg:p-2 lg:px-3 md:p-1 md:px-2 text-xl rounded-md text-white font-semibold cursor-pointer hover:bg-orange-600 "
                onClick={logout}
              >
                Logout
              </li>
            </>
          ) : (
            <div className="flex gap-3">
                <li className="bg-orange-500 lg:p-2 lg:px-3 md:p-1 md:px-2  rounded-md text-white font-semibold cursor-pointer text-xl hover:bg-orange-600">
              <Link to="/login" className="font-bold text-xl">Login</Link>
            </li>
            <li className="bg-orange-500 lg:p-2 lg:px-3 md:p-1 md:px-2  rounded-md text-white font-semibold cursor-pointer text-xl hover:bg-orange-600">
              <Link to="/signup" className="font-bold text-xl">Sign Up</Link>
            </li>
            </div>
            
          )}
        </ul>
        {/* mobile menu button */}
        
      </div>
<button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-black px-2  focus:outline-none"
        >
          ☰
        </button>
      {menuOpen && (
  <div className='md:hidden absolute right-4 pb-2 mt-8 px-4 bg-white flex flex-col gap-2 shadow-lg z-50'>
      <Link to="/">Home</Link>
      
      {user ? (
       <>
        <Link to="/favourites">Favourites</Link>
        <button onClick={logout} className=' bg-orange-500 sm:p-1 rounded-md text-center text-white font-semibold cursor-pointer'>Logout</button></>
      ) : (
        <Link to="/login" className='bg-orange-500 p-2 cursor-pointer rounded-md'>Sign In</Link>
      )}
  </div>
)}

    </div>
  );
};

export default Header;
