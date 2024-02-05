import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-5xl font-bold">Uno Plus</span>
          </h1>
          <Image alt="Game" width={400} height={400} src="/assets/game.png" />
          <p className="text-center text-lg">Be the first player to get rid of all your cards to win</p>
          <div className="flex justify-center mb-6">
            <Link
              href="/example-ui"
              passHref
              className=" py-2 px-16 mb-1 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            >
              Play
            </Link>
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="text-center">
            <h2 className="mt-3 mb-3 text-4xl">How to play?</h2>
          </div>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>Each player draw 7 cards</li>
              <li>
                You can play a card from your hand onto the discard pile that is either 1 point higher or 1 point lower
                than the current card on top of the discard pile
              </li>
              <li>If the card on top of the discard pile is a 9, you can play a 1 card from your hand.</li>
              <li>If the card on top of the discard pile is a 1, you can play a 9 card from your hand.</li>
              <li>When a new player enters the game, each player draws 2 cards</li>
              <li>The game continues until a player successfully plays all their cards</li>
            </ul>
          </div>
          <p className="text-3xl text-center mb-3">Requirements</p>
          <div className="flex justify-center">
            <ul className="list-disc" style={{ width: "600px" }}>
              <li>There must be least 2 players to start the game</li>
              <li>It cost 0.001 ETH to play</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
