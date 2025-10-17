const pets = [
  {
    name: "Luna",
    age: "2 yrs",
    breed: "Golden Retriever",
    category: "dog",
    interests: ["Beach walks", "Agility", "Paddleboarding"],
    about:
      "Sun-loving swimmer hunting for fellow beach adventurers and active pups to share sunrise fetch sessions.",
    distance: "0.8 km",
    status: "Seeking playdates",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Milo",
    age: "4 yrs",
    breed: "Maine Coon",
    category: "cat",
    interests: ["Window birdwatching", "Puzzle toys", "Sunbathing"],
    about:
      "Curious cuddle expert excited for calm, indoor meetups and gentle introductions with fellow explorers.",
    distance: "1.5 km",
    status: "Looking to co-host play lounges",
    image:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Zephyr",
    age: "3 yrs",
    breed: "Blue Fronted Amazon",
    category: "bird",
    interests: ["Talking sessions", "Trick training", "Gliding clubs"],
    about:
      "Chatty flyer searching for vibrant flock-mates to practice mimicry and share perch time with treats.",
    distance: "3.1 km",
    status: "Ready for feathered friendships",
    image:
      "https://images.unsplash.com/photo-1585960690071-2660d37d0f5f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Nala",
    age: "1 yr",
    breed: "Australian Shepherd",
    category: "dog",
    interests: ["Trail runs", "Frisbee", "Obedience games"],
    about:
      "High-energy herder seeking mountain buddies for sunrise hikes, trick swaps, and training jam sessions.",
    distance: "2.4 km",
    status: "Open to agility teams",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pip",
    age: "5 yrs",
    breed: "Holland Lop",
    category: "other",
    interests: ["Herb gardens", "Calm cuddles", "Obstacle mazes"],
    about:
      "Gentle hopper seeking small animal socials and caretakers who adore creating enrichment nooks.",
    distance: "0.5 km",
    status: "Hosting herb tasting events",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
  },
];

const cardContainer = document.getElementById("card-container");
const chipElements = Array.from(document.querySelectorAll(".category-chip"));
const skipButton = document.querySelector(".action.reject");
const likeButton = document.querySelector(".action.like");
const tipsButton = document.querySelector(".action.info");
const tipCards = Array.from(document.querySelectorAll(".tip-card"));

let activeCards = [];
let activeCategory = "all";
let currentIndex = 0;

const getFilteredPets = () =>
  pets.filter((pet) => activeCategory === "all" || pet.category === activeCategory);

function createCard(pet, position) {
  const card = document.createElement("article");
  card.className = "pet-card";
  card.dataset.category = pet.category;
  card.dataset.position = position;
  card.innerHTML = `
    <img src="${pet.image}" alt="${pet.name}, ${pet.breed}" />
    <div class="card-body">
      <h2>${pet.name}<span>${pet.age} • ${pet.breed}</span></h2>
      <div class="card-meta">
        <div class="distance">📍 ${pet.distance}</div>
        <span>${pet.status}</span>
      </div>
      <p>${pet.about}</p>
      <div class="tag-list">
        ${pet.interests.map((tag) => `<span class="tag">${tag}</span>`).join("")}
      </div>
    </div>
  `;
  addSwipeInteractions(card);
  return card;
}

function renderCards() {
  cardContainer.innerHTML = "";
  const filtered = getFilteredPets();

  if (currentIndex >= filtered.length) {
    currentIndex = 0;
  }

  activeCards = filtered.slice(currentIndex, currentIndex + 3);

  activeCards.forEach((pet, idx) => {
    const card = createCard(pet, idx + 1);
    card.style.opacity = idx === 0 ? 1 : "";
    cardContainer.appendChild(card);
  });

  if (!activeCards.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <h3>More friends arriving soon!</h3>
      <p>Try a different filter or check back later for fresh wagging tails.</p>
    `;
    cardContainer.appendChild(emptyState);
  }
}

function advanceCard(direction) {
  if (!activeCards.length) return;

  const currentCard = cardContainer.querySelector('.pet-card[data-position="1"]');
  if (!currentCard) return;

  currentCard.classList.add("swiping");
  currentCard.style.transform = `translate(${direction === "right" ? "120%" : "-120%"}, -40px) rotate(${direction === "right" ? 12 : -12}deg)`;
  currentCard.style.opacity = "0";

  setTimeout(() => {
    const filteredLength = getFilteredPets().length;
    if (filteredLength === 0) {
      currentIndex = 0;
      renderCards();
      return;
    }

    currentIndex = (currentIndex + 1) % filteredLength;
    renderCards();
  }, 220);
}

function setActiveCategory(category) {
  activeCategory = category;
  currentIndex = 0;
  chipElements.forEach((chip) => chip.classList.toggle("active", chip.dataset.category === category));
  renderCards();
}

function addSwipeInteractions(card) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const handlePointerDown = (event) => {
    isDragging = true;
    startX = event.clientX || event.touches?.[0]?.clientX || 0;
    card.classList.add("swiping");
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;
    currentX = event.clientX || event.touches?.[0]?.clientX || 0;
    const deltaX = currentX - startX;
    const rotation = deltaX / 12;
    card.style.transform = `translate(${deltaX}px, ${Math.abs(deltaX) * -0.08}px) rotate(${rotation}deg)`;
    card.style.opacity = `${Math.max(0.4, 1 - Math.abs(deltaX) / 280)}`;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    card.classList.remove("swiping");
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > 120) {
      advanceCard(deltaX > 0 ? "right" : "left");
    } else {
      card.style.transform = "";
      card.style.opacity = "";
    }
  };

  card.addEventListener("pointerdown", handlePointerDown);
  card.addEventListener("pointermove", handlePointerMove);
  card.addEventListener("pointerup", handlePointerUp);
  card.addEventListener("pointercancel", handlePointerUp);
  card.addEventListener("touchstart", handlePointerDown, { passive: true });
  card.addEventListener("touchmove", handlePointerMove, { passive: true });
  card.addEventListener("touchend", handlePointerUp);
}

chipElements.forEach((chip) => {
  chip.addEventListener("click", () => setActiveCategory(chip.dataset.category));
  chip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveCategory(chip.dataset.category);
    }
  });
});

skipButton.addEventListener("click", () => advanceCard("left"));
likeButton.addEventListener("click", () => advanceCard("right"));
tipsButton.addEventListener("click", () => {
  tipCards.forEach((tip, index) => {
    tip.style.transitionDelay = `${index * 60}ms`;
    tip.classList.toggle("highlight");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") advanceCard("left");
  if (event.key === "ArrowRight") advanceCard("right");
});

setActiveCategory("all");
