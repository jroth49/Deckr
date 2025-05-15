let cardData = [];
let container = document.getElementById('card-container');
let likedCards = [];
let cardIndex = 0;
let cardLikes = 0;

const storedList = sessionStorage.getItem('likedCards');
if (storedList) {
  likedCards = JSON.parse(storedList);
  cardLikes = likedCards.length;
  document.getElementById('like-count').innerHTML = cardLikes;
}

document.addEventListener('DOMContentLoaded', function () {
  const loadingSpinner = document.getElementById('loading-spinner');
  loadingSpinner.style.display = 'block';

  fetch('/random_cards')
    .then(response => response.json())
    .then(cards => {
      cardData = cards;
      updateCardContainer();

      loadingSpinner.style.display = 'none';
    })
    .catch(error => {
      console.error('Error fetching random cards:', error);
      loadingSpinner.style.display = 'none';
    });
});

// Function to update the card container by creating cards from cardData
function updateCardContainer() {
  container.innerHTML = '';  // Clear any existing cards

  // Loop through the updated cardData and create cards for each item
  cardData.forEach(profile => {
    console.log(profile);
    const card = createCard(profile);
    container.appendChild(card);
  });
}

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

  let card_index = getCurrentCard();
  let card = cardData[card_index];

  const modal = document.getElementById('modal');

  //card info
  const name = document.getElementById('modal-name');
  const type = document.getElementById('modal-card-type');
  const rarity = document.getElementById('modal-card-rarity');
  const mana = document.getElementById('modal-card-mana-cost');
  const set = document.getElementById('modal-card-set');
  const image = document.getElementById('modal-image');
  const artist = document.getElementById('modal-artist');
  const cardText = document.getElementById('modal-card-text');
  const release = document.getElementById('modal-release-date');

  //const legalities = document.getElementById('modal-legalities');
  const alchemy = document.getElementById('modal-alchemy-legal');
  const brawl = document.getElementById('modal-brawl-legal');
  const commander = document.getElementById('modal-commander-legal');
  const duel = document.getElementById('modal-duel-legal');
  const explorer = document.getElementById('modal-explorer-legal');
  const future = document.getElementById('modal-future-legal');
  const gladiator = document.getElementById('modal-gladiator-legal');
  const historic = document.getElementById('modal-historic-legal');
  const legacy = document.getElementById('modal-legacy-legal');
  const modern = document.getElementById('modal-modern-legal');
  const oathbreaker = document.getElementById('modal-oathbreaker-legal');
  const oldschool = document.getElementById('modal-oldschool-legal');
  const pauper = document.getElementById('modal-pauper-legal');
  const paupercommander = document.getElementById('modal-paupercommander-legal');
  const penny = document.getElementById('modal-penny-legal');
  const pioneer = document.getElementById('modal-pioneer-legal');
  const predh = document.getElementById('modal-predh-legal');
  const premodern = document.getElementById('modal-premodern-legal');
  const standard = document.getElementById('modal-standard-legal');
  const standardbrawl = document.getElementById('modal-standardbrawl-legal');
  const timeless = document.getElementById('modal-timeless-legal');
  const vintage = document.getElementById('modal-vintage-legal');

  //const prices = document.getElementById('modal-prices');
  const eurPrice = document.getElementById('modal-eur-price');
  const eurFoilPrice = document.getElementById('modal-eur-foil-price');
  const tixPrice = document.getElementById('modal-tix-price');
  const usdPrice = document.getElementById('modal-usd-price');
  const usdEtchedPrice = document.getElementById('modal-usd-etched-price');
  const usdFoilPrice = document.getElementById('modal-usd-foil-price');

  //const purchases = document.getElementById('modal-purchases');
  const cardhoarderUrl = document.getElementById('modal-cardhoarder-url');
  const cardmarketUrl = document.getElementById('modal-cardmarket-url');
  const tcgplayerUrl = document.getElementById('modal-tcgplayer-url');

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

  //legalities
  alchemy.innerHTML = card['legalities']['alchemy'] === 'legal' ? '✅' : '❌';
  brawl.innerHTML = card['legalities']['brawl'] === 'legal' ? '✅' : '❌';
  commander.innerHTML = card['legalities']['commander'] === 'legal' ? '✅' : '❌';
  duel.innerHTML = card['legalities']['duel'] === 'legal' ? '✅' : '❌';
  explorer.innerHTML = card['legalities']['explorer'] === 'legal' ? '✅' : '❌';
  future.innerHTML = card['legalities']['future'] === 'legal' ? '✅' : '❌';
  gladiator.innerHTML = card['legalities']['gladiator'] === 'legal' ? '✅' : '❌';
  historic.innerHTML = card['legalities']['historic'] === 'legal' ? '✅' : '❌';
  legacy.innerHTML = card['legalities']['legacy'] === 'legal' ? '✅' : '❌';
  modern.innerHTML = card['legalities']['modern'] === 'legal' ? '✅' : '❌';
  oathbreaker.innerHTML = card['legalities']['oathbreaker'] === 'legal' ? '✅' : '❌';
  oldschool.innerHTML = card['legalities']['oldschool'] === 'legal' ? '✅' : '❌';
  pauper.innerHTML = card['legalities']['pauper'] === 'legal' ? '✅' : '❌';
  paupercommander.innerHTML = card['legalities']['paupercommander'] === 'legal' ? '✅' : '❌';
  penny.innerHTML = card['legalities']['penny'] === 'legal' ? '✅' : '❌';
  pioneer.innerHTML = card['legalities']['pioneer'] === 'legal' ? '✅' : '❌';
  predh.innerHTML = card['legalities']['predh'] === 'legal' ? '✅' : '❌';
  premodern.innerHTML = card['legalities']['premodern'] === 'legal' ? '✅' : '❌';
  standard.innerHTML = card['legalities']['standard'] === 'legal' ? '✅' : '❌';
  standardbrawl.innerHTML = card['legalities']['standardbrawl'] === 'legal' ? '✅' : '❌';
  timeless.innerHTML = card['legalities']['timeless'] === 'legal' ? '✅' : '❌';
  vintage.innerHTML = card['legalities']['vintage'] === 'legal' ? '✅' : '❌';
  
  //pricing
  eurPrice.innerHTML = card['prices']['eur'] ? `€${card['prices']['eur']}` : '—';
  eurFoilPrice.innerHTML = card['prices']['eur_foil'] ? `€${card['prices']['eur_foil']}` : '—';
  tixPrice.innerHTML = card['prices']['tix'] ? `${card['prices']['tix']} TIX` : '—';
  usdPrice.innerHTML = card['prices']['usd'] ? `$${card['prices']['usd']}` : '—';
  usdEtchedPrice.innerHTML = card['prices']['usd_etched'] ? `$${card['prices']['usd_etched']}` : '—';
  usdFoilPrice.innerHTML = card['prices']['usd_foil'] ? `$${card['prices']['usd_foil']}` : '—';

  //links
  cardhoarderUrl.innerHTML = `<a href="${card['purchase']['cardhoarder']}" target="_blank">🔗</a>`;
  cardmarketUrl.innerHTML = `<a href="${card['purchase']['cardmarket']}" target="_blank">🔗</a>`;
  tcgplayerUrl.innerHTML = `<a href="${card['purchase']['tcgplayer']}" target="_blank">🔗</a>`;

}

