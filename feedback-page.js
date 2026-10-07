let selectedRating = 0;
document.querySelectorAll(".rating-stars button").forEach((button) => button.addEventListener("click", () => {
  selectedRating = Number(button.dataset.rating);
  document.querySelectorAll(".rating-stars button").forEach((star) => {
    const active = Number(star.dataset.rating) <= selectedRating;
    star.classList.toggle("active", active);
    star.setAttribute("aria-pressed", String(Number(star.dataset.rating) === selectedRating));
  });
  document.querySelector("#ratingPrompt").textContent = `คุณให้ ${selectedRating} ดาว`;
}));
document.querySelector("#feedbackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedRating) {
    document.querySelector("#ratingPrompt").textContent = "กรุณาเลือกคะแนนก่อนส่งความคิดเห็น";
    window.streetBarberToast("เลือกคะแนน 1–5 ดาวก่อนส่งความคิดเห็น");
    return;
  }
  window.streetBarberToast(selectedRating <= 2
    ? "ส่งความคิดเห็นถึงผู้จัดการโดยตรงแล้ว ขอบคุณที่ช่วยให้เราปรับปรุง"
    : "ขอบคุณสำหรับความคิดเห็น แล้วพบกันใหม่ครับ!");
  event.currentTarget.reset();
  selectedRating = 0;
  document.querySelector("#ratingPrompt").textContent = "เลือกคะแนน 1–5 ดาว";
  document.querySelectorAll(".rating-stars button").forEach((star) => {
    star.classList.remove("active");
    star.removeAttribute("aria-pressed");
  });
});
