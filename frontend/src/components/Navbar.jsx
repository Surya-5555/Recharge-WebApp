import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, WalletIcon, Menu, X } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const { logoutMutation, isPending } = useLogout();

  return (
    <nav className="bg-base-200/80 backdrop-blur-sm border-b border-base-300 sticky top-0 z-40 h-16 flex items-center">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between w-full">
          {/* LEFT SIDE - Burger Menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              className="btn btn-ghost btn-circle lg:hidden"
              onClick={() => {
                console.log('Burger menu clicked');
                toggleSidebar();
              }}
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5 text-base-content" />
              ) : (
                <Menu className="h-5 w-5 text-base-content" />
              )}
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <WalletIcon className="size-7 text-primary" />
              <span className="text-xl sm:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Recharge
              </span>
            </Link>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications */}
            <Link to="/profile">
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-base-300">
                <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 text-base-content" />
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <Link to="/profile">
              <div className="avatar hover:scale-105 transition-transform">
                <div className="w-8 sm:w-9 rounded-full ring-2 ring-primary/20">
                  <img src={authUser?.profilePic} alt="User Avatar" />
                </div>
              </div>
            </Link>

            {/* Logout button */}
            <button 
              className="btn btn-ghost btn-circle btn-sm sm:btn-md hover:bg-error/10 hover:text-error" 
              onClick={() => logoutMutation()}
              disabled={isPending}
              title="Logout"
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
              ) : (
                <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;