function toggle_mode() {
    let body = document.getElementsByTagName('body')[0];
    let header = document.getElementsByTagName('header')[0];
    let current_mode = document.getElementById('light-mode').innerHTML;
    let modal = document.getElementsByClassName('modal-content')[0];
    let tables = document.querySelectorAll('table');
    let theads = document.querySelectorAll('th');
    let tdeads = document.querySelectorAll('td');    

    if (current_mode === '🌞') {
      current_mode = '🌙';
      document.getElementById('light-mode').innerHTML = current_mode;
      body.style = 'background-color: #1F1F1F;';
      header.style = 'background-color: #1F1F1F; color: lightgrey; border-color: lightgrey;';
      modal.style = 'background-color: #1F1F1F; color: lightgrey; border-color: lightgrey;';
      tables.forEach(table => {
        table.style.backgroundColor = '#1F1F1F';
        table.style.color = 'lightgrey'; 
      });
      theads.forEach(th => {
        th.style.backgroundColor = '#1F1F1F';
        th.style.color = 'lightgrey'; 
      });
      tdeads.forEach(td => {
        td.style.backgroundColor = '#1F1F1F';
        td.style.color = 'lightgrey'; 
      });
    } else {
      current_mode = '🌞';
      document.getElementById('light-mode').innerHTML = current_mode;
      body.style = 'background-color: white;';
      header.style = 'background-color: white; color: black; border-color: #ddd;';
      modal.style = 'background-color: white; color: black; border-color: #ddd;';
      tables.forEach(table => {
        table.style.backgroundColor = 'white';
        table.style.color = 'black'; 
      });
      theads.forEach(th => {
        th.style.backgroundColor = 'white';
        th.style.color = 'black'; 
      });
      tdeads.forEach(td => {
        td.style.backgroundColor = 'white';
        td.style.color = 'black'; 
      });
    }
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
    sessionStorage.setItem('likedCards', JSON.stringify(likedCards));
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

function get_more_cards() {
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';

    fetch('/random_cards')
      .then(response => response.json())
      .then(cards => {
        cardData = cards;
        updateCardContainer(); // This should add cards to the DOM
        loadingSpinner.style.display = 'none'; // Hide spinner
        document.getElementById('like-btn').disabled = false;
        document.getElementById('dislike-btn').disabled = false;
      })
      .catch(error => {
        console.error('Error fetching random cards:', error);
        loadingSpinner.style.display = 'none'; // Hide spinner on error too
      });

      return;
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
    get_more_cards();
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