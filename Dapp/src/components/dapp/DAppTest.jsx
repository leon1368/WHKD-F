import _USDT_ABI from "./ABI/USDT_ABI.json";
import _USDC_ABI from "./ABI/USDC_ABI.json";
import _WHKD_ABI from "./ABI/WHKD_ABI.json";
import _Exchange_ABI from "./ABI/Exchange_ABI.json";
import React, { useEffect, useContext } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import {
  useAccount,
  useBalance,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useNetwork } from "wagmi";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
const DappTest = () => {
  const [isSwicth, setIsSwicth] = useState(false);
  const [selectedUSD, setSelectedUSD] = useState("USDT");

  const [usdValue, setusdValue] = useState(0);
  const [whkdValue, setWhkdValue] = useState(0);

  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState(false);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const USDT_ABI = _USDT_ABI;
  const USDC_ABI = _USDC_ABI;
  const WHKD_ABI = _WHKD_ABI;
  const Exchange_ABI = _Exchange_ABI;
  const USDT_Address = "0x6fe8505202120Dd55060A9E920e015A07B524D60";
  const USDC_Address = "0x6fe8505202120Dd55060A9E920e015A07B524D60";
  const WHKD_Address = "0xdab5bBA67fa6cba2cCC00Cc477749a1284b48Ae9";
  const Exchange_Address = "0x2FF245b14EF0fe1bd9BF6961aF8A5DB56ea775d1";
  // 读 余额 、 授权额
  //usdt余额
  const { data: _usdtBal, isError: _usdtErr } = useBalance({
    address: address,
    token: USDT_Address,
    watch: true,
  });

  //usdc余额
  const { data: _usdcBal, isError: _usdcErr } = useBalance({
    address: address,
    token: USDC_Address,
    watch: true,
  });

  //whkd余额
  const { data: _whkdBal, isError: _whkdErr } = useBalance({
    address: address,
    token: WHKD_Address,
    watch: true,
  });

  //usdt allowance
  const { data: _usdtAllowance, isError: _usdtAllowanceError } =
    useContractRead({
      address: USDT_Address,
      abi: USDT_ABI,
      functionName: "allowance",
      args: [address, Exchange_Address],
      watch: true,
    });

  //usdc allowance
  const { data: _usdcAllowance, isError: _usdcAllowanceError } =
    useContractRead({
      address: USDC_Address,
      abi: USDC_ABI,
      functionName: "allowance",
      args: [address, Exchange_Address],
      watch: true,
    });
  //写（准备）
  const { config: USDT_Approve_reset0_config } = usePrepareContractWrite({
    address: USDT_Address,
    abi: USDT_ABI,
    functionName: "approve",
    args: [Exchange_Address, "0"],
  });

  //USDT_Approve_set_inputUSDValue
  const { config: USDT_Approve_set_inputUSDValue_config } =
    usePrepareContractWrite({
      address: USDT_Address,
      abi: USDT_ABI,
      functionName: "approve",
      args: [
        Exchange_Address,
        ethers.utils.parseUnits(usdValue.toString(), 6).toBigInt(),
      ],
    });

  //USDC_Approve_set_inputUSDValue
  const { config: USDC_Approve_set_inputUSDValue_config } =
    usePrepareContractWrite({
      address: USDC_Address,
      abi: USDC_ABI,
      functionName: "approve",
      args: [
        Exchange_Address,
        ethers.utils.parseUnits(usdValue.toString(), 6).toBigInt(),
      ],
    });

  //ExchangeUSDTForHKD
  const { config: ExchangeUSDTForHKD_config } = usePrepareContractWrite({
    address: Exchange_Address,
    abi: Exchange_ABI,
    functionName: "ExchangeUSDTForHKD",
    args: [ethers.utils.parseUnits(usdValue.toString(), 6).toBigInt()],
  });

  //ExchangeUSDCForHKD
  const { config: ExchangeUSDCForHKD_config } = usePrepareContractWrite({
    address: Exchange_Address,
    abi: Exchange_ABI,
    functionName: "ExchangeUSDCForHKD",
    args: [ethers.utils.parseUnits(usdValue.toString(), 6).toBigInt()],
  });

  //ExchangeHKDForUSDT
  const { config: ExchangeHKDForUSDT_config } = usePrepareContractWrite({
    address: Exchange_Address,
    abi: Exchange_ABI,
    functionName: "ExchangeHKDForUSDT",
    args: [ethers.utils.parseUnits(whkdValue.toString(), 18).toBigInt()],
  });

  //ExchangeHKDForUSDC
  const { config: ExchangeHKDForUSDC_config } = usePrepareContractWrite({
    address: Exchange_Address,
    abi: Exchange_ABI,
    functionName: "ExchangeHKDForUSDC",
    args: [ethers.utils.parseUnits(whkdValue.toString(), 18).toBigInt()],
  });
  //合约函数调用表
  const { write: USDT_Approve_reset0 } = useContractWrite(
    USDT_Approve_reset0_config
  );
  const { write: USDT_Approve_set_inputUSDValue } = useContractWrite(
    USDT_Approve_set_inputUSDValue_config
  );
  const { write: USDC_Approve_set_inputUSDValue } = useContractWrite(
    USDC_Approve_set_inputUSDValue_config
  );
  const { write: ExchangeUSDTForHKD } = useContractWrite(
    ExchangeUSDTForHKD_config
  );
  const { write: ExchangeUSDCForHKD } = useContractWrite(
    ExchangeUSDCForHKD_config
  );
  const { write: ExchangeHKDForUSDT } = useContractWrite(
    ExchangeHKDForUSDT_config
  );
  const { write: ExchangeHKDForUSDC } = useContractWrite(
    ExchangeHKDForUSDC_config
  );
  //随时检查余额是否小于要兑换的数字（input的输入）  条件：连接上且在主网
  useEffect(() => {
    const checkIsBalanceInsufficient = () => {
      if (isConnected) {
        //光有isconnect不够！！！！！！！
        if (!isSwicth) {
          if (selectedUSD === "USDT") {
            usdValue <= _usdtBal?.formatted
              ? setIsBalanceInsufficient(false)
              : setIsBalanceInsufficient(true);
            whkdValue / 7.8 <= _usdtBal?.formatted
              ? setIsBalanceInsufficient(false)
              : setIsBalanceInsufficient(true);
          }
          if (selectedUSD === "USDC") {
            usdValue <= _usdcBal?.formatted
              ? setIsBalanceInsufficient(false)
              : setIsBalanceInsufficient(true);
            whkdValue / 7.8 <= _usdcBal?.formatted
              ? setIsBalanceInsufficient(false)
              : setIsBalanceInsufficient(true);
          }
        }
        if (isSwicth) {
          whkdValue <= _whkdBal?.formatted
            ? setIsBalanceInsufficient(false)
            : setIsBalanceInsufficient(true);

          usdValue * 7.8 <= _whkdBal?.formatted
            ? setIsBalanceInsufficient(false)
            : setIsBalanceInsufficient(true);
        }
      }
    };
    checkIsBalanceInsufficient();
  });

  //exchange 按钮 合约调用--写！
  const handleExchangeToken = async () => {
    // setIsLoading(true);

    console.log(8888);
    if (!isSwicth && !isBalanceInsufficient) {
      const _usdValue = usdValue;
      if (selectedUSD === "USDT") {
        if (
          //ethers.BigNumber.from(bigint) =>  bignumber < bignumber
          ethers.BigNumber.from(_usdtAllowance).lt(
            ethers.utils.parseUnits(_usdValue.toString(), 6)
          )
        ) {
          console.log("no enough allowance");

          //reset _usdtAllowance function
          if (_usdtAllowance != BigInt(0)) {
            console.log("usdtAllowance != 0");
            USDT_Approve_reset0?.();
            console.log("reset usdtAllowance function");
          }

          //set usdtAllowance function
          USDT_Approve_set_inputUSDValue?.();
          console.log("set usdtAllowance function done");
        }
        //ExchangeUSDTForHKD function
        ExchangeUSDTForHKD?.();
        console.log("Exchange function done");
      }
      if (selectedUSD === "USDC") {
        if (
          //bigint < bignumber
          ethers.BigNumber.from(_usdcAllowance).lt(
            ethers.utils.parseUnits(_usdValue.toString(), 6)
          )
        ) {
          USDC_Approve_set_inputUSDValue?.();
        }
        ExchangeUSDCForHKD?.();
      }
    } else if (isSwicth && !isBalanceInsufficient) {
      const _whkdValue = whkdValue;
      if (selectedUSD === "USDT") {
        ExchangeHKDForUSDT?.();
        console.log("whkd ExchangeHKDForUSDT done");
      }
      if (selectedUSD === "USDC") {
        ExchangeHKDForUSDC?.();
        console.log("whkd ExchangeHKDForUSDC done");
      }
    }

    // setIsLoading(false);
  };
  // ↓ 按钮 ，切换，并给出usd在上 ，还是whkd在上
  const handleSwicth = () => {
    setIsSwicth(!isSwicth);
    setusdValue(0);
    setWhkdValue(0);
  };
  //usd input值 变动
  //INPUT CHANGE
  const handleUsdChanged = async (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      value = 0;
    }
    if (value <= 1) {
      value = 1;
    }
    value = parseFloat(value.toFixed(6)); // 保留小数点后6位并进行四舍五入
    setusdValue(value);
    setWhkdValue((parseFloat(value) * 7.8).toFixed(2)); //有0去0，多0最多6位
    console.log(value);
    // // check Swicth or not
    // console.log(isSwicth); //usd在上false
  };
  //whkd input值 变动
  //INPUT CHANGE
  const handleWhkdChanged = (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) {
      value = 0;
    }
    if (value <= 1) {
      value = 1;
    }
    value = parseFloat(value.toFixed(6)); // 保留小数点后6位并进行四舍五入
    setWhkdValue(value);
    setusdValue((parseFloat(value) / 7.8).toFixed(2));
    console.log(value);
  };
  const handleUSDSelected = (e) => {
    const selectedValue = e.target.value;
    setSelectedUSD(selectedValue);
    console.log(selectedValue);
  };
  return (
    <div>
      <h1>usdtBalance: {_usdtBal?.formatted}</h1>
      <h1>usdcBalance: {_usdcBal?.formatted}</h1>
      <h1>whkdBalance: {_whkdBal?.formatted}</h1>
      <h1>usdtAllowance: {Number(_usdtAllowance)}</h1>
      <h1>usdtAllowance: {Number(_usdcAllowance)}</h1>
      <div
        className="dapp"
        // style={{ background: `url(${image})`, backgroundSize: "cover" }}
      >
        <div className="Main-App">
          <div className="Exhchange-title">Exchange</div>
          {isSwicth ? (
            <div className="exhange-input-con WHKD-input">
              <div>
                <input
                  className="input-amont"
                  type="number"
                  value={whkdValue}
                  onChange={handleWhkdChanged}
                  title="WHKD Amount"
                  placeholder="0"
                />
                <p>$0.1282</p>
              </div>
              <div className="dropdown-con-WHKD">
                <div className="dropdown">
                  <img
                    className="USD-icon"
                    src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                    alt="USDT-icon"
                  />
                  <select className="dropdown-select-USD">
                    <option className="usd-option" value="WHKD">
                      WHKD
                    </option>
                  </select>
                </div>
                <div className="balance-get">
                  Balance : {_whkdBal?.formatted}
                </div>
              </div>
            </div>
          ) : (
            <div className="exhange-input-con USD-input">
              <div>
                <input
                  className="input-amont"
                  type="number"
                  value={usdValue}
                  onChange={handleUsdChanged}
                  title="USDT Amount"
                  placeholder="0"
                />
                <div>$1</div>
              </div>
              <div className="dropdown-con">
                <div className="dropdown">
                  {selectedUSD === "USDT" && (
                    <img
                      className="USD-icon"
                      src="	https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                      alt="USDT-icon"
                    />
                  )}
                  {selectedUSD === "USDC" && (
                    <img
                      className="USD-icon"
                      src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                      alt="USDC-icon"
                    />
                  )}
                  <select
                    className="dropdown-select-USD"
                    value={selectedUSD}
                    onChange={handleUSDSelected}
                  >
                    <option className="usd-option" value="USDT">
                      USDT
                    </option>
                    <option className="usd-option" value="USDC">
                      USDC
                    </option>
                  </select>
                </div>
                {selectedUSD === "USDT" && (
                  <div className="balance-get">
                    Balance : {_usdtBal?.formatted}
                  </div>
                )}
                {selectedUSD === "USDC" && (
                  <div className="balance-get">
                    Balance : {_usdcBal?.formatted}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="change-conter">
            <div className="Change-direction-button-container">
              <button
                className="Change-direction-exchange"
                onClick={handleSwicth}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0D111C"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {isSwicth ? (
            <div className="exhange-input-con USD-input">
              <div>
                <input
                  className="input-amont"
                  type="number"
                  value={usdValue}
                  onChange={handleUsdChanged}
                  title="USDT Amount"
                  placeholder="0"
                />
                <div>$1</div>
              </div>
              <div className="dropdown-con">
                <div className="dropdown">
                  {selectedUSD === "USDT" && (
                    <img
                      className="USD-icon"
                      src="	https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                      alt="USDT-icon"
                    />
                  )}
                  {selectedUSD === "USDC" && (
                    <img
                      className="USD-icon"
                      src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                      alt="USDC-icon"
                    />
                  )}
                  <select
                    className="dropdown-select-USD"
                    value={selectedUSD}
                    onChange={handleUSDSelected}
                  >
                    <option className="usd-option" value="USDT">
                      USDT
                    </option>
                    <option className="usd-option" value="USDC">
                      USDC
                    </option>
                  </select>
                </div>
                {selectedUSD === "USDT" && (
                  <div className="balance-get">
                    Balance : {_usdtBal?.formatted}
                  </div>
                )}
                {selectedUSD === "USDC" && (
                  <div className="balance-get">
                    Balance : {_usdcBal?.formatted}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="exhange-input-con WHKD-input">
              <div>
                <input
                  className="input-amont"
                  type="number"
                  value={whkdValue}
                  onChange={handleWhkdChanged}
                  title="WHKD Amount"
                  placeholder="0"
                />
                <p>$0.1282</p>
              </div>

              {/* <div className="dropdown-select-WHKD">WHKD</div> */}
              <div className="dropdown-con">
                <div className="dropdown">
                  <img
                    className="USD-icon"
                    src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                    alt="USDT-icon"
                  />
                  <select className="dropdown-select-USD">
                    <option className="usd-option" value="WHKD">
                      WHKD
                    </option>
                  </select>
                </div>
                <div className="balance-get">
                  Balance : {_whkdBal?.formatted}
                </div>
              </div>
            </div>
          )}

          {!isSwicth ? (
            <div className="exchange-rate">1 USD = 7.8 WHKD</div>
          ) : (
            <div className="exchange-rate">1 WHKD = 0.1282 USD</div>
          )}
          {/* <div className="exchange-rate">
      Gas fee =<p></p>
    </div> */}

          <div className="nav-wallet">
            {!isConnected ? (
              <div className="Dapp-Exchange-btn">
                <web3modal />
              </div>
            ) : (
              <span className="exchange-bt-con">
                {chain.name != "Sepolia" ? (
                  <div className="Dapp-Switch-Network-Balance-btn">
                    <Web3NetworkSwitch />
                  </div>
                ) : (
                  <div>
                    {usdValue > 0 && whkdValue > 0 && isBalanceInsufficient && (
                      <button className="Dapp-Insufficient-Balance-btn">
                        Insufficient Balance
                      </button>
                    )}

                    {(usdValue == 0 || whkdValue == 0) && (
                      <div>
                        <button className="Dapp-Insufficient-Balance-btn">
                          <p>Enter an amount</p>
                        </button>
                      </div>
                    )}

                    {usdValue > 0 &&
                      whkdValue > 0 &&
                      !isBalanceInsufficient && (
                        <div>
                          <button
                            className="Dapp-Exchange-btn"
                            onClick={handleExchangeToken}
                          >
                            <p>Exchange</p>
                            {/* <div className="Loader-con-">
                              {isLoading && <Loader />}
                            </div> */}
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DappTest;
