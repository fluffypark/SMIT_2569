const filterButtons = document.querySelectorAll(".filter-chip");
const styleCards = document.querySelectorAll(".style-card");
const search = document.querySelector("#styleSearch");
let activeFilter = "all";

function filterStyles() {
  const query = (search.value || "").trim().toLowerCase();
  styleCards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.tags.split(" ").includes(activeFilter);
    const matchesQuery = card.dataset.name.includes(query) || card.textContent.toLowerCase().includes(query);
    card.classList.toggle("hidden", !(matchesFilter && matchesQuery));
  });
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  document.querySelector(".filter-chip.active")?.classList.remove("active");
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  filterStyles();
}));
search.addEventListener("input", filterStyles);
document.querySelectorAll(".style-image > button").forEach((button) => button.addEventListener("click", () => {
  const saved = button.classList.toggle("saved");
  button.textContent = saved ? "♥" : "♡";
  window.streetBarberToast(saved ? "บันทึกทรงผมไว้ในรายการโปรดแล้ว" : "นำทรงผมออกจากรายการโปรดแล้ว");
}));
