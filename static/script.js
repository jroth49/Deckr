let cardData = [];
let container = document.getElementById('card-container');
let likedCards = [];

document.addEventListener('DOMContentLoaded', function () {
  // Show the loading spinner before starting the fetch request
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.style.display = 'block';

  fetch('/random_cards')
    .then(response => response.json())
    .then(cards => {
      cardData = cards;
      updateCardContainer();

      // Hide the loading spinner once the cards are fetched
      loadingSpinner.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching random cards:', error);
      loadingSpinner.style.display = 'none'; // Hide the spinner in case of an error
    });
});

// Function to update the card container by creating cards from cardData
function updateCardContainer() {
  container.innerHTML = '';  // Clear any existing cards

  // Loop through the updated cardData and create cards for each item
  cardData.forEach(profile => {
    const card = createCard(profile);
    container.appendChild(card);
  });
}

let cardIndex = 0;
let cardLikes = 0;

function createCard(profile) {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.transform = '';  // Reset the card's transform for new card

  card.innerHTML = `
    <img src="${profile.img}" alt="${profile.name}" style="pointer-events:none;">
    <div class="info">
      <p><strong>Name:</strong> ${profile.name}</p>
      <p><strong>Age:</strong> ${profile.age}</p>
      <p><strong>Bio:</strong> ${profile.bio}</p>
    </div>
  `;

  addDragBehavior(card);
  return card;
}

function addDragBehavior(card) {
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
      card.style.transition = 'none';
  };

  const onMouseMove = (e) => {
      if (!isDragging) return;
      currentX = e.clientX - startX;
      card.style.transform = `translateX(${currentX}px) rotate(${currentX * 0.05}deg)`;
  };

  const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      const threshold = 120;

      if (currentX > threshold) {
          swipeCard('right');
      } else if (currentX < -threshold) {
          swipeCard('left');
      } else {
          card.style.transition = 'transform 0.3s ease';
          card.style.transform = 'translateX(0px) rotate(0deg)';
      }

      currentX = 0;
  };

  card.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

function showModal(profile) {

  const modal = document.getElementById('modal');
  const image = document.getElementById('modal-image');
  const artist = document.getElementById('modal-artist');
  const cardText = document.getElementById('modal-card-text');
  const finishes = document.getElementById('modal-finishes');
  const legalities = document.getElementById('modal-legalities');
  const name = document.getElementById('modal-name');
  const type = document.getElementById('modal-card-type');
  const rarity = document.getElementById('modal-card-rarity');
  const mana = document.getElementById('modal-card-mana-cost');
  const set = document.getElementById('modal-card-set');
  const prices = document.getElementById('modal-prices');
  const purchases = document.getElementById('modal-purchases');
  const release = document.getElementById('modal-release-date');

  let card_index = getCurrentCard();
  let card = cardData[card_index];

  console.log(card);
  // Show the modal
  modal.style.display = 'block';
  image.src = card['img'];
  artist.innerHTML = card['artist'];
  cardText.innerHTML = card['card_text'];
  name.innerHTML = card['name'];
  type.innerHTML = card['type'];
  mana.innerHTML = card['mana_cost'] != "" ? card['mana_cost']  : "N/A";
  rarity.innerHTML = card['rarity'].charAt(0).toUpperCase() + card['rarity'].slice(1);;
  release.innerHTML = card['release'];
  set.innerHTML = card['set'];
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

function swipeCard(direction) {
  const card = container.querySelector('.card');
  if (!card) return; // If no card is present, exit the function.

  const card_name = card.querySelector('img').alt;
  const distance = direction === 'right' ? 500 : -500;
  const rotation = direction === 'right' ? 30 : -30;

  card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  card.style.transform = `translateX(${distance}px) rotate(${rotation}deg)`;
  card.style.opacity = '0';

  let c_index = 0;

  // Find the card's index in the cardData array
  for (let i = 0; i < cardData.length; i++) {
    if (card_name === cardData[i]['name']) {
      c_index = i;
      break;
    }
  }

  // If the card is liked, add it to likedCards and increment cardLikes
  if (direction === 'right') {
    cardLikes++;
    likedCards.push(cardData[c_index]);
    document.getElementById('like-count').innerHTML = cardLikes;
  }

  // Remove the liked/disliked card from cardData
  cardData.splice(c_index, 1);
  console.log(cardData);
  console.log(likedCards);

  // Remove the top card and add the next one if there are still cards available
  setTimeout(() => {
    shiftCards();
  }, 300);
}

function shiftCards() {
  const cards = Array.from(container.querySelectorAll('.card'));

  // Remove the top card (first card in the stack)
  if (cards.length > 0) {
    cards[0].remove(); 
  }

  // If there are still cards left in cardData, append a new one
  if (!cardData.length > 0) {
    // If there are no more cards left, disable the swipe buttons
    document.getElementById('like-btn').disabled = true;
    document.getElementById('dislike-btn').disabled = true;
    console.log("No more cards to display.");
  }

  // Reapply the stacking and transformation logic to remaining cards
  const updatedCards = Array.from(container.querySelectorAll('.card'));
  updatedCards.forEach((card, index) => {
    card.style.transform = ''; // Reset any previous transformations
    card.style.zIndex = updatedCards.length - index; // Stack the cards properly
    if (index === 1) {
      card.style.transform = 'scale(0.95) translateY(10px)'; // Slightly smaller and lower
    } else if (index === 2) {
      card.style.transform = 'scale(0.9) translateY(20px)'; // Smaller and lower
    }
  });
}

function getCurrentCard() {
  const card = container.querySelector('.card');
  let card_name = card.querySelector('img').alt;

  let c_index = 0;

  // Find the card's index in the cardData array
  for (let i = 0; i < cardData.length; i++) {
    if (card_name === cardData[i]['name']) {
      c_index = i;
      break;
    }
  }

  return c_index;
}