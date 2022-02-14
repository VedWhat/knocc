import { useEffect, useState } from "react"
import { ethers } from "ethers";
import './numbersgame.scss';
const NumbersGame = () => {

    const contractAddress = "0x67e15E231B6F6BB8B28E29A8311A1A8a2b040F95";
    const contractAbi = [
        "function set(int num) public",
        "function get() public view returns(int)"
    ]

    const [error,setError] = useState("");
    const [connectionText,setConnectionText] = useState("Connect to wallet!");
    const [account,setAccount] = useState(null);
    

    const [provider,setProvider] = useState(null);
    const [signer,setSigner] = useState(null);
    const [contract,setContract] = useState(null);

    const [inputNumber,setInputNumber] = useState(null);
    const [result,setResult] = useState(null);
    const [number,setNumber] = useState(null);
    const [won,setWon] = useState(false);


    const [writeTransactionLoading,setWriteTransactionLoading] = useState(false);
    const [getTransactionLoading, setGetTransactionLoading] = useState(false);

    const sendAndCheck = async () => {
        if(account === null){
            setConnectionText("Please connect to the wallet before trying to play");
            return;
        }
        setWriteTransactionLoading(true);
        setResult("Play your move and approve the transaction!");
        let tx = await contract.set(inputNumber);
        console.log(tx.hash);
        setResult("Checking if charmander liked that! Knock knock!");
        await tx.wait();
        setWriteTransactionLoading(false);


        setGetTransactionLoading(true);
        let num = await contract.get();
        console.log(num.toNumber());
        setNumber(num.toNumber());
        setGetTransactionLoading(false);
    }

    useEffect(() => {
        console.log(number);
        if(number % 2 === 0){
            setWon(true);
            setResult("Charmander likes that guess! He's out to play with you!");
        }else{
            setWon(false);
            setResult("Charmander hates that guess! He goes back to sleep!");
        }
    },[number])

    useEffect(() => {
        console.log("WRITING LOADING: ",writeTransactionLoading);
        console.log("READING LOADING: ",getTransactionLoading);
    },[writeTransactionLoading,getTransactionLoading])

    useEffect(() => { 
        setResult("");
        setWon(false);
        const ethereum = window.ethereum;
        if(!ethereum){
            setError("Install metamask!");
            console.error("Install metamask!!");
        }
    },[])

    const connectWallet = () => {
        const ethereum = window.ethereum;

        if(!ethereum){
            setError("Install metamask!");
            console.error("Install metamask!!");
        }else{
            ethereum.request({method: "eth_requestAccounts"})
            .then(res => {
                accountHandler(res[0]);
                setConnectionText("Connected to wallet!");
            })
        }
    }

    const accountHandler = (acc) => {
        setAccount(acc);
        updateInfo();
    }

    const updateInfo = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress,contractAbi,tempSigner);
        setContract(tempContract);
    }

    return(
        <div className="numbersGame">
        {error !== "" && (
            <div className="errorContainer">
                <section class="message-list">
                    <section class="message -left">
                        <div class="nes-balloon from-left">
                            <p>To continue on this quest please install Metamask!</p>
                    </div>
                    </section>
                </section>
                <span className="metamaskDownload">
                        <a href="https://metamask.io/"> Click here to know how!</a>
                    </span>
            </div>
        )}
        {error === "" && (
            <div className="gameContainer">
                <div className="nes-container with-title">
                            <span class="title nes-text is-primary">Knock Knock!</span>
                            <div className="container">
                                <div className="span">Try and wake charmander up!!</div>
                                <button className="nes-btn" onClick = {connectWallet}>{connectionText}</button>
                                {account !== null && (
                                    <p>Welcome! {account}</p>
                                )}
                                <div className = "inputWrapper">
                                    <div className="nes-field">
                                        <label for="name_field">Enter Guess</label>
                                        <input type="text" id="name_field" className="nes-input" onChange={(e) => {setInputNumber(e.target.value)}}/>
                                    </div>        
                                    <button className="nes-btn is-success" onClick = {sendAndCheck}>Spin</button>
                                </div>
                                <div className="resultDiv">
                                    <p>{result}</p>
                                    <section className="icon-list">
                                        {!won && (
                                            <i class="nes-pokeball"></i>)}
                                        {won && (
                                        <i className="nes-charmander"></i>)}
                                    </section>
                                </div>
                            </div>
                        </div>
            </div>
            
        )}
    </div>
    )
}

export default NumbersGame
