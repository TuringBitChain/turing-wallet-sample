import React, { useState, useEffect } from "react";

export type FunTempProps = {
  onClick: () => void; // 点击主按钮的逻辑
  params: {
    param1: string; // 按钮的文本内容
    param2lab: string[] | { [key: string]: string }; // 支持两种类型：数组（无默认值）或对象（有默认值）
  };
};

export const FunTempButton: React.FC<FunTempProps> = ({ onClick, params }) => {
  const [showDropdown, setShowDropdown] = useState(false); // 控制下拉页面显示/隐藏
  const [inputs, setInputs] = useState<{ [key: string]: string }>({}); // 存储每个输入框的值

  // 初始化输入框的默认值
  useEffect(() => {
    // 如果 param2lab 是数组（无默认值），初始化为空字符串
    if (Array.isArray(params.param2lab)) {
      const initialInputs = params.param2lab.reduce((acc, label) => {
        acc[label] = ""; // 初始化为空字符串
        return acc;
      }, {} as { [key: string]: string });
      setInputs(initialInputs);
    } else {
      // 如果 param2lab 是对象（有默认值）
      setInputs({ ...params.param2lab });
    }
  }, [params.param2lab]);

  // 切换下拉页面显示/隐藏
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // 更新输入框的值
  const handleInputChange = (key: string, value: string) => {
    setInputs({ ...inputs, [key]: value });
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* 主按钮 */}
      <button
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          borderRadius: "0.5rem",
          border: "none",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#1d1d1d",
          backgroundColor: "#A2FF86",
        }}
      >
        {params.param1} {/* 动态显示按钮文本内容 */}
        {/* 下拉箭头 */}
        <span
          onClick={(e) => {
            e.stopPropagation(); // 阻止点击箭头时触发按钮的 onClick
            toggleDropdown();
          }}
          style={{
            marginLeft: "0.5rem",
            cursor: "pointer",
            fontSize: "1.25rem",
            transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)", // 箭头方向切换
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* 下拉页面 */}
      {showDropdown && (
        <div
          style={{
            position: "absolute",
            top: "100%", // 下拉页面位于按钮下方
            left: 0,
            width: "300px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "0.5rem",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          {/* 动态生成标签和输入框 */}
          {Object.entries(inputs).map(([label, defaultValue], index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}
              >
                {label} {/* 动态显示标签内容 */}
              </label>
              <input
                type="text"
                value={inputs[label] || ""}
                onChange={(e) => handleInputChange(label, e.target.value)}
                placeholder={`Enter ${label}...`}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "0.25rem",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
