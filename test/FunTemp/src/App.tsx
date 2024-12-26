import React from "react";
import { FunTempButton } from "./FunTemp";

const App = () => {
  // 按钮点击后返回结果
  const handleButtonClick = (result: {
    [key: string]: string | number;
    flag: string;
  }[]) => {
    console.log("Generated Data:", result);
  };
  const handleButtonClickb = (result: {
    [key: string]: string | number;
    flag: string;
  }[]) => {
    console.log("Generated Data:", result);
  };

  const params = {
    param1: "FT_TRANSFER", // 按钮的文本内容
    param2lab: {
      ft_contract_address: "70d7b6c99f8209a7bc99982df01f169f4054bd9ec3e52f178d54c144886cb3b7",
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      ft_amount: "9986700",
    },
  };
  const paramsvalue = {
    param1: "default value",
    param2lab: {
      "a": "Default A",
      "b": "Default B",
      "c": "Default C",
      "d": ""
    }
  };
  
  const p2pkh_params = {
    param1: "P2PKH",
    param2lab: {
        address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
        satoshis: "100000000",
    },
  };
  const handle_P2PKH_fun_click = (result: { flag: string; [key: string]: string | number }[]) => {
    console.log("Generated Data:", result);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dropdown Button Demo</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <FunTempButton onClick={handleButtonClick} params={params} />
      <FunTempButton onClick={handleButtonClickb} params={paramsvalue} />
      <FunTempButton onClick={handle_P2PKH_fun_click} params={p2pkh_params} />
      </div>
    </div>
  );
};

export default App;
