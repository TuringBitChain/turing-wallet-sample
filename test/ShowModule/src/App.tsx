import React, { useState } from "react";
import { ShowModule } from "./ShowModule";

const App = () => {
  const [isModuleVisible, setIsModuleVisible] = useState<boolean>(true); // 控制模块显示
  const data = {
    name: "John Doe",
    age: 30,
    hobbies: ["reading", "traveling", "coding"],
  };

  // 捕捉关闭事件
  const handleModuleClose = () => {
    console.log("ShowModule has been closed");
    setIsModuleVisible(false); // 隐藏模块
  };

  return (
    <div>
      {isModuleVisible ? (
        <ShowModule data={data} onClose={handleModuleClose} />
      ) : (
        <button
          onClick={() => setIsModuleVisible(true)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Open ShowModule
        </button>
      )}
    </div>
  );
};

export default App;
