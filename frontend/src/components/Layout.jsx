import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Smartphone, 
  History, 
  User, 
  CreditCard,
  Tv,
  Zap
} from "lucide-react";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = true }) => {
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home
    },
    {
      name: 'Mobile Recharge',
      path: '/recharge?type=mobile',
      icon: Smartphone
    },
    {
      name: 'DTH Recharge',
      path: '/recharge?type=dth',
      icon: Tv
    },
    {
      name: 'Bill Payments',
      path: '/recharge?type=electricity',
      icon: Zap
    },
    {
      name: 'Browse Plans',
      path: '/plans',
      icon: CreditCard
    },
    {
      name: 'Transaction History',
      path: '/history',
      icon: History
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    const basePath = path.split('?')[0];
    const currentPath = location.pathname;
    
    if (basePath === '/recharge') {
      if (currentPath !== '/recharge') return false;
      const urlParams = new URLSearchParams(location.search);
      const pathParams = new URLSearchParams(path.split('?')[1] || '');
      return urlParams.get('type') === pathParams.get('type');
    }
    
    return currentPath === basePath;
  };

  const toggleMobileSidebar = () => {
    console.log('Toggle sidebar called, current state:', isMobileSidebarOpen);
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <nav className={`space-y-1 ${isMobile ? 'p-4' : 'p-4'}`}>
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={isMobile ? closeMobileSidebar : undefined}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content hover:bg-base-300 hover:scale-[1.02]'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar 
        toggleSidebar={toggleMobileSidebar} 
        isSidebarOpen={isMobileSidebarOpen} 
      />
      
      <div className="flex relative">
        {/* Desktop Sidebar */}
        {showSidebar && (
          <div className="hidden lg:block w-64 bg-base-200/30 backdrop-blur-sm min-h-[calc(100vh-4rem)] border-r border-base-300/50">
            <SidebarContent />
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          console.log('Rendering mobile sidebar') ||
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileSidebar}
            />
            
            {/* Mobile Sidebar */}
            <div className="fixed top-16 left-0 w-80 max-w-[85vw] h-[calc(100vh-4rem)] bg-base-200 border-r border-base-300 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
              <div className="h-full overflow-y-auto">
                <SidebarContent isMobile={true} />
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-base-100 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;