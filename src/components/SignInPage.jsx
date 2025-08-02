import { signInWithPopup, signOut } from "firebase/auth";
import React from "react";
import { auth, provider } from "../config/firebaseAuth";
import { useDispatch, useSelector } from "react-redux";
import { addUserData, removeUserData } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
// import { toggleLogin } from "../utils/toogleSlice";


function SignInPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.authSlice.userData);


  async function handleAuth() {
        let data = await signInWithPopup(auth, provider);
        const userData = {
            name: data.user.displayName,
            photo: data.user.photoURL,
        };
        dispatch(addUserData(userData));
        navigate("/");
    }

    async function handleLogout() {
        await signOut(auth);
        dispatch(removeUserData());
    }



  return (
        <div
            className="w-full h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat overflow-hidden fixed"
            style={{
                backgroundImage:
                "url('https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg')",
            }}
            >
            {userData ? (
                <button
                    onClick={handleLogout}
                    className="w-[400px] h-[100px] text-3xl p-5 bg-[#ec8632] text-white shadow-xl rounded-2xl font-black hover:bg-amber-500 hover:cursor-pointer"
                >
                    Logout
                </button>
            ) : (
                    <div className="text-center">
                    <button
                        onClick={handleAuth}
                        className="w-[400px] h-[100px] text-3xl p-5 bg-[#ec8632] text-white shadow-xl rounded-2xl font-black hover:bg-amber-500 hover:cursor-pointer"
                    >
                        Login with GOOGLE
                    </button>
                    <p className="w-[400px] text-xl mt-4 text-white">
                        By clicking on Login, I accept the Terms & Conditions & Privacy Policy
                    </p>
                    </div>
                )}
        </div>

  )
}

export default SignInPage