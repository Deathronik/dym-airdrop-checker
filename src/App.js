import './App.css';
import {Form, Table, Button, Spinner, ProgressBar} from "react-bootstrap";
import React, {useState} from "react";
import Result from "./Components/Result/Result";
import Creator from "./Components/Creator/Creator";

function App() {
    const [wallets, setWallets] = useState([])
    const [results, setResults] = useState([])
    const [progress, setProgress] = useState(0)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const fetchWalletData = async (wallet) => {
        const response = await fetch(`https://geteligibleuserrequest-xqbg2swtrq-uc.a.run.app/?address=${wallet}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,ru-UA;q=0.8,ru;q=0.7,uk;q=0.6",
                "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://genesis.dymension.xyz/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        })

        if (response.ok) {
            const json = await response.json()

            return {
                "wallet": wallet,
                "amount": json.amount,
                "eligible": true
            }
        } else {
            return {
                "wallet": wallet,
                "amount": 0,
                "eligible": false
            }
        }

    }

    const onCLickCheckHandler = async () => {
        setProgress(0)
        setIsLoading(true)
        const walletsStats = []
        let total = 0

        for (const wallet of wallets) {
            await setProgress(prevState => prevState + 1)

            if (wallet === "") continue

            let walletDataJson = await fetchWalletData(wallet)

            total += walletDataJson.amount

            walletsStats.push(walletDataJson)
        }

        setTotal(total)
        setResults(walletsStats)
        setIsLoading(false)
    }

    return (
        <div className="App p-5 d-flex justify-content-center align-items-center text-center flex-column">
            <h3>$DYM Airdrop Checker</h3>
            <div>
                <Form className="mb-3">
                    <Form.Label className="text-white"><h5>Wallets</h5></Form.Label>
                    <Form.Control onChange={e => setWallets(e.target.value.toLowerCase().split("\n"))}
                                  style={{width: 650, height: 300, resize: "none"}} as="textarea"/>
                </Form>
                <Button className="w-25" disabled={isLoading} onClick={onCLickCheckHandler}>{isLoading ?
                    <Spinner animation="grow" size="sm"/> : "Check"}</Button>
                {isLoading && <ProgressBar className="mt-3" animated now={progress} max={wallets.length}/>}
            </div>
            <div className="mt-3">
                <Creator/>
            </div>
            {results.length !== 0 && (
                <div>
                    <h5 className="mt-3">Results</h5>
                    <p className="mt-3"><strong>After check, do it again on the <a href="https://genesis.dymension.xyz/" target="_blank">official website</a> with the eligible wallets</strong></p>
                    <h5 className="mb-3">{`Total: ${total.toFixed(2)} $DYM`}</h5>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Wallet</th>
                            <th>Amount</th>
                            <th>Eligible</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result, index) => <Result key={index} result={result} index={index}/>)}
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export default App;
