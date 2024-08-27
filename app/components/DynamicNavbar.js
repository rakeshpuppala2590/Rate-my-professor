"use client";

import { useState } from 'react';
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function DynamicNavbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = pathname === '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 ${isHomePage ? '' : 'bg-black bg-opacity-30 backdrop-blur-md'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/professor">
          <motion.div 
            className={`text-2xl font-bold ${isHomePage ? 'text-indigo-800' : 'text-white'}  cursor-pointer`}
            whileHover={{ scale: 1.1 }}
          >
            ProfScore
          </motion.div>
        </Link>
        
        {isSignedIn ? (
          <>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink href="/professor">Home</NavLink>
              <NavLink href="/search-professors">Professors</NavLink>
              <NavLink href="/team">Team</NavLink>
              <UserButton />
            </div>
            <div className="md:hidden flex items-center space-x-4">
              <UserButton />
              <motion.button 
                className="text-white bg-indigo-600 p-2 rounded-md"
                onClick={toggleMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </>
        ) : (
          <SignInButton>
            <motion.button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </SignInButton>
        )}
      </div>

      <AnimatePresence>
        {isSignedIn && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white bg-opacity-10 backdrop-blur-md"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <NavLink href="/professor" onClick={toggleMenu}>Home</NavLink>
              <NavLink href="/search-professors" onClick={toggleMenu}>Professors</NavLink>
              <NavLink href="/team" onClick={toggleMenu}>Team</NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }) {
    return (
      <Link href={href} passHref>
        {/* Change motion.a to motion.div and avoid nested <a> */}
        <motion.div
          className="text-white hover:text-indigo-300 transition duration-300 cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          {children}
        </motion.div>
      </Link>
    );
  }