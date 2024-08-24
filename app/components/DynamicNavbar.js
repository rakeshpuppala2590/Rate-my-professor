"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DynamicNavbar() {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  const isHomePage = pathname === '/';

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
          <div className="flex items-center space-x-6">
            <NavLink href="/professor">Home</NavLink>
            <NavLink href="/search-professors">Professors</NavLink>
            <NavLink href="/team">Team</NavLink>
            <UserButton />
          </div>
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