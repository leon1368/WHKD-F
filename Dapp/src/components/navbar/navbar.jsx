import style from "./navbatStyle.module.css";
import MobileMenuSVG from "../svg/mobileMenuShowSVG";
import MobileMenu from "./mobileMenu/mobileMenu";
import WhkdIcon from "../icon/whkdIcon";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useState } from "react";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  //侧边栏（手机）
  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };
  return (
    <>
      <div className={style.Navbar}>
        <div className={style.nav}>
          <div className={style.navIcon}>
            <button className={style.mobileMenuBtg} onClick={handleShowMenu}>
              <MobileMenuSVG />
            </button>

            <WhkdIcon />

            <a
              href="https://wrapped-hkd-document.gitbook.io/wrapped-hkd-docs/"
              className={style.n2}
              target="_blank"
            >
              Docs
            </a>
          </div>
          <div className={style.navIn}>
            <Web3NetworkSwitch />
            <Web3Button icon="hide" label="Connect Wallet" balance="hide" />
          </div>
        </div>
      </div>
      <MobileMenu showMenu={showMenu} />
    </>
  );
}
export default Navbar;
