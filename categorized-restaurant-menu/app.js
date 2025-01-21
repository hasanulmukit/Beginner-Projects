const sectionCenter = document.querySelector('.section-center');
const btnContainer = document.querySelector('.btn-container');

window.addEventListener('DOMContentLoaded', () => {
  fetch('./menu.json')
    .then((response) => response.json())
    .then((menu) => {
      displayMenuItems(menu);
      displayMenuButtons(menu);
    });
});

window.addEventListener("load", () => {
  const sections = document.querySelectorAll(".section-center");
  sections.forEach((section) => {
    const items = section.querySelectorAll(".menu-item");
    if (items.length === 1 || items.length === 2) {
      section.style.gridTemplateColumns = `repeat(${items.length}, minmax(300px, 1fr))`;
    }
  });
});

function displayMenuItems(menuItems) {
  const displayMenu = menuItems.map((item) => `
    <article class="menu-item">
      <img src="${item.img}" alt="${item.title}" class="photo" />
      <div class="item-info">
        <h4>${item.title} <span class="price">$${item.price}</span></h4>
        <p class="item-text">${item.desc}</p>
      </div>
    </article>
  `).join('');
  sectionCenter.innerHTML = displayMenu;
}

function displayMenuButtons(menu) {
  const categories = ['all', ...new Set(menu.map((item) => item.category))];
  const categoryButtons = categories.map((category) => `
    <button class="filter-btn" data-id="${category}">${category}</button>
  `).join('');
  btnContainer.innerHTML = categoryButtons;

  const filterButtons = btnContainer.querySelectorAll('.filter-btn');
  filterButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.id;
      const menuCategory = category === 'all' ? menu : menu.filter((item) => item.category === category);
      displayMenuItems(menuCategory);
    });
  });
}
