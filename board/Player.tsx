import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

export const Player = ({ address }: any) => {
  const { data: playerCards } = useScaffoldContractRead({
    contractName: "PartyCardCrasher",
    functionName: "getPlayerCards",
    args: [address],
  });

  return (
    <div className="bg-yellow-200 p-5 m-5">
      <p>
        {address.slice(0, 3)}...{address.slice(37, 42)}
      </p>
      <p>{playerCards?.length} Cards</p>
    </div>
  );
};
