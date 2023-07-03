const MobileMenu = (props) => {
  return (
    <>
      {props.showMenu && (
        <div>
          <div className="mobile-menu-list ">
            <a className="mobile-menu-link" href="">
              Home
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
    </>
  );
};
export default MobileMenu;
