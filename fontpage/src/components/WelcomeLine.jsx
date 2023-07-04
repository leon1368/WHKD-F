import "./WelcomeLine.css";
const WelcomeLine = () => {
  return (
    <div className="introduce-nav-line">
      <a name="LINKFAQ"></a>
      <div className="introduce-nav-line-son">
        <div className="nav-t">1 : 7.8 fixed</div>
        <div className="nav-art">
          Using USDT or USDC to exchange WHKD at a fixed ratio of 1 : 7.8,
          maintain the stability of WHKD's price by the stability of the USD
          stablecoins.
        </div>
      </div>

      <div className="introduce-nav-line-son">
        <div className="nav-t">0 Fees</div>
        <div className="nav-art">
          We do not charge any fees for exchange, ensuring absolute
          free-of-charge service for our users, without any need for payment.
        </div>
      </div>

      <div className="introduce-nav-line-son">
        <div className="nav-t">USD stablecoins exchange</div>
        <div className="nav-art">
          By default, all USD stablecoins are treated as 1 dollar.You can easily
          exchange other USD stablecoins with WHKD to complete arbitrage.
        </div>
      </div>
    </div>
  );
};
export default WelcomeLine;
