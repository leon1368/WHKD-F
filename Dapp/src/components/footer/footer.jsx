import Community3Icon from "../icon/community3Icons";
import WhkdIcon from "../icon/whkdIcon";
import style from "./footerStyle.module.css";
const Footer = () => {
  return (
    <div className={style.footer}>
      <WhkdIcon />
      <Community3Icon />
    </div>
  );
};
export default Footer;
