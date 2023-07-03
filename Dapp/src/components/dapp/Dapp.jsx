import { ethers } from "ethers";
import { useState } from "react";
import React, { useEffect, useContext } from "react";
import { useEthersSigner } from "./Ethers.js Adapters/ethers";
import Style from "./Dapp.module.css";

import Loader from "./smallCom/Loader";
import CustomConnectButton from "./smallCom/CustomConnectButton";

import _USDT_ABI from "./ABI/USDT_ABI.json";
import _USDC_ABI from "./ABI/USDC_ABI.json";
import _WHKD_ABI from "./ABI/WHKD_ABI.json";
import _Exchange_ABI from "./ABI/Exchange_ABI.json";

import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";
import { Web3NetworkSwitch } from "@web3modal/react";
//usd、whkd限制小数点6位数
//usdt没有approve覆盖功能，不为0重新设置需要先approve(address,0),再approve(address,amount)
//usdc allowance !== 0 &&  allowance > usdcvalue,无需approve
const Dapp = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const onETHmainnet = chain?.name == "Sepolia";
  const signer = useEthersSigner();

  const [isSwicth, setIsSwicth] = useState(false);

  const [usdValue, setusdValue] = useState(0);
  const [whkdValue, setWhkdValue] = useState(0);
  const [selectedUSD, setSelectedUSD] = useState("USDT");

  const [isBalanceInsufficient, setIsBalanceInsufficient] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  //error
  //catch error
  const [error, setError] = useState(false); /* New */
  const [errorMessage, setErrorMessage] = useState(""); /* New */

  const USDT_ABI = _USDT_ABI;
  const USDC_ABI = _USDC_ABI;

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
    try {
      setIsLoading(true);

      const USDT = new ethers.Contract(USDT_Address, USDT_ABI, signer);
      const USDC = new ethers.Contract(USDC_Address, USDC_ABI, signer);

      const Exchange = new ethers.Contract(
        Exchange_Address,
        Exchange_ABI,
        signer
      );
      const a = ethers.BigNumber.from("120");
      const b = ethers.BigNumber.from("100");
      const calculateGas = (gas) => {
        return gas.mul(a).div(b);
      };
      if (!isSwicth && !isBalanceInsufficient) {
        if (selectedUSD === "USDT") {
          const _usdValue = usdValue;
          if (
            _usdtAllowance < ethers.utils.parseUnits(_usdValue.toString(), 6)
          ) {
            console.log("no enough allowance");

            //reset usdtAllowance function
            if (_usdtAllowance != 0) {
              const gasLimit_USDT_approve_0 = await USDT.estimateGas.approve(
                Exchange_Address,
                "0"
              );
              console.log("usdtAllowance != 0");
              await (
                await USDT.approve(Exchange_Address, 0, {
                  gasLimit: calculateGas(gasLimit_USDT_approve_0),
                })
              ).wait();
              console.log("reset usdtAllowance function");
            }

            //set usdtAllowance function
            const gasLimit_USDT_approve_amout = await USDT.estimateGas.approve(
              Exchange_Address,
              ethers.utils.parseUnits(_usdValue.toString(), 6)
            );
            await (
              await USDT.approve(
                Exchange_Address,
                ethers.utils.parseUnits(_usdValue.toString(), 6),
                {
                  gasLimit: calculateGas(gasLimit_USDT_approve_amout),
                  // gasLimit: 3000000,
                }
              )
            ).wait();
            console.log("set usdtAllowance function done");
          }
          //Exchange function
          const gasLimit_Exchange =
            await Exchange.estimateGas.ExchangeUSDTForHKD(
              ethers.utils.parseUnits(_usdValue.toString(), 6)
            );

          const wait_Exchange = await Exchange.ExchangeUSDTForHKD(
            ethers.utils.parseUnits(_usdValue.toString(), 6),
            {
              gasLimit: calculateGas(gasLimit_Exchange),
            }
          );
          await wait_Exchange.wait();
          console.log("Exchange function done");
        } else if (selectedUSD === "USDC") {
          const _usdValue = usdValue;
          if (
            _usdcAllowance < ethers.utils.parseUnits(_usdValue.toString(), 6)
          ) {
            const gasLimit_USDC_approve_amout = await USDC.estimateGas.approve(
              Exchange_Address,
              ethers.utils.parseUnits(usdValue.toString(), 6)
            );

            const usdcApproveWait = await USDC.approve(
              Exchange_Address,
              ethers.utils.parseUnits(usdValue.toString(), 6),
              {
                gasLimit: calculateGas(gasLimit_USDC_approve_amout),
              }
            );
            await usdcApproveWait.wait();
          }
          const gasLimit_Exchange =
            await Exchange.estimateGas.ExchangeUSDCForHKD(
              ethers.utils.parseUnits(usdValue.toString(), 6)
            );
          const wait_Exchange = await Exchange.ExchangeUSDCForHKD(
            ethers.utils.parseUnits(usdValue.toString(), 6),
            {
              gasLimit: calculateGas(gasLimit_Exchange),
            }
          );
          await wait_Exchange.wait();
        }
      } else if (isSwicth && !isBalanceInsufficient) {
        if (selectedUSD === "USDT") {
          const _whkdValue = whkdValue;

          const gasLimit_Exchange =
            await Exchange.estimateGas.ExchangeHKDForUSDT(
              ethers.utils.parseUnits(_whkdValue.toString(), 18)
            );
          const wait_Exchange = await Exchange.ExchangeHKDForUSDT(
            ethers.utils.parseUnits(_whkdValue.toString(), 18),
            {
              gasLimit: calculateGas(gasLimit_Exchange),
            }
          );
          await wait_Exchange.wait();
          console.log("whkd ExchangeHKDForUSDT done");
        } else if (selectedUSD === "USDC") {
          const _whkdValue = whkdValue;

          const gasLimit_Exchange =
            await Exchange.estimateGas.ExchangeHKDForUSDC(
              ethers.utils.parseUnits(_whkdValue.toString(), 18)
            );
          const wait_Exchange = await Exchange.ExchangeHKDForUSDC(
            ethers.utils.parseUnits(_whkdValue.toString(), 18),
            {
              gasLimit: calculateGas(gasLimit_Exchange),
            }
          );
          await wait_Exchange.wait();
          console.log("whkd ExchangeHKDForUSDC done");
        }
      }

      setIsLoading(false);
      setError(false); /* New */
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      setError(true); /* New */
      const errorMessage = err.message;
      const specificErrorMessage = errorMessage.replace(/\(.*?\)/g, "");
      setErrorMessage(specificErrorMessage);
    }
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
    <div className={Style.dapp}>
      <div className={Style.MainApp}>
        <div className={Style.Exhchange_title}>Exchange</div>
        {isSwicth ? (
          <div className={Style.exhange_input_con}>
            <div>
              <input
                className={Style.input_amont}
                type="number"
                value={whkdValue}
                onChange={handleWhkdChanged}
                title="WHKD Amount"
                placeholder="0"
              />
              <div className={Style.defualt_price}>$0.1282</div>
            </div>
            <div className={Style.dropdown_con}>
              <div className={Style.dropdown}>
                <img
                  className={Style.USD_icon}
                  src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                  alt="USDT-icon"
                />
                <select className={Style.dropdown_select_USD}>
                  <option className={Style.usd_option} value="WHKD">
                    WHKD
                  </option>
                </select>
              </div>
              <div className={Style.balance_get}>
                Balance : {_whkdBal?.formatted}
              </div>
            </div>
          </div>
        ) : (
          <div className={Style.exhange_input_con}>
            <div>
              <input
                className={Style.input_amont}
                type="number"
                value={usdValue}
                onChange={handleUsdChanged}
                title="USDT Amount"
                placeholder="0"
              />
              <div className={Style.defualt_price}>$1</div>
            </div>
            <div className={Style.dropdown_con}>
              <div className={Style.dropdown}>
                {selectedUSD === "USDT" && (
                  <img
                    className={Style.USD_icon}
                    src="	https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                    alt="USDT-icon"
                  />
                )}
                {selectedUSD === "USDC" && (
                  <img
                    className={Style.USD_icon}
                    src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                    alt="USDC-icon"
                  />
                )}
                <select
                  className={Style.dropdown_select_USD}
                  value={selectedUSD}
                  onChange={handleUSDSelected}
                >
                  <option className={Style.usd_option} value="USDT">
                    USDT
                  </option>
                  <option className={Style.usd_option} value="USDC">
                    USDC
                  </option>
                </select>
              </div>
              {selectedUSD === "USDT" && (
                <div className={Style.balance_get}>
                  Balance : {_usdtBal?.formatted}
                </div>
              )}
              {selectedUSD === "USDC" && (
                <div className={Style.balance_get}>
                  Balance : {_usdcBal?.formatted}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={Style.change_conter}>
          <div className={Style.Change_direction_button_container}>
            <button
              className={Style.Change_direction_exchange}
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
          <div className={Style.exhange_input_con}>
            <div>
              <input
                className={Style.input_amont}
                type="number"
                value={usdValue}
                onChange={handleUsdChanged}
                title="USDT Amount"
                placeholder="0"
              />
              <div className={Style.defualt_price}>$1</div>
            </div>
            <div className={Style.dropdown_con}>
              <div className={Style.dropdown}>
                {selectedUSD === "USDT" && (
                  <img
                    className={Style.USD_icon}
                    src="	https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xdac17f958d2ee523a2206206994597c13d831ec7.png"
                    alt="USDT-icon"
                  />
                )}
                {selectedUSD === "USDC" && (
                  <img
                    className={Style.USD_icon}
                    src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png"
                    alt="USDC-icon"
                  />
                )}
                <select
                  className={Style.dropdown_select_USD}
                  value={selectedUSD}
                  onChange={handleUSDSelected}
                >
                  <option className={Style.usd_option} value="USDT">
                    USDT
                  </option>
                  <option className={Style.usd_option} value="USDC">
                    USDC
                  </option>
                </select>
              </div>
              {selectedUSD === "USDT" && (
                <div className={Style.balance_get}>
                  Balance : {_usdtBal?.formatted}
                </div>
              )}
              {selectedUSD === "USDC" && (
                <div className={Style.balance_get}>
                  Balance : {_usdcBal?.formatted}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={Style.exhange_input_con}>
            <div>
              <input
                className={Style.input_amont}
                type="number"
                value={whkdValue}
                onChange={handleWhkdChanged}
                title="WHKD Amount"
                placeholder="0"
              />
              <div className={Style.defualt_price}>$0.1282</div>
            </div>

            <div className={Style.dropdown_con}>
              <div className={Style.dropdown}>
                <img
                  className={Style.USD_icon}
                  src="https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png"
                  alt="USDT-icon"
                />
                <select className={Style.dropdown_select_USD}>
                  <option className={Style.usd_option} value="WHKD">
                    WHKD
                  </option>
                </select>
              </div>
              <div className={Style.balance_get}>
                Balance : {_whkdBal?.formatted}
              </div>
            </div>
          </div>
        )}

        {!isSwicth ? (
          <div className={Style.exchange_rate}>1 USD = 7.8 WHKD</div>
        ) : (
          <div className={Style.exchange_rate}>1 WHKD = 0.1282 USD</div>
        )}
        {/* <div className="exchange-rate">
            Gas fee =<p></p>
          </div> */}

        <div className={Style.nav_wallet}>
          {!isConnected ? (
            <CustomConnectButton />
          ) : (
            <span className={Style.exchange_bt_con}>
              {!onETHmainnet ? (
                <div className={Style.Dapp_Insufficient_Balance_btn}>
                  Wrong Network
                </div>
              ) : (
                <div>
                  {usdValue > 0 && whkdValue > 0 && isBalanceInsufficient && (
                    <div className={Style.Dapp_Insufficient_Balance_btn}>
                      Insufficient Balance
                    </div>
                  )}

                  {(usdValue == 0 || whkdValue == 0) && (
                    <div>
                      <div className={Style.Dapp_Insufficient_Balance_btn}>
                        Enter an amount
                      </div>
                    </div>
                  )}

                  {usdValue > 0 && whkdValue > 0 && !isBalanceInsufficient && (
                    <div>
                      <button
                        className={Style.Dapp_Exchange_btn}
                        onClick={handleExchangeToken}
                      >
                        <>Exchange</>
                        {isLoading && <Loader />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </span>
          )}
        </div>
        {error /* New code block */ && (
          <div className={Style.error_space} onClick={() => setError(false)}>
            <div>
              <strong>Error:</strong> {errorMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Dapp;
