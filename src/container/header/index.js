"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import FormTable from "../../container/form";
import { FaBars } from "react-icons/fa";
import { BsBook } from "react-icons/bs";

const Navbar = () => {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = sessionStorage.getItem("role");
      const storedUsername = sessionStorage.getItem("userName");
      setRole(storedRole);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/login");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    if (option === "addBook") {
      setIsFormOpen(true);
    } else if (option === "logout") {
      handleLogout();
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BsBook size={40} className="text-red-500" />
          </div>

          <div className="flex-grow text-center">
            <span className="text-xl font-bold text-red-500">
              Welcome, {username || "Guest"}..!
            </span>
            {role && (
              <div className="text-sm text-white">
                Logged in as{" "}
                <strong>{role === "ADMIN" ? "Admin" : "User"}</strong>
              </div>
            )}
          </div>

          <div className="relative hidden md:flex items-center space-x-4">
            {role === "ADMIN" && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-red-500 border border-red-800 text-white px-4 py-2 hover:bg-red-600 focus:outline-none transition-colors"
              >
                Add Book
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 border border-red-800 text-white px-4 py-2 hover:bg-red-600 focus:outline-none transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button onClick={handleMenuToggle} className="text-white">
              <FaBars size={24} />
            </button>

            {isMenuOpen && (
              <div className="absolute cursor-pointer right-0 border border-orange-300 shadow-lg mt-2 w-36 rounded-md bg-gray-800 z-10">
                {role === "ADMIN" && (
                  <button
                    onClick={() => handleOptionSelect("addBook")}
                    className="block w-full text-left bg-red-500  border border-red-800 text-white px-4 py-2 hover:bg-orange-600 rounded-t-md transition-colors"
                  >
                    Add Book
                  </button>
                )}
                <button
                  onClick={() => handleOptionSelect("logout")}
                  className="block w-full text-left bg-red-500 border border-red-800 text-white px-4 py-2 hover:bg-red-600 rounded-b-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {isFormOpen && <FormTable onClose={() => setIsFormOpen(false)} />}
    </>
  );
};

export default Navbar;
