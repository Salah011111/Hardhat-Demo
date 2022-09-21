
import './App.css';
import { Button , Container , Row , Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3Modal from "web3modal"
import { ethers } from "ethers"
import React,{ useState } from 'react';
// import Web3 from "web3"


// const providerOptions = {
//   /* See Provider Options Section */
// };

const web3Modal = new Web3Modal({
  network: "rinkeby", // optional
  // cacheProvider: true, // optional
  providerOptions:{} // required
});

function App() {
  const [address,setAddress] = useState('')
  const [balance,setBalance] = useState(0)
  const [shortaddress, setShortAddress] = useState('')
  const [msg,setMsg] = useState('')
  const [contract,setContract] = useState({})
  const [userInput,setUserinput] = useState('')
  const [ens,setEns] = useState('')
  const [isConnected,setIsconnect] = useState(false)
  const contractAddress = '0xbED750fA453bc8aeC484558A8B1CF5F3C12cE1eE'
  const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  async function init(){
    // 进行初始化
    const instance = await web3Modal.connect();
    // 实例化provider 是我们用来与以太坊节点实际交互的对象
    const provider = new ethers.providers.Web3Provider(instance);
    // 实例化 signer对象
    const signer = provider.getSigner();
    // 获取钱包地址
    const addr = await signer.getAddress()
    // 设置钱包地址数据
    setAddress(addr)

    let shortAddr = addr.slice(0,4) + '...' + addr.slice(-4)
    // 设置显示地址
    setShortAddress(shortAddr)
    console.log(`shortAddress:${shortAddr}`)
    // 获取钱包余额 bigNumber类型
    const bal = await provider.getBalance(addr)
    // 对获取的bignumber类型余额进行位数处理 使用ethers 方法来进行单位换算
    const balance = ethers.utils.formatEther(bal)
    // 设置余额数值
    setBalance(balance)
    console.log(`Ethers balance:${balance},bigNumber type balance : ${bal}`)

    // 编译部署后的地址：0x0aeED7F20dCe05c32aDd3bF28C57280C57916298

    // 合约初始化需要三个参数变量 合约地址 合约的abi(编译、部署之后自动生成的) provider或者signer对象
    let _contracrt = new ethers.Contract(contractAddress,abi,signer)
    // 设置全局合约
    setContract(_contracrt)

    setEns(await provider.lookupAddress(addr))
  }

    const getMessage = async () =>  {

      await checkIfWalletIsConnected()

      console.log('contracrt ',contract)
      // 定义_msg变量获取函数返回内容
      const _msg = await contract.greet()
      console.log('_msg ',_msg)
      // 设置msg数值
      setMsg(_msg)

      setIsconnect(true)
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log(accounts)

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        // setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      // setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  async function setMessage(msg){

    const _msg = await contract.setGreeting(msg)
    // console.log('_msg ',_msg)
    // // 设置msg数值
    // setMsg(_msg)
  }


  return (
    <div className="App">
      <Container className='mt-5'>
        <Row>
          <Col>hello {address} </Col>
          <Col>ens {ens}</Col>
          <Col>you have {balance} ETH</Col>
          <Col>add: {shortaddress}</Col>
          <Col>msg: {msg}</Col>
        </Row>

        <Row >
          <Row className='mt-5'>
            <Button onClick={()=>{init()}}>Connect Wallet</Button>
          </Row>
          <Row className='mt-5'>
            <h3 >current user input :{userInput}</h3>
          </Row>
          <Row className='mt-5'>
            {isConnected?<Button onClick={()=>{setMessage(userInput)}}>Update Message</Button>:''}
          </Row>
          <Row className='mt-5'>
            <input type="text" value={userInput} onChange={(e) => setUserinput(e.target.value)}/>
          </Row>
          <Row className='mt-5'>
            <Button onClick={()=>{getMessage()}}>getMsg</Button>
          </Row>
          <Row>
            <Button style={{ marginTop: "20px" }} onClick={() => {
              connectWallet()
            }}>查看我们的钱包地址</Button>
          </Row>
        </Row>
      </Container>
    </div>
  );
}

export default App;
