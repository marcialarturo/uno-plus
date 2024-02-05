import { Card } from "./Card";
import { Player } from "./Player";
import { useAccount } from "wagmi";
import { useState } from "react";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import Confetti from "react-confetti";

export const Board = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setClient] = useState(false);

  const confetti = () => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
    setClient(true);
    setTimeout(() => {
      setClient(false);
    }, 7000);
  };

  const { address } = useAccount();

  const { data: balance } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "getBalance",
  });

  const { data: currentCard } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "currentCard",
  });

  const { data: currentPlayers } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "getCurrentPlayers",
  });

  const { data: startGame } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "startGame",
  });

  const { data: winner } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "isWinner",
  });

  const { data: isPay } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "isPay",
    args: [address],
  });

  const { data: playerCards } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "getPlayerCards",
    args: [address],
  });

  const { writeAsync: playGame } = useScaffoldContractWrite({
    contractName: "PartyCardCrasher",
    functionName: "playGame",
    value: "0.001",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: drawCard } = useScaffoldContractWrite({
    contractName: "PartyCardCrasher",
    functionName: "drawCard",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: claimPrize } = useScaffoldContractWrite({
    contractName: "PartyCardCrasher",
    functionName: "claimPrize",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
  return (
    <div>
      {isClient && <Confetti width={dimensions.width} height={dimensions.height} />}
      <div className="flex">
        <div>
          {currentPlayers?.map((playerAddress: any, index: any) => {
            return address !== playerAddress && <Player address={playerAddress} yourAddress={address} key={index} />;
          })}
        </div>
        <div>
          {!isPay && (
            <button
              className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
              onClick={() => playGame()}
            >
              Play Game (0.001 ETH)
            </button>
          )}

          {currentPlayers?.length <= 1 && (
            <>
              <h2 className="mt-12 text-md">
                Total Number of Players: <strong>{currentPlayers?.length}</strong>{" "}
              </h2>
              <h1 className="mt-12 text-4xl ">Waiting for more players to join...</h1>
            </>
          )}

          {currentPlayers?.length > 1 && (
            <>
              <div className="flex justify-between">
                <h2 className="mt-3 text-4xl">Reward</h2>
                <h2 className="mt-6 text-md">
                  Total Number of Players: <strong>{currentPlayers?.length}</strong>{" "}
                </h2>
              </div>

              <p className="mt-3 text-2xl">{(balance?.toString() as any) / 10 ** 18} ETH</p>
              <h2 className="mt-3 text-4xl">Discard Pile</h2>
              <Card key={"99"} id={99} content={currentCard?.toString()} index={99} startGame={startGame} />
              {isPay && currentPlayers?.length > 1 && (
                <div>
                  <h2 className="mt-4 text-3xl">Your Cards</h2>
                  <button
                    className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                    onClick={() => drawCard()}
                  >
                    Draw Card
                  </button>
                </div>
              )}
              <div className="flex flex-wrap  mt-3" style={{ width: "350px" }}>
                {playerCards &&
                  playerCards.map((val: any, index: any) => (
                    <Card
                      key={index}
                      id={index}
                      content={val.toString()}
                      index={index}
                      startGame={startGame}
                      currentCard={currentCard?.toString()}
                    />
                  ))}
              </div>
              {winner === address && (
                <button
                  className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
                  onClick={confetti}
                  // onClick={() => claimPrize()}
                >
                  Claim Reward
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
