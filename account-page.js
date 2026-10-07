const account = window.streetBarberMember();
const dashboard = document.querySelector("#accountDashboard");
const locked = document.querySelector("#accountLocked");

function escapeText(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML;
}

function displayMember() {
  if (!account) {
    locked.hidden = false;
    dashboard.hidden = true;
    document.querySelector(".account-heading .button").hidden = true;
    return;
  }
  locked.hidden = true;
  dashboard.hidden = false;
  document.querySelector("#accountName").textContent = account.name || "สมาชิก";
  document.querySelector("#accountEmail").textContent = account.email;
  document.querySelector("#accountPhone").textContent = account.phone || "เพิ่มเบอร์โทรศัพท์ในข้อมูลสมาชิก";
  document.querySelector("#accountAvatar").textContent = (account.name || account.email).charAt(0).toUpperCase();
  const tier = account.tier || "Bronze";
  const points = Number(account.points) || 0;
  document.querySelector("#accountTier").textContent = `${tier.toUpperCase()} MEMBER`;
  document.querySelector("#accountPoints").textContent = points.toLocaleString();
  document.querySelector("#accountGreeting").textContent = `ยินดีต้อนรับ ${account.name || account.email} — นี่คือสไตล์และการนัดหมายของคุณ`;
  const thresholds = { Bronze: 5000, Silver: 15000, Gold: 30000, "VIP Club": 30000 };
  const target = thresholds[tier] || thresholds.Bronze;
  const spend = Number(account.spend) || 0;
  const percent = tier === "VIP Club" ? 100 : Math.min(100, Math.round((spend / target) * 100));
  document.querySelector("#accountProgress").style.width = `${percent}%`;
  document.querySelector("#accountProgressText").textContent = tier === "VIP Club"
    ? "คุณอยู่ในระดับสูงสุดแล้ว"
    : `ยอดสะสม ฿${spend.toLocaleString()} · อีก ฿${Math.max(0, target - spend).toLocaleString()} สู่ระดับถัดไป`;
  renderAppointments(account.bookings || []);
  renderHistory();
}

function renderAppointments(bookings) {
  const container = document.querySelector("#accountAppointments");
  const futureBookings = bookings.filter((booking) => booking.status !== "ยกเลิก" && booking.status !== "เสร็จสิ้น");
  if (!futureBookings.length) {
    container.innerHTML = `<div class="empty-appointments"><span>✂</span><div><b>ยังไม่มีคิวที่กำลังจะมาถึง</b><small>เลือกวันและเวลาที่สะดวกเพื่อจองบริการครั้งถัดไป</small></div><a href="booking.html">จองคิว ↗</a></div>`;
    return;
  }
  container.innerHTML = futureBookings.map((booking) => {
    const date = new Date(booking.date);
    const validDate = !Number.isNaN(date.getTime());
    const dateLabel = validDate ? date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : escapeText(booking.dateLabel || "วันที่ตามนัด");
    return `<article class="appointment-card"><span class="appointment-date"><b>${validDate ? date.getDate() : "—"}</b><small>${validDate ? date.toLocaleDateString("th-TH", { month: "short" }) : "นัดหมาย"}</small></span><div class="appointment-details"><b>${escapeText(booking.service || "ตัดผม + สระ")}</b><small>ช่าง${escapeText(booking.barber || "ทีมช่าง")} · ${escapeText(booking.time || "เวลาไม่ระบุ")}</small></div><span class="appointment-status">${escapeText(booking.status || "ยืนยันแล้ว")}</span></article>`;
  }).join("");
}

function renderHistory() {
  const history = [
    { date: "18 ก.ย. 2026", service: "ตัดผม + สระ", barber: "พี่เจ", style: "Low Taper Fade", note: "ไถข้างเบอร์ 1 · เซ็ต Texture Clay" },
    { date: "21 ส.ค. 2026", service: "ตัดผม + จัดแต่งเครา", barber: "บอส", style: "Classic Side Part", note: "เก็บกรอบเครา · ใช้ Beard Oil" },
  ];
  document.querySelector("#haircutHistory").innerHTML = history.map((visit) => `<article class="history-card"><span class="history-date">${visit.date}</span><div class="history-copy"><b>${visit.service}</b><small>ช่าง${visit.barber} · ${visit.style}</small><p>${visit.note}</p></div><span class="history-check">✓</span></article>`).join("");
}

displayMember();

document.querySelector("#accountLoginButton").addEventListener("click", () => {
  document.querySelector("#authDialog").showModal();
});

document.querySelector("#accountLogout").addEventListener("click", () => {
  localStorage.removeItem("street-barber-member");
  window.location.reload();
});
