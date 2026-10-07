const dateOptions = document.querySelector("#dateOptions");
if (dateOptions) {
  const morningGrid = document.querySelector("#timeGrid");
  const afternoonGrid = document.querySelector("#afternoonGrid");
  const bookButton = document.querySelector("#bookButton");
  const modal = document.querySelector("#bookingModal");
  const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const times = { morning: ["10:00", "10:30", "11:00", "11:30", "12:00"], afternoon: ["13:00", "14:00", "15:00", "16:00", "17:00"] };
  let dateOffset = 0;
  let selectedDate = null;
  let selectedTime = null;
  let selectedBarber = "พี่เจ";

  function datesFromOffset(offset) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + offset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }

  function displayDate(date) {
    return `${days[date.getDay()]} ${date.getDate()} ${date.toLocaleDateString("th-TH", { month: "short" })}`;
  }

  function updateSummary() {
    document.querySelector("#summaryBarber").textContent = selectedBarber;
    document.querySelector("#summaryDate").textContent = selectedDate ? displayDate(selectedDate) : "เลือกวันที่";
    document.querySelector("#summaryTime").textContent = selectedTime || "เลือกเวลา";
    bookButton.disabled = !(selectedDate && selectedTime);
  }

  function renderDates() {
    dateOptions.replaceChildren();
    datesFromOffset(dateOffset).forEach((date, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `date-option${selectedDate?.toDateString() === date.toDateString() ? " selected" : ""}`;
      button.innerHTML = `<span>${index === 0 && dateOffset === 0 ? "วันนี้" : days[date.getDay()]}</span><b>${date.getDate()}</b>`;
      button.addEventListener("click", () => {
        selectedDate = date;
        selectedTime = null;
        renderDates();
        renderTimes();
        updateSummary();
      });
      dateOptions.append(button);
    });
  }

  function renderGrid(container, values, unavailable) {
    container.replaceChildren();
    values.forEach((time, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `time-slot${selectedTime === time ? " selected" : ""}`;
      button.textContent = time;
      button.disabled = unavailable.includes(index);
      button.addEventListener("click", () => {
        selectedTime = time;
        renderTimes();
        updateSummary();
      });
      container.append(button);
    });
  }

  function renderTimes() {
    const dateKey = selectedDate ? selectedDate.getDate() : new Date().getDate();
    renderGrid(morningGrid, times.morning, dateKey % 3 === 0 ? [1, 3] : [2]);
    renderGrid(afternoonGrid, times.afternoon, dateKey % 2 === 0 ? [0] : [3]);
  }

  function changeDateWindow(amount) {
    dateOffset = Math.max(0, dateOffset + amount);
    selectedDate = null;
    selectedTime = null;
    renderDates();
    renderTimes();
    updateSummary();
  }

  document.querySelector("#prevDates").addEventListener("click", () => changeDateWindow(-7));
  document.querySelector("#nextDates").addEventListener("click", () => changeDateWindow(7));
  document.querySelectorAll(".barber-card").forEach((button) => button.addEventListener("click", () => {
    document.querySelector(".barber-card.selected")?.classList.remove("selected");
    button.classList.add("selected");
    selectedBarber = button.dataset.barber;
    updateSummary();
  }));
  bookButton.addEventListener("click", () => {
    if (!selectedDate || !selectedTime) return;
    document.querySelector("#modalBarber").textContent = selectedBarber;
    document.querySelector("#modalDateTime").textContent = `${displayDate(selectedDate)} · ${selectedTime}`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  document.querySelector("#closeModal").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  document.querySelector("#payButton").addEventListener("click", () => {
    const member = window.streetBarberMember();
    if (member) {
      const booking = {
        id: `SB-${Date.now()}`,
        date: selectedDate.toISOString(),
        time: selectedTime,
        barber: selectedBarber,
        service: "ตัดผม + สระ",
        status: "รอยืนยัน",
      };
      member.bookings = [...(member.bookings || []), booking];
      localStorage.setItem("street-barber-member", JSON.stringify(member));
      const accounts = JSON.parse(localStorage.getItem("street-barber-accounts") || "[]");
      const accountIndex = accounts.findIndex((account) => account.email === member.email);
      if (accountIndex >= 0) {
        accounts[accountIndex] = member;
        localStorage.setItem("street-barber-accounts", JSON.stringify(accounts));
      }
    }
    closeModal();
    window.streetBarberToast(member
      ? "บันทึกคิวตัวอย่างแล้ว ดูรายละเอียดได้ที่บัญชีของฉัน"
      : "บันทึกคิวตัวอย่างแล้ว — สมัครสมาชิกเพื่อเก็บประวัติการจอง");
  });

  renderDates();
  renderTimes();
  updateSummary();
}
