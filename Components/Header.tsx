import React from 'react';
import Link from "next/link";


function Header() {
  return (
    < header className="flex justify-between p-5 mx-auto">
       <div className="flex items space-x-5 ">
           <Link href="/">
               <img className="w-44 object-contain cursor-pointer" src="https://cheapsslsecurity.com/blog/wp-content/uploads/2015/10/Blogger-Logo.png" alt="" />
            </Link>
            <div className="hidden md:inline-flex items-center space-x-5 ">
                <h3>About</h3>
                <h3>Contact</h3>
                <h3 className="text-white bg-darkorange px-4 py-1 rounded-full  hover:bg-darkblue hover:text-darkorange ">Follow</h3>
            </div>
       </div>
       <div className="flex items-center space-x-5 text-darkblue">
           <h3 className="cursor-pointer hover:font-bold ">
               Sign In
           </h3>
           <h3 className="border px-4 py-1 rounded-full border-darkorange cursor-pointer hover:bg-darkblue hover:text-darkorange hover:border-none">
               Get Started
           </h3>
       </div>
    </header>
  )
}

export default Header