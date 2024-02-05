//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract PartyCardCrasher {
  // State Variables
  address public immutable owner;
  uint256 public currentCard = 5;
  bool public startGame;
  mapping(address => uint256[]) public playerCards;
  mapping(address => bool) public isPay;
  address[] public currentPlayers;
  address public isWinner;

  constructor(address _owner) {
    owner = _owner;
  }

  modifier isOwner() {
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  function playGame() public payable {
    require(!isPay[msg.sender], "You already paid");
    require(msg.value >= 0.001 ether, "Failed to send enough value");

    isPay[msg.sender] = true;
    uint256[] memory cards = drawCards(7);
    playerCards[msg.sender] = cards;
    currentPlayers.push(msg.sender);

    if (currentPlayers.length > 1) startGame = true;
    if (currentPlayers.length > 2) {
      for (uint i = 0; i < currentPlayers.length; i++) {
        if (currentPlayers[i] != msg.sender) {
          uint256[] memory draw2cards = drawCards(2);
          playerCards[currentPlayers[i]].push(draw2cards[0]);
          playerCards[currentPlayers[i]].push(draw2cards[1]);
        }
      }
    }
  }

  function playCard(uint256 index) public {
    require(index < playerCards[msg.sender].length, "You do not have this card");
    require(startGame, "Must have at least 2 players");
    require(
      playerCards[msg.sender][index] == currentCard + 1 ||
      playerCards[msg.sender][index] == currentCard - 1 ||
      currentCard == 9 && playerCards[msg.sender][index] == 1 ||
      currentCard == 1 && playerCards[msg.sender][index] == 9, "Invalid Play");

    currentCard = playerCards[msg.sender][index];

    for (uint i = index; i < playerCards[msg.sender].length - 1; i++) {
      playerCards[msg.sender][i] = playerCards[msg.sender][i + 1];
    }

    playerCards[msg.sender].pop();

    if(playerCards[msg.sender].length == 0) isWinner = msg.sender;
  }

  function drawCard() public {
    uint256 _randomNumber = uint(keccak256(abi.encode(block.timestamp, msg.sender))) % 9;
    playerCards[msg.sender].push(_randomNumber + 1);
  }

  function drawCards(uint numberOfCards) internal view returns (uint256[] memory) {
    uint256[] memory currentCards = new uint256[](numberOfCards);

    for(uint i = 0; i < numberOfCards; i++){
      uint256 _randomNumber = uint(keccak256(abi.encode(block.timestamp, msg.sender, i))) % 9;
      currentCards[i] = _randomNumber + 1;
    }

    return currentCards;
  }

  function getPlayerCards(address player) public view returns (uint256[] memory) {
    return playerCards[player];
  }

  function getCurrentPlayers() public view returns (address[] memory) {
    return currentPlayers;
  }

  function getBalance() public view returns (uint) {
    return address(this).balance;
  }

  function claimPrize() public {
    require(isWinner == msg.sender, "Not a winner");
    (bool sent,) = msg.sender.call{value: address(this).balance}("");
    require(sent, "It did not work");
  }

  /**
   * Function that allows the owner to withdraw all the Ether in the contract
   * The function can only be called by the owner of the contract as defined by the isOwner modifier
   */
  function withdraw() public isOwner {
    (bool success, ) = owner.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable {}
}
