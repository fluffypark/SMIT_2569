document.querySelectorAll(".redeem-button").forEach((button) => button.addEventListener("click", () => {
  const member = window.streetBarberMember();
  if (!member) {
    window.streetBarberToast(`เข้าสู่ระบบเพื่อแลก ${button.dataset.points} คะแนน`);
    return;
  }
  window.streetBarberToast(`รับคำขอแลกรางวัล ${button.dataset.points} คะแนนแล้ว · ตัวอย่างสำหรับโปรโตไทป์`);
}));
