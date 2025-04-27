let cardData = [];

document.addEventListener('DOMContentLoaded', function () {
  fetch('/random_cards')
    .then(response => response.json())
    .then(cards => {
      // Clear the card container before adding new cards
      const cardContainer = document.getElementById('card-container');
      cardContainer.innerHTML = '';  // Clear previous cards

      // Loop over the fetched cards and create new card elements
      cards.forEach(profile => {
        console.log(profile);
        cardData.push(profile);
      });
    })
    .catch(error => {
      console.error('Error fetching random cards:', error);
    });
});

const container = document.getElementById('card-container');
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
  
  // Show the modal
  modal.style.display = 'block';

  const current_card = cardData[0];
  console.log(current_card);
  // Update the modal content dynamically
  document.getElementById('modal-img').src = current_card['img'];
  document.getElementById('modal-name').textContent = current_card['name'];
  document.getElementById('modal-age').textContent = current_card['age'];
  document.getElementById('modal-bio').textContent = current_card['bio'];
}

function closeModal() {
  const modal = document.getElementById('modal')
  modal.style.display = 'none';
}

function swipeCard(direction) {
  const card = container.querySelector('.card');
  if (!card) return;

  const distance = direction === 'right' ? 500 : -500;
  const rotation = direction === 'right' ? 30 : -30;

  card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  card.style.transform = `translateX(${distance}px) rotate(${rotation}deg)`;
  card.style.opacity = '0';

  if(direction == 'right') {
    cardLikes++;
    document.getElementById('like-count').innerHTML = cardLikes;
  }

  setTimeout(() => {
      card.remove();
      shiftCards();
  }, 300);
}

function shiftCards() {
  // Remove top card, add next one
  if (cardIndex < cardData.length) {
      const newCard = createCard(cardData[cardIndex++]);
      container.appendChild(newCard);
  }

  // Re-apply stack transforms for the remaining cards
  const cards = Array.from(container.querySelectorAll('.card'));
  cards.slice(-3).forEach((card, i) => {
      card.style.transform = '';
      card.style.zIndex = 3 - i;
      if (i === 1) {
          card.style.transform = 'scale(0.95) translateY(10px)';
      } else if (i === 2) {
          card.style.transform = 'scale(0.9) translateY(20px)';
      }
  });
}

// Load initial 3 cards
for (let i = 0; i < 3 && cardIndex < cardData.length; i++) {
  const card = createCard(cardData[cardIndex++]);
  container.appendChild(card);
}