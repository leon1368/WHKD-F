import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";
import Dapp from "../components/dapp/Dapp";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import CustomSwitchNetWork from "../components/dapp/smallCom/CustomSwitchNetWork";
import style from "../index.module.css";
export default function HomePage() {
  return (
    <div className={style.all_app_con}>
      {/* Predefined button  */}
      {/* <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br /> */}
      {/* Network Switcher Button */}
      {/* <Web3NetworkSwitch />
      <br /> */}
      {/* <CustomSwitchNetWork /> */}
      {/* Custom button */}
      {/* <CustomButton /> */}
      <Navbar />
      <Dapp />
      <Footer />
    </div>
  );
}
