import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">
      <Outlet />
      
            <footer className="footer-bottom">
        NOVA | Find Your Dream Home
      </footer>
    </div>
  );
}

export default Layout;