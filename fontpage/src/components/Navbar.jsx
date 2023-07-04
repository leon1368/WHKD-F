import "./Navbar.css";
import { useState } from "react";
import WhkdIcon from "./icon/whkdIcon";
const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <div className="Navbar">
      <div className="nav">
        <div className="nav-icon">
          <button className="mobile-menu" onClick={handleShowMenu}>
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              aria-label="menu icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              role="img"
            >
              <path d="M3 18H21V19.5H3zM3 13.5H21V15H3zM3 9H21V10.5H3zM3 4.5H21V6H3z"></path>
            </svg>
          </button>
          <p className="nav-icon-t">
            <WhkdIcon />
          </p>
        </div>
        <div className="nav-in">
          <a href="#LINKFAQ" className="navss n1">
            FAQ
          </a>
          <a href="#" className="navss n3">
            Docs
          </a>
          <a href="#" className="navss n3">
            Community
          </a>

          <div className="nav-wallet">
            <button className="connect-btn">
              <p className="connect-btn-t1">Launch</p>
              <p className="connect-btn-t2">App</p>
            </button>
          </div>
        </div>
      </div>
      {showMenu && (
        <div>
          <div className="mobile-menu-list ">
            <a className="mobile-menu-link" href="">
              FAQ
            </a>

            <a className="mobile-menu-link" href="">
              Docs
            </a>

            <a className="mobile-menu-link" href="">
              Twitter
            </a>

            <a className="mobile-menu-link" href="">
              Discord
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
