import React, { useEffect, useState } from "react";

export type ShowModuleProps = {
  data: any; // 任意形式的数据
  onClose?: () => void; // 父组件传递的关闭回调，设置为可选
};

export const ShowModule: React.FC<ShowModuleProps> = ({ data, onClose = () => {} }) => {
  const [formattedData, setFormattedData] = useState<string>("");

  useEffect(() => {
    // 将输入数据格式化为字符串以便显示
    if (typeof data === "object") {
      setFormattedData(JSON.stringify(data, null, 2)); // 格式化对象
    } else {
      setFormattedData(String(data)); // 非对象转为字符串
    }
  }, [data]);

  const handleClose = () => {
    onClose(); // 调用父组件的关闭回调函数
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        backgroundColor: "#fff",
        boxShadow: "3px 8px 16px rgba(0, 0, 0, 0.2)", // 更明显的阴影
        borderRadius: "0.5rem",
        padding: "1rem",
        zIndex: 1000,
        overflow: "auto",
        maxHeight: "80vh", // 限制高度，防止数据过多导致溢出
      }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={handleClose} // 点击时调用父组件回调
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "1.25rem",
          cursor: "pointer",
        }}
      >
        ✖
      </button>

      {/* 数据内容 */}
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
      </h3>
      <pre
        style={{
          fontSize: "1rem",
          whiteSpace: "pre-wrap", // 自动换行
          wordWrap: "break-word",
        }}
      >
        {formattedData}
      </pre>
    </div>
  );
};