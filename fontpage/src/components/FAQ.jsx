import React, { useState } from "react";
import "./FAQ.css";

const FAQ = () => {
  const [showAnswer_1, setShowAnswer_1] = useState(false);
  const [showAnswer_2, setShowAnswer_2] = useState(false);
  const [showAnswer_3, setShowAnswer_3] = useState(false);
  const [showAnswer_4, setShowAnswer_4] = useState(false);

  return (
    <div className="article">
      <div className="faq-FAQ">FAQ</div>

      <div className="faq-con-con">
        <div className="faq-item">
          <div className="faq-title">
            <p>What is Wrapped HKD?</p>
            <button
              className="question-btn"
              onClick={() => setShowAnswer_1(!showAnswer_1)}
            >
              {showAnswer_1 ? "+" : "+"}
            </button>
          </div>

          {showAnswer_1 && (
            <p>
              Wrapped HKD (WHKD) is a decentralized Hong Kong dollar stablecoin
              that allows you to exchange USD stablecoins such as USDT, USDC,
              etc. for WHKD at a fixed exchange rate of 1:7.8. The exchange of
              WHKD is interchangeable, meaning you can exchange 1 USD stablecoin
              for 7.8 WHKD, or 7.8 WHKD for 1 USD stablecoin, and this exchange
              rate is locked by a smart contract that no one can interfere with
              or manage.
              <br />
              <br />
              The exchange is completely free, and you can exchange WHKD or USD
              stablecoins on #this app#.
            </p>
          )}
        </div>
        <div className="faq-item">
          <div className="faq-title">
            <p>What's the motivation behind WHKD?</p>
            <button
              className="question-btn"
              onClick={() => setShowAnswer_2(!showAnswer_2)}
            >
              {showAnswer_2 ? "+" : "+"}
            </button>
          </div>
          {showAnswer_2 && (
            <p>
              Today, the market capitalization of all stablecoins on the
              blockchain has reached billions of dollars, with the US dollar
              dominating as the main currency, and other currencies such as the
              euro, yen, and yuan also represented. <br />
              <br />
              However, a stablecoin pegged to the Hong Kong dollar has yet to
              emerge, despite the fact that the Hong Kong dollar operates on a
              similar mechanism as most stablecoins on the market and has been
              running stable for decades. This absence of a Hong Kong dollar
              stablecoin has caused inconvenience for many users in the
              Asia-Pacific region. Finally, the introduction of the WHKD
              stablecoin marks a new era and fills this gap in the market.
            </p>
          )}
        </div>
        <div className="faq-item">
          <div className="faq-title">
            <p>What are the key benefits of WHKD?</p>
            <button
              className="question-btn"
              onClick={() => setShowAnswer_3(!showAnswer_3)}
            >
              {showAnswer_3 ? "+" : "+"}
            </button>
          </div>
          {showAnswer_3 && (
            <p>
              WHKD's key benefits include:
              <br />
              <br />
              - Free exchange - Users can exchange USD stablecoins and WHKD
              stablecoins for free at a 1:7.8 exchange rate. <br />
              <br />
              - Price stability - With the stability of multiple well-performing
              USD stablecoins, WHKD can easily maintain price stability.
              <br />
              <br />
              - Flexible exchange - Users can easily exchange between USDT,
              USDC, and other stablecoins using WHKD. <br />
              <br />
              - Fully decentralized - All USD assets can be queried on the
              blockchain, without any blacklists or censorship.
              <br />
              <br />
            </p>
          )}
        </div>
        <div className="faq-item">
          <div className="faq-title">
            <p>What are the main use cases of WHKD?</p>
            <button
              className="question-btn"
              onClick={() => setShowAnswer_4(!showAnswer_4)}
            >
              {showAnswer_4 ? "+" : "+"}
            </button>
          </div>
          {showAnswer_4 && (
            <p>
              1. Deposit USD stablecoins and exchange for WHKD. <br />
              <br />
              2. Deposit WHKD and exchange for USD stablecoins. <br />
              <br />
              3. When the price on exchanges (such as Uniswap) deviates from 1
              HKD (1 / 7.8≈0.1282 dollar), use flash loans to arbitrage the
              exchange pool.
              <br />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default FAQ;
