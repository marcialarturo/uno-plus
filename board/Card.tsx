import { useRef } from "react";
import { useRouter } from "next/router";
import { useDrag, useDrop } from "react-dnd";

export const Card = ({ id, content, index, startGame, currentCard }: any) => {
  const router = useRouter();

  const handleDrop = async (item: any, index: any) => {
    console.log(item, index);
    router.push("/confirm/play/" + item.id);
  };

  const canMove = () => {
    if (index === 99) return true;
    return false;
  };

  const canPlay = () => {
    if (
      +content === +currentCard + 1 ||
      +content === +currentCard - 1 ||
      (+currentCard === 9 && +content === 1) ||
      (+currentCard === 1 && +content === 9)
    )
      return true;
    return false;
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CELL",
    item: { id, index, content },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "CELL",
    drop: item => handleDrop(item, index),
    canDrop: () => canMove(),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const cellRef = useRef(null);

  drag(drop(cellRef));

  return (
    <div
      ref={cellRef}
      className="w-16 h-20 border border-gray-300 flex items-center justify-center font-bold mr-2 mb-2 relative"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        background: canPlay() ? "#00cc99" : "white",
      }}
    >
      {content}
      {isOver && canDrop && startGame && (
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "blue",
          }}
        />
      )}
      {!isOver && canDrop && startGame && (
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "yellow",
          }}
        />
      )}
      {isOver && !canDrop && !startGame && (
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: "red",
          }}
        />
      )}
    </div>
  );
};
