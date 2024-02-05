import type { NextPage } from "next";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { MetaHeader } from "~~/components/MetaHeader";
import { Board } from "~~/components/board/Board";

const ExampleUI: NextPage = () => {
  return (
    <>
      <MetaHeader title="Game" description="Game created with 🏗 Scaffold-ETH 2, showcasing some of its features.">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex flex-col items-center">
        <DndProvider backend={HTML5Backend}>
          <Board />
        </DndProvider>
      </div>
    </>
  );
};

export default ExampleUI;
