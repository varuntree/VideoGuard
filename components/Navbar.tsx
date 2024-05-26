import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="navbar bg-base-100 top-0 fixed z-50"> 
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              onClick={closeDropdown}
            >
              <li>
                <Link href='/upload' className="py-5">New Project</Link>
              </li>
              <li>
                <Link href="/edit" className="py-5">Edit or Upload</Link>
              </li>
            </ul>
          )}
        </div>
        <Link href="/dashboard" className="btn btn-ghost text-3xl">VideoGuard</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/upload" className="btn  btn-outline mx-5">New Project</Link>
          </li>
          <li>
            <Link href="/edit"  className="btn btn-ghost bg-youtube-red text-white btn-outline mx-5">Edit or Upload</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button onClick={()=>signOut({ callbackUrl: "/" })} className="btn btn-link">SignOut</button>
      </div>
    </div>
  );
}
