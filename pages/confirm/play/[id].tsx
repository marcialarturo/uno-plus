import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ConfirmChange: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { writeAsync: moveItem } = useScaffoldContractWrite({
    contractName: "PartyCardCrasher",
    functionName: "playCard",
    args: [id as any],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const handleYes = async () => {
    await moveItem();
    router.push("/example-ui");
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-2xl mb-2">Are you sure to play {id}?</span>
        </h1>

        <button
          className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={handleYes}
        >
          Yes
        </button>
        <button
          className="py-2 px-16 mb-1 mt-3 bg-gray-300 rounded baseline hover:bg-gray-200 disabled:opacity-50"
          onClick={() => router.push("/example-ui")}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmChange;
