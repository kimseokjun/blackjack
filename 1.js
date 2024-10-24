let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let totalCoins = 1000;
let currentBet = 0;
let isGameOver = false;
let isGameStarted = false;

// 카드 덱 생성
function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    
    deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ suit, value });
        });
    });
    
    deck = shuffle(deck);
}

// 카드 덱 섞기
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// 게임 시작
function startGame() {
    if (totalCoins == 0 && currentBet == 0)  {
        alert("게임을 시작하기에 돈이 충분하지 않습니다.");
        return;
    }

    createDeck();
    playerHand = [];
    dealerHand = [];
    isGameOver = false;
    isGameStarted = true;

    // 카드 분배
    playerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    updateScores();
    displayCards();
}

// 베팅하기
function placeBet(amount) {
    if (totalCoins >= amount) {
        currentBet += amount;
        totalCoins -= amount;
        updateBettingDisplay();
    } else {
        alert("베팅할 코인 부족!");
    }
}

// 카드 점수 계산
function getCardValue(card) {
    if (card.value === 'Ace') return 11;
    if (['King', 'Queen', 'Jack'].includes(card.value)) return 10;
    return parseInt(card.value);
}

// 핸드 점수 계산
function calculateHandValue(hand) {
    let total = 0;
    let aceCount = 0;

    hand.forEach(card => {
        total += getCardValue(card);
        if (card.value === 'Ace') aceCount++;
    });

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}

// 점수 업데이트
function updateScores() {
    playerScore = calculateHandValue(playerHand);
    dealerScore = calculateHandValue(dealerHand);

    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = isGameOver ? dealerScore : "??";
}

// 카드 화면에 표시
function displayCards() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');

    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    playerHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.textContent = `${card.value} of ${card.suit}`;
        playerCardsDiv.appendChild(cardDiv);
    });

    dealerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.textContent = isGameOver || index !== 0 ? `${card.value} of ${card.suit}` : 'Hidden';
        dealerCardsDiv.appendChild(cardDiv);
    });
}

// Hit 버튼 눌렀을 때
function hit() {
    if (isGameOver || !isGameStarted) return;

    playerHand.push(deck.pop());
    updateScores();
    displayCards();

    if (playerScore > 21) {
        endGame("Player busts! Dealer wins!");
    }
}

// Stand 버튼 눌렀을 때
function stand() {
    if (isGameOver || !isGameStarted) return;

    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        updateScores();
        displayCards();
    }

    if (dealerScore > 21) {
        endGame("Dealer busts! Player wins!");
    } else if (dealerScore >= playerScore) {
        endGame("Dealer wins!");
    } else {
        endGame("Player wins!");
    }
}
// 카드 이미지를 표시하는 함수
function displayCards() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');

    playerCardsDiv.innerHTML = ''; // 기존 카드를 지우고 새로 추가
    dealerCardsDiv.innerHTML = '';

    // 플레이어 카드 출력
    playerHand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.style.backgroundImage = `url('images/${getCardImageName(card)}')`; // 이미지 파일 경로
        playerCardsDiv.appendChild(cardDiv);
    });

    // 딜러 카드 출력 (첫 카드는 가려진 상태로)
    dealerHand.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        if (isGameOver || index !== 0) {
            cardDiv.style.backgroundImage = `url('images/${getCardImageName(card)}')`; // 가려지지 않은 카드
        } else {
            cardDiv.style.backgroundImage = `url('images/back_of_card.png')`; // 첫 카드는 가려진 상태로
        }
        dealerCardsDiv.appendChild(cardDiv);
    });
}

// 카드 이미지 파일명 생성 함수
function getCardImageName(card) {
    const valueName = card.value.toLowerCase();  // 소문자로 변환 (예: 2, 3, ..., jack, queen, king, ace)
    const suitName = card.suit.toLowerCase();  // 소문자로 변환 (예: hearts, diamonds, clubs, spades)
    return `${valueName}_of_${suitName}.png`;  // 예: 2_of_hearts.png, ace_of_spades.png
}
// 게임 종료
function endGame(result) {
    isGameOver = true;
    isGameStarted = false;
    updateScores();
    displayCards();

    if (result.includes("Player wins!")) {
        totalCoins += currentBet * 1.5;  // 이겼을 때 베팅 금액의 1.5배 돌려줌
    }

    currentBet = 0;
    updateBettingDisplay();
    document.getElementById('game-result').textContent = result;

    // Hit/Stand 버튼 비활성화
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;

    // 재시작 버튼 표시
    document.getElementById('restart-button').style.display = 'inline-block';
}

// 게임 재시작 함수
function restartGame() {
    // 카드 및 점수 초기화
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    
    // 화면에 남아 있는 카드 제거
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    // 점수 표시 초기화
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('dealer-score').textContent = '??';

    // 게임 결과 초기화
    document.getElementById('game-result').textContent = '';

    // 베팅 금액도 초기화하고, 게임을 다시 시작할 수 있도록 준비
    currentBet = 0;
    document.getElementById('current-bet').textContent = currentBet;

    // 게임 버튼들 다시 활성화
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;
    document.getElementById('start-button').style.display = 'block';
    document.getElementById('restart-button').style.display = 'none';

    // 기타 필요한 초기화 작업
    isGameOver = false;
    deck = createDeck();  // 새로운 덱 생성
    shuffleDeck(deck);    // 덱 셔플
}


// 베팅 상태 업데이트
function updateBettingDisplay() {
    document.getElementById('current-bet').textContent = currentBet;
    document.getElementById('total-coins').textContent = totalCoins;
}
