import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Election from "./contracts/Election.json";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const App = () => {
  //all the UI 
  // input value
  const classes = useStyles();
  const [chooseid, setChooseid] = useState('');

  const handleChange = (e) => {
    setChooseid(e.target.value);
  };
  const [refresh, setrefresh] = useState(0);
  //input value

  //things realted to web3
  let content;
  const [loading2, setloading2] = useState(false);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [Hello, setHello] = useState({});

  //states related to electioncontract
  const [voted, setVoted] = useState(false);
  const [showlead, setShowLead] = useState(false);

  

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = new Web3(window.ethereum);

    let url = window.location.href;
    console.log(url);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    if (networkId == 42) {
      // const hello = new web3.eth.Contract(Helloabi.abi, networkData.address);
      const electionContract = new web3.eth.Contract(
        Election.abi,
        "0x92ac79D324c1e32478a3Fe79d7E990aF5Bf8EBA4"
      );

      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const onclick = async (a) => {
    const web3 = new Web3(window.web3);
    await Hello.methods
      .setCompleted(a.toString())
      .send({ from: account })
      .once("recepient", (recepient) => {
        console.log("success");
      })
      .on("error", () => {
        console.log("error");
      });
  };

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <div className="app">
        <div className="table">
          <Table />
        </div>
        <div className="do_vote">
          <h3>Select a candidate and click the "VOTE" button</h3>
        </div>
        <div className="input_id">
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Select ID</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={chooseid}
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={() => {setVoted(!voted); alert(chooseid)}}>VOTE</Button>
        </div>
        <div className="after_voting">
          {voted && (<h6>THANK YOU FOR YOUR VOTE</h6>)}
        </div>
        <div className="showinguser_address">
          <h4>Your Address: {account}</h4>
        </div>
        <hr className="news1"/>
        <div className="lead_title">
          <h4>FIND THE LEADING CANDIDATE</h4>
          <Button variant="contained" onClick={() => {setShowLead(!showlead)}}>LEADING</Button>
        </div>
        {showlead &&(<div className="leader_details">
        <p>Name: Demo Name</p>
        <p>Votes: Demo Votes</p>
        </div>)}
      
        <div className="footer">
            <h4>Made by Yohenba Kshetrimayum</h4>
        </div>

        <div className="add_candidate">
          
        </div>


        {/*<main role="main" class="container">
          <div class="jumbotron">
            <h1>Project</h1>
            <div className="row" style={{ paddingTop: "30px" }}>
              {" "}
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 1</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 2</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <h3>text 3</h3>
              </div>
              <div className="row" style={{ paddingLeft: "40px" }}>
                <button className="btn btn-primary">Click on it</button>
              </div>
            </div>
          </div>
    </main>*/}
      </div>
    );
  }

  return (
    <div>
      <Navbar account={account} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
