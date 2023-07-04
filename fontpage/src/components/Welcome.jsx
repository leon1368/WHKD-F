import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="introduce-big">
      <div className="br-contianer">
        <p className="br1">
          <strong class="sign10">Meet </strong>Wrapped HKD
        </p>
        <p className="br2">the first Hong Kong dollar stablecoin</p>
        <p className="br2-2">Backed 1:7.8 with USD stablecoins.</p>
        <p className="br3">
          <a href="#" className="introduce-btn1">
            <p className="introduce-text">Get</p>
            <p className="introduce-text">WHKD</p>
          </a>

          <a
            href="https://wrapped-hkd-document.gitbook.io/wrapped-hkd-docs/"
            className="introduce-btn2 navss n1"
            target="_blank"
          >
            <p className="introduce-text">Learn</p>
            <p className="introduce-text">more</p>
          </a>
        </p>
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
    </div>
  );
};
export default Welcome;
