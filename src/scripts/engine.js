const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  typeOnTheBattle: {
    playerType: document.querySelector(".playerTypeOnTheBattle"),
    computerType: document.querySelector(".computerTypeOnTheBattle"),
  },
};

document.addEventListener("mouseover", (e) => {
  const el = e.target
  if (!el.classList.contains("card")) {
    state.cardSprites.avatar.style.opacity = 0
    hiddenCardDetails()
  }
})

const pathImages = "./src/assets/icons/"

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement("img")
  cardImage.setAttribute("height", "100px")
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png")
  cardImage.setAttribute("data-id", idCard) //data-id -> id é o nome de sua escolha, para recuperar depois.
  cardImage.classList.add("card")

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(idCard)
      state.cardSprites.avatar.style.opacity = 1
    })

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"))
    })
  } 

  return cardImage
}

async function hiddenCardDetails() {
  state.cardSprites.name.innerText = ""
  state.cardSprites.type.innerText = ""
  state.cardSprites.avatar.src = ""
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerText = `Attribute : ${cardData[index].type}`
}

async function setCardsField(cardId) {
  await removeAllCardsImages()

  let computerCardId = await getRandomCardId()

  hiddenCardDetails()

  state.fieldCards.player.style.display = "block"
  state.fieldCards.computer.style.display = "block"

  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img

  state.typeOnTheBattle.playerType.innerText = cardData[cardId].type
  state.typeOnTheBattle.computerType.innerText = cardData[computerCardId].type

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()

  await drawButton(duelResults)

  await playAudio(duelResults)
}

async function updateScore() {
  state.score.scoreBox.innerText =`Win : ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase()
  state.actions.button.style.display = "block"
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw"
  let playerCard = cardData[playerCardId]
  
  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win"
    state.score.playerScore++

  }
  else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose"
    state.score.computerScore++
  }
  
  return duelResults
}

async function removeAllCardsImages() {
  let {player1BOX, computerBOX} = state.playerSides
  let imgElements = computerBOX.querySelectorAll("img")
  imgElements.forEach((img) => img.remove());
  
  imgElements = player1BOX.querySelectorAll("img")
  imgElements.forEach((img) => img.remove());
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0 ; i < cardNumbers ; i++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)
    
    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {

  state.cardSprites.avatar.src = ""

  state.actions.button.style.display = "none"

  state.typeOnTheBattle.playerType.innerText = ""
  state.typeOnTheBattle.computerType.innerText = ""

  init()
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`)
  audio.volume = 0.2

  try {
    audio.play()
  } catch {}

}

function init() {

  state.cardSprites.avatar.style.opacity = 0

  state.fieldCards.player.style.display = "none"
  state.fieldCards.computer.style.display = "none"

  drawCards(5, state.playerSides.player1)
  drawCards(5, state.playerSides.computer)
}

init()