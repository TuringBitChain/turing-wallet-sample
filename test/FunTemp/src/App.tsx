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

  const params = {
    param1: "FT_TRANSFER", // 按钮的文本内容
    param2lab: {
      "ft_contract_address": "70d7b6c99f8209a7bc99982df01f169f4054bd9ec3e52f178d54c144886cb3b7",
      "address": "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      "ft_amount": "9986700",
    },
  };
  

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dropdown Button Demo</h1>
      <FunTempButton onClick={handleButtonClick} params={params} />
    </div>
  );
};

export default App;
