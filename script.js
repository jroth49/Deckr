const cardData = [
    {
      img: 'https://via.placeholder.com/300x240?text=1',
      name: 'Alex',
      age: 25,
      bio: 'Enjoys long walks and coding on weekends.'
    },
    {
      img: 'https://via.placeholder.com/300x240?text=2',
      name: 'Taylor',
      age: 28,
      bio: 'Loves photography and exploring nature.'
    },
    {
      img: 'https://via.placeholder.com/300x240?text=3',
      name: 'Jordan',
      age: 30,
      bio: 'Coffee addict and bookworm.'
    },
    {
      img: 'https://via.placeholder.com/300x240?text=4',
      name: 'Sam',
      age: 26,
      bio: 'Passionate about music and travel.'
    },
    {
      img: 'https://via.placeholder.com/300x240?text=5',
      name: 'Casey',
      age: 29,
      bio: 'Designer by day, gamer by night.'
    }
  ];
  
  const container = document.getElementById('card-container');
  let cardIndex = 0;
  
  function createCard(profile) {
    const card = document.createElement('div');
    card.className = 'card';
  
    card.innerHTML = `
      <img src="${profile.img}" alt="${profile.name}">
      <div class="info">
        <p><strong>Name:</strong> ${profile.name}</p>
        <p><strong>Age:</strong> ${profile.age}</p>
        <p><strong>Bio:</strong> ${profile.bio}</p>
      </div>
    `;
  
    // Hamburger button for expanding card
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `<div></div><div></div><div></div>`;
    hamburger.onclick = () => toggleCardExpansion(card);
    
    // Emoji buttons for like and dislike
    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.innerHTML = '👍';
    likeButton.onclick = () => swipeCard('right');
    
    const dislikeButton = document.createElement('button');
    dislikeButton.className = 'dislike-btn';
    dislikeButton.innerHTML = '👎';
    dislikeButton.onclick = () => swipeCard('left');
  
    card.appendChild(hamburger);
    card.appendChild(likeButton);
    card.appendChild(dislikeButton);
  
    addDragBehavior(card);
    return card;
  }
  
  function toggleCardExpansion(card) {
    // Toggle the expanded class with animation
    if (!card.classList.contains('expanded')) {
      card.classList.add('expanded');
      // Center the card when expanding
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
    } else {
      card.classList.remove('expanded');
      // Reset container alignment after closing
      container.style.justifyContent = 'center';
      container.style.alignItems = 'center';
    }
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
  
  function swipeCard(direction) {
    const card = container.querySelector('.card');
    if (!card) return;
  
    const distance = direction === 'right' ? 500 : -500;
    const rotation = direction === 'right' ? 30 : -30;
  
    card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    card.style.transform = `translateX(${distance}px) rotate(${rotation}deg)`;
    card.style.opacity = '0';
  
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
  
    // Re-apply stack transforms
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
  