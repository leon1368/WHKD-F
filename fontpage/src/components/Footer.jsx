import "./Footer.css";
import WhkdIcon from "./icon/whkdIcon";
const Footer = () => {
  return (
    <div className="footer">
      <div
        className="footer-title
      "
      >
        <WhkdIcon />
      </div>
      <div className="log-link-con">
        <div>
          <a href="https://twitter.com/Wrapped_HKD">
            <img
              className="img-link"
              src="https://uploads-ssl.webflow.com/5fd883457ba5da4c3822b02c/5fd9eedf4c5cffbc8023f94a_twitter%20(2).svg"
              alt=""
            />
          </a>
        </div>
        <div>
          <a href="https://discord.gg/CFXQFcVEpn">
            <img
              className="img-link"
              src="https://uploads-ssl.webflow.com/5fd883457ba5da4c3822b02c/5fd9eee05e0e2306c96280f2_discord%20(1).svg"
              alt=""
            />
          </a>
        </div>
        <div>
          <a href="https://t.me/Wrapped_HKD_Official_channel">
            <img
              className="img-link"
              src="https://uploads-ssl.webflow.com/5fd883457ba5da4c3822b02c/610d269440aaf73f3df9f0ff_telegram-1.svg"
              alt=""
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default Footer;
