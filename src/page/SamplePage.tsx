import { useState } from "react";
import TuringIcon from "../assets/TuringIcon.svg";
import { TuringConnectButton } from "../components/TuringConnectButton";
import { FunTempButton } from "../components/FunTemp";
import { ShowModule } from "../components/ShowModule";
import {
  Address,
  useTuringWallet,
  TransactionFlag,
} from "turing-wallet-provider";

export const SamplePage = () => {
  const wallet = useTuringWallet();
  const [pubKey, setPubKey] = useState<string | undefined>();
  const [address, setAddress] = useState<Address | undefined>();
  const [messageToSign, setMessageToSign] = useState<string>("");
  const [messageEncoding, setMessageEncoding] = useState<"base64" | "utf8" | "hex">("utf8");
  const [signatureResponse, setSignatureResponse] = useState<string>("");
  
  // Sign Transaction states
  const [ttxraws, setTtxraws] = useState<string>("");
  const [utxosSatoshis, setUtxosSatoshis] = useState<string>("");
  const [scriptPubkeys, setScriptPubkeys] = useState<string>("");
  const [signTransactionResponse, setSignTransactionResponse] = useState<string>("");
  
  // Encrypt/Decrypt states
  const [encryptMessage, setEncryptMessage] = useState<string>("");
  const [decryptMessage, setDecryptMessage] = useState<string>("");
  const [encryptResponse, setEncryptResponse] = useState<string>("");
  const [decryptResponse, setDecryptResponse] = useState<string>("");

  const handleConnect = async () => {
    if (!wallet.connect) {
      window.open(
        "https://chromewebstore.google.com/detail/turing-wallet/hmodlkcjggjgfalgdgbflhefijojdjen?hl=zh-CN&utm_source=ext_sidebar",
        "_blank"
      );
      return;
    }
    const key = await wallet.connect();
    if (key) setPubKey(key);
  };

  const handleGetAddress = async () => {
    const address = await wallet.getAddress();
    if (address) setAddress(address);
  };

  // 调钱包函数
  const walletSendTransaction = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    const convertedResult = result.map((item) => ({
      ...item,
      flag: item.flag as TransactionFlag, // 强制将 flag 转为 TransactionFlag 类型
    }));

    try {
      const response = await wallet.sendTransaction(convertedResult);
      if (response) {
        const { txid } = response;
        setShowMessage(response);
        setShowModuleVisible(true);
        console.log("Transaction ID:", txid);
      }
    } catch (error) {
      console.error("Transaction Error:", error);
    }
  };

  const walletSignMessage = async (
    message: string,
    encoding: "base64" | "utf8" | "hex"
  ) => {
    try {
      const response = await wallet.signMessage({ message, encoding });
      alert(response)
    } catch (error) {
      console.log(error);
    }
  };

  // Sign Transaction function
  const walletSignTransaction = async () => {
    if (!ttxraws || !utxosSatoshis || !scriptPubkeys) {
      alert("Please fill in all transaction signing fields");
      return;
    }
    
    try {
      const ttxrawsArray = ttxraws.split('\n').filter(line => line.trim());
      const utxosSatoshisArray = JSON.parse(utxosSatoshis);
      const scriptPubkeysArray = JSON.parse(scriptPubkeys);
      
      const response = await wallet.signTransaction({
        ttxraws: ttxrawsArray,
        utxos_satoshis: utxosSatoshisArray,
        script_pubkeys: scriptPubkeysArray
      });
      
      const formattedResponse = JSON.stringify(response, null, 2);
      setSignTransactionResponse(formattedResponse);
    } catch (error) {
      console.error("Sign transaction error:", error);
      alert("Failed to sign transaction");
      setSignTransactionResponse("");
    }
  };

  // Encrypt function
  const walletEncrypt = async () => {
    if (!encryptMessage) {
      alert("Please enter a message to encrypt");
      return;
    }
    
    try {
      const response = await wallet.encrypt({ message: encryptMessage });
      const formattedResponse = JSON.stringify(response, null, 2);
      setEncryptResponse(formattedResponse);
    } catch (error) {
      console.error("Encrypt error:", error);
      alert("Failed to encrypt message");
      setEncryptResponse("");
    }
  };

  // Decrypt function
  const walletDecrypt = async () => {
    if (!decryptMessage) {
      alert("Please enter a message to decrypt");
      return;
    }
    
    try {
      const response = await wallet.decrypt({ message: decryptMessage });
      const formattedResponse = JSON.stringify(response, null, 2);
      setDecryptResponse(formattedResponse);
    } catch (error) {
      console.error("Decrypt error:", error);
      alert("Failed to decrypt message");
      setDecryptResponse("");
    }
  };

  // 控制显示模块显示隐藏
  const [isShowModuleVisible, setShowModuleVisible] = useState<boolean>(false);
  // 设置显示模块信息
  const [showMessage, setShowMessage] = useState<any | undefined>();

  // p2pkh
  const p2pkh_params = {
    param1: "P2PKH", // 按钮的文本内容
    param2lab: {
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      satoshis: "100000000",
    },
  };
  const handle_P2PKH_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // COLLECTION_CREATE
  const collection_data = {
    collectionName: "sasa",
    description: "sa",
    supply: 5,
    file: `data:image/png;base64,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`,
  };
  const collection_create_params = {
    param1: "COLLECTION_CREATE",
    param2lab: {
      collection_data: JSON.stringify(collection_data),
    },
  };
  const handle_COLLECTION_CREATE_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // NFT_CREATE
  const nft_create_params = {
    param1: "NFT_CREATE", // 指示交易类型为创建 NFT
    param2lab: {
      nft_data: "", // 创建 NFT 所需的数据，通常为 JSON 格式的字符串
      collection_id: "", // 关联的集合 ID，指明 NFT 所属的集合
    },
  };
  const handle_NFT_CREATE_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_INIT
  const poolnft_init_params = {
    param1: "POOLNFT_INIT", // 指示交易类型为初始化 Pool NFT
    param2lab: {
      nft_contract_address: "", // pool NFT 合约地址，指明要初始化的 pool NFT 合约,来源：POOLNFT_MINT
      address: "", // 接收者的地址，pool NFT 将被初始化到此地址
      tbc_amount: "30", // TBC 数量，用于初始化操作的数量
      ft_amount: "1000", // FT 数量，用于初始化操作的数量
    },
  };
  const handle_POOLNFT_INIT_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_LP_CONSUME
  const poolnft_lp_consume_params = {
    param1: "POOLNFT_LP_CONSUME", // 指示交易类型为消耗 Pool NFT 的流动性
    param2lab: {
      nft_contract_address: "", // pool NFT 合约地址，指明要消耗流动性的 NFT 合约
      address: "", // 接收者的地址，流动性将被消耗到此地址
      ft_amount: "100", // FT 数量，用于消耗流动性的数量
    },
  };
  const handle_POOLNFT_LP_CONSUME_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  //POOLNFT_SWAP_TO_TOKEN
  const poolnft_swap_to_token_params = {
    param1: "POOLNFT_SWAP_TO_TOKEN", // 指示交易类型为将 Pool NFT 交换为代币
    param2lab: {
      nft_contract_address: "", // pool NFT 合约地址，指明要交换的 NFT 合约
      address: "", // 接收者的地址，代币将被发送到此地址
      tbc_amount: "10", // TBC 数量，用于交换操作中涉及的数量
    },
  };
  const handle_POOLNFT_SWAP_TO_TOKEN_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_MERGE
  const POOLNFT_MERGE_params = {
    param1: "POOLNFT_MERGE", // 指示交易类型为合并 Pool NFT
    param2lab: {
      nft_contract_address: "", // pool NFT 合约地址，指明要合并的 NFT 合约
      merge_times: "1", // 合并次数，范围为 1 到 10 次
    },
  };
  const handle_POOLNFT_MERGE_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // FTLP_MERGE
  const FTLP_MERGE_params = {
    param1: "FTLP_MERGE", // 指示交易类型为合并 Pool NFT
    param2lab: {
      nft_contract_address: "", // pool NFT 合约地址，指明要合并的 NFT 合约
    },
  };
  const handle_FTLP_MERGE_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // NFT_TRANSFER
  const nft_transfer_params = {
    param1: "NFT_TRANSFER",
    param2lab: {
      nft_contract_address:
        "9e201c6f6249ac1e562e71de044837bffedbb31be134bf11045682f5668e7403",
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
    },
  };
  const handle_NFT_TRANSFER_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // FT_TRANSFER
  const ft_transfer_params = {
    param1: "FT_TRANSFER",
    param2lab: {
      ft_contract_address:
        "70d7b6c99f8209a7bc99982df01f169f4054bd9ec3e52f178d54c144886cb3b7",
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      ft_amount: "9986700",
    },
  };
  const handle_FT_TRANSFER_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_MINT
  const poolnft_mint_params = {
    param1: "POOLNFT_MINT",
    param2lab: {
      ft_contract_address:
        "70d7b6c99f8209a7bc99982df01f169f4054bd9ec3e52f178d54c144886cb3b7",
    },
  };
  const handle_POOLNFT_MINT_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_LP_INCREASE
  const poolnft_lp_increase_params = {
    param1: "POOLNFT_LP_INCREASE",
    param2lab: {
      nft_contract_address:
        "e01a8aa88435dec02d11d2e11784966647c301d330c3dfcb504caede617e409c",
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      tbc_amount: "30",
    },
  };
  const handle_POOLNFT_LP_INCREASE_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  // POOLNFT_SWAP_TO_TBC
  const swap_to_tbcparams = {
    param1: "POOLNFT_SWAP_TO_TBC",
    param2lab: {
      nft_contract_address:
        "e01a8aa88435dec02d11d2e11784966647c301d330c3dfcb504caede617e409c",
      address: "143KgKGcse57nXBnXyJwtQrf2KP4KWto59",
      ft_amount: "100",
    },
  };
  const handle_POOLNFT_SWAP_TO_TBC_fun_click = async (
    result: { flag: string; [key: string]: string | number }[]
  ) => {
    console.log("Generated Data:", result);
    walletSendTransaction(result);
  };

  //SIGN MESSAGE
  const handleSignMessage = async () => {
    if (!messageToSign) {
      alert("Please enter a message to sign");
      return;
    }
    try {
      const response = await wallet.signMessage({ 
        message: messageToSign, 
        encoding: messageEncoding 
      });
      // 格式化响应对象，使其更易读
      const formattedResponse = JSON.stringify(response, null, 2);
      setSignatureResponse(formattedResponse);
    } catch (error) {
      console.error("Sign message error:", error);
      alert("Failed to sign message");
      setSignatureResponse("");
    }
  };
  

  const sendTrasaction = async () => {
    const ftName = "tbci";
    const ftSymbol = "tbci";
    const ftDecimal = 6;
    const ftAmount = 150000000;
    const ft_data = {
      name: ftName,
      symbol: ftSymbol,
      amount: ftAmount,
      decimal: ftDecimal,
    };

    const paymentParams = [
      {
        flag: "FT_MINT" as TransactionFlag,
        ft_data: JSON.stringify(ft_data),
      },
    ];
    try {
      const response = await wallet.sendTransaction(paymentParams);

      if (response) {
        const { txid } = response;
        console.log("txid", txid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={TuringIcon}
          alt="Turing Wallet Icon"
          style={{ width: "5rem", height: "5rem" }}
        />
        <h1>Turing Wallet Demo</h1>
        <h4>First let's connect your wallet</h4>
        <TuringConnectButton onClick={handleConnect} />
        <p style={{ width: "80%", fontSize: "0.75rem", margin: "1rem" }}>
          {JSON.stringify(pubKey)}
        </p>
        {pubKey && (
          <>
            <h4>Now let's get the addresses</h4>
            <button onClick={handleGetAddress} style={{ margin: "1rem" }}>
              Get Addresses
            </button>
            <p style={{ width: "80%", fontSize: "0.75rem", margin: "1rem" }}>
              {JSON.stringify(address)}
            </p>
          </>
        )}

        <div style={{ padding: "2rem", margin: "0 1rem" }}>
          {" "}
          {/* 添加左右间隔 */}
          <h1>Message Signing Demo</h1>
          <div style={{ 
            display: "flex", 
            gap: "2rem",
            marginBottom: "2rem",
            width: "100%",
            maxWidth: "1000px"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <textarea
                value={messageToSign}
                onChange={(e) => setMessageToSign(e.target.value)}
                placeholder="Enter message to sign"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "100px",
                  borderRadius: "4px"
                }}
              />
              <select
                value={messageEncoding}
                onChange={(e) => setMessageEncoding(e.target.value as "base64" | "utf8" | "hex")}
                style={{ 
                  padding: "0.5rem",
                  borderRadius: "4px"
                }}
              >
                <option value="utf8">UTF-8</option>
                <option value="base64">Base64</option>
                <option value="hex">Hex</option>
              </select>
              <button 
                onClick={handleSignMessage}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Sign Message
              </button>
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <h3 style={{ margin: 0 }}>Signature Result:</h3>
              <textarea
                value={signatureResponse}
                readOnly
                placeholder="Signature will appear here"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "150px",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  whiteSpace: "pre"
                }}
              />
            </div>
          </div>

          <h1>Sign Transaction Demo</h1>
          <div style={{ 
            display: "flex", 
            gap: "2rem",
            marginBottom: "2rem",
            width: "100%",
            maxWidth: "1200px"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <textarea
                value={ttxraws}
                onChange={(e) => setTtxraws(e.target.value)}
                placeholder="Enter ttxraws (one per line)"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "80px",
                  borderRadius: "4px"
                }}
              />
              <textarea
                value={utxosSatoshis}
                onChange={(e) => setUtxosSatoshis(e.target.value)}
                placeholder="Enter utxos_satoshis (JSON array of arrays)"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "80px",
                  borderRadius: "4px"
                }}
              />
              <textarea
                value={scriptPubkeys}
                onChange={(e) => setScriptPubkeys(e.target.value)}
                placeholder="Enter script_pubkeys (JSON array of arrays)"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "80px",
                  borderRadius: "4px"
                }}
              />
              <button 
                onClick={walletSignTransaction}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Sign Transaction
              </button>
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <h3 style={{ margin: 0 }}>Sign Transaction Result:</h3>
              <textarea
                value={signTransactionResponse}
                readOnly
                placeholder="Signature result will appear here"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "250px",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  whiteSpace: "pre"
                }}
              />
            </div>
          </div>

          <h1>Encrypt/Decrypt Demo</h1>
          <div style={{ 
            display: "flex", 
            gap: "2rem",
            marginBottom: "2rem",
            width: "100%",
            maxWidth: "1200px"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <h3 style={{ margin: 0 }}>Encrypt Message:</h3>
              <textarea
                value={encryptMessage}
                onChange={(e) => setEncryptMessage(e.target.value)}
                placeholder="Enter message to encrypt"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "100px",
                  borderRadius: "4px"
                }}
              />
              <button 
                onClick={walletEncrypt}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  backgroundColor: "#FF9800",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Encrypt
              </button>
              <textarea
                value={encryptResponse}
                readOnly
                placeholder="Encrypted result will appear here"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "100px",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  whiteSpace: "pre"
                }}
              />
            </div>
            
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "1rem",
              flex: 1
            }}>
              <h3 style={{ margin: 0 }}>Decrypt Message:</h3>
              <textarea
                value={decryptMessage}
                onChange={(e) => setDecryptMessage(e.target.value)}
                placeholder="Enter message to decrypt"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "100px",
                  borderRadius: "4px"
                }}
              />
              <button 
                onClick={walletDecrypt}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  backgroundColor: "#9C27B0",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Decrypt
              </button>
              <textarea
                value={decryptResponse}
                readOnly
                placeholder="Decrypted result will appear here"
                style={{ 
                  padding: "0.5rem",
                  minHeight: "100px",
                  borderRadius: "4px",
                  backgroundColor: "#f5f5f5",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  whiteSpace: "pre"
                }}
              />
            </div>
          </div>

          <h1>FT Demo</h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FunTempButton
              onClick={handle_P2PKH_fun_click}
              params={p2pkh_params}
            />
            <FunTempButton
              onClick={handle_COLLECTION_CREATE_fun_click}
              params={collection_create_params}
            />
            <FunTempButton
              onClick={handle_NFT_TRANSFER_fun_click}
              params={nft_transfer_params}
            />
            <FunTempButton
              onClick={handle_FT_TRANSFER_fun_click}
              params={ft_transfer_params}
            />
          </div>
          <h1>POOLNFT Demo</h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FunTempButton
              onClick={handle_NFT_CREATE_fun_click}
              params={nft_create_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_INIT_fun_click}
              params={poolnft_init_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_MINT_fun_click}
              params={poolnft_mint_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_LP_CONSUME_fun_click}
              params={poolnft_lp_consume_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_SWAP_TO_TOKEN_fun_click}
              params={poolnft_swap_to_token_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_MERGE_fun_click}
              params={POOLNFT_MERGE_params}
            />
            <FunTempButton
              onClick={handle_FTLP_MERGE_fun_click}
              params={FTLP_MERGE_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_LP_INCREASE_fun_click}
              params={poolnft_lp_increase_params}
            />
            <FunTempButton
              onClick={handle_POOLNFT_SWAP_TO_TBC_fun_click}
              params={swap_to_tbcparams}
            />
          </div>
          {isShowModuleVisible && (
            <ShowModule
              data={showMessage}
              onClose={() => {
                setShowModuleVisible(false); // 隐藏模块
                setShowMessage(undefined); // 清空数据
              }}
            />
          )}
        </div>
      </header>
    </div>
  );
};
