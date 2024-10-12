const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let isGameOver = false;

// 덱 생성 및 섞기
function createDeck() {
    deck = suits.flatMap(suit => values.map(value => ({ suit, value })));
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// 카드 값 계산
function getCardValue(card) {
    if (card.value === "Ace") return 11;
    if (["King", "Queen", "Jack"].includes(card.value)) return 10;
    return parseInt(card.value);
}

function calculateHandValue(hand, hideDealerFirstCard = false) {
    let total = 0;
    let aceCount = 0;

    hand.forEach((card, index) => {
        if (!(hideDealerFirstCard && index === 0)) {
            total += getCardValue(card);
            if (card.value === "Ace") aceCount++;
        }
    });

    // Ace는 1 또는 11로 계산되기 때문에 21을 넘으면 1로 계산
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// 게임 상태 업데이트
function updateScores(hideDealerFirstCard = true) {
    playerScore = calculateHandValue(playerHand);
    dealerScore = calculateHandValue(dealerHand, hideDealerFirstCard);

    document.getElementById("player-score").innerText = `Score: ${playerScore}`;
    document.getElementById("dealer-score").innerText = hideDealerFirstCard ? "?" : dealerScore;
}

// 카드 표시
function displayCards(hideDealerFirstCard = true) {
    const playerCardsDiv = document.getElementById("player-cards");
    const dealerCardsDiv = document.getElementById("dealer-cards");

    playerCardsDiv.innerHTML = playerHand.map(card => `<div class="card">${card.value} of ${card.suit}</div>`).join('');

    dealerCardsDiv.innerHTML = dealerHand.map((card, index) => {
        if (hideDealerFirstCard && index === 0) {
            return `<div class="card">Hidden</div>`;  // 첫 번째 카드를 숨김
        }
        return `<div class="card">${card.value} of ${card.suit}</div>`;
    }).join('');
}

function dealInitialCards() {
    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    updateScores(true);
    displayCards(true);
}

// Hit 버튼 클릭 시
function hit() {
    if (isGameOver) return;

    playerHand.push(deck.pop());
    updateScores(true);
    displayCards(true);

    if (playerScore > 21) {
        endGame("Player busts! Dealer wins!");
    }
}

// Stand 버튼 클릭 시
function stand() {
    if (isGameOver) return;

    // 딜러가 17 이상 될 때까지 카드 받기
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        updateScores(false);
        displayCards(false);
    }

    if (dealerScore > 21) {
        endGame("Dealer busts! Player wins!");
    } else if (dealerScore >= playerScore) {
        endGame("Dealer wins!");
    } else {
        endGame("Player wins!");
    }
}

// 게임 종료
function endGame(message) {
    isGameOver = true;
    document.getElementById("message").innerText = message;

    // 게임이 끝났을 때 딜러의 가려진 카드를 공개
    updateScores(false);
    displayCards(false);
}

// 게임 재시작
function restartGame() {
    deck.length = 0;
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    isGameOver = false;

    document.getElementById("message").innerText = "";

    createDeck();
    shuffleDeck();
    dealInitialCards();
}

// 초기 설정
document.getElementById("hit-button").addEventListener("click", hit);
document.getElementById("stand-button").addEventListener("click", stand);
document.getElementById("restart-button").addEventListener("click", restartGame);

createDeck();
shuffleDeck();
dealInitialCards();
