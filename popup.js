const NETWORKS = {
  Binance: {
    rpcUrl: "https://bnb-testnet.g.alchemy.com/v2/b75eS5gKwKT2fViZLWX76rsFgjFbHpEe",
    chainId: 97,
    symbol: "tBNB",
    blockExplorer: "https://testnet.bscscan.com"
  },
  sepolia: {
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/b75eS5gKwKT2fViZLWX76rsFgjFbHpEe", 
    chainId: 11155111,
    symbol: "ETH",
    blockExplorer: "https://sepolia.etherscan.io"
  }
};
function showError(message) {
    const errorBox = document.getElementById("error-msg");
    errorBox.innerText = message;
    errorBox.style.display = "block";
    document.getElementById("center").style.display = "none";
    setTimeout(() => {
        errorBox.style.display = "none";
        errorBox.innerText = "";
    }, 5000);
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("form").addEventListener("click",handler);
});
async function handler(){
    document.getElementById("center").style.display = "flex";
    const private_key = document.getElementById("private_key").value;
    const amount = document.getElementById("amount").value;
    const address = document.getElementById("address").value;
    const network = document.getElementById("network_select").value;
    

    if (!private_key) return showError("Private key is required.");
    if (!amount||parseFloat(amount) <= 0) return showError("Please enter a valid amount greater than 0.");
    if (!address) return showError("Recipient address is required.");

    try{
    const {rpcUrl,blockExplorer}=NETWORKS[network];
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(private_key,provider);
    const tx = {
        to:address,
        value: ethers.utils.parseEther(amount),
    }
    // let a =document.getElementById("link");
    // a.href="some link";
    
    const txObj = await wallet.sendTransaction(tx)
    
    console.log("txHash",txObj.hash);
    document.getElementById("center").style.display = "none";
    const a = document.getElementById("link");
    a.href = `${blockExplorer}/tx/${txObj.hash}`;
    a.style.display = "block";
    }catch(error){
        console.log("Transaction error: ",error);
        document.getElementById("center").style.display = "none";
        showError("Something went wrong: " + error.message);
    }
    
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("check_balance").addEventListener("click", checkBalance);
});

async function checkBalance() {
    document.getElementById("center").style.display = "flex";
    const address = document.getElementById("address").value;
    if (!address) return showError("Recipient address is required.");

    try{
    const network = document.getElementById("network_select").value;
    const {rpcUrl,symbol}=NETWORKS[network];
    const provider = new ethers.providers.JsonRpcProvider(
        rpcUrl
    );
    const signer = provider.getSigner();
    console.log("signer : ",signer);
    
    const balance = await provider.getBalance(address)  
    const balanceInEth = ethers.utils.formatEther(balance);
    document.getElementById("check_balance").innerText = "Balance: " + balanceInEth +`${symbol}`;
    console.log("Balance in eth: ", balanceInEth);
    document.getElementById("center").style.display = "none";
    }catch(error){
        console.log("Error fetching balance: ",error);
        document.getElementById("center").style.display = "none";
        showError("Something went wrong: " + error.message);
    }
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('amount').value = '';
  document.getElementById('private_key').value = '';
  document.getElementById('address').value = '';
  document.getElementById('link').href = '';
  document.getElementById('link').textContent = '';
});
