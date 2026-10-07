const today = new Date();
const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
const money = new Intl.NumberFormat("th-TH");
const bookingStatus = ["ยืนยันแล้ว", "รอชำระ", "เสร็จสิ้น", "ยกเลิก"];

function dateAt(offset) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

const bookings = [
  { id: "SB-26041", name: "กิตติพงษ์ วัฒนชัย", email: "kit@email.com", service: "ตัดผม + สระ", detail: "Haircut & Wash", barber: "พี่เจ", time: "10:00", offset: 0, amount: 450, status: "เสร็จสิ้น" },
  { id: "SB-26042", name: "ธนกร สุขใจ", email: "tanakorn@email.com", service: "ตัดผม + จัดแต่งเครา", detail: "Haircut & Beard", barber: "บอส", time: "11:30", offset: 0, amount: 650, status: "รอชำระ" },
  { id: "SB-26043", name: "นที วงศ์สวัสดิ์", email: "natee@example.com", service: "ตัดผม + สระ", detail: "Gold member · 1,280 pts", barber: "มาร์ค", time: "13:00", offset: 0, amount: 450, status: "เสร็จสิ้น" },
  { id: "SB-26044", name: "ภาคิน จิตต์ดี", email: "pakin@email.com", service: "ตัดผม", detail: "Classic Cut", barber: "พี่เจ", time: "14:30", offset: 0, amount: 350, status: "ยืนยันแล้ว" },
  { id: "SB-26045", name: "วรเมธ ศรีสุข", email: "woramet@email.com", service: "ออกแบบทรงเครา", detail: "Beard Grooming", barber: "บอส", time: "16:00", offset: 0, amount: 300, status: "รอชำระ" },
  { id: "SB-26046", name: "พีรพล ธีระ", email: "peeraphon@email.com", service: "ตัดผม + สระ", detail: "Haircut & Wash", barber: "มาร์ค", time: "17:30", offset: 0, amount: 450, status: "ยืนยันแล้ว" },
  { id: "SB-26047", name: "อาทิตย์ เกียรติ", email: "arthit@email.com", service: "ตัดผม", detail: "Classic Cut", barber: "พี่เจ", time: "10:30", offset: 1, amount: 350, status: "ยืนยันแล้ว" },
  { id: "SB-26048", name: "ชยพล วงศ์ดี", email: "chai@email.com", service: "ตัดผม + จัดแต่งเครา", detail: "Haircut & Beard", barber: "บอส", time: "12:00", offset: 1, amount: 650, status: "เสร็จสิ้น" },
  { id: "SB-26049", name: "ณัฐพล บุญมี", email: "nut@email.com", service: "ตัดผม + สระ", detail: "Haircut & Wash", barber: "มาร์ค", time: "15:00", offset: -1, amount: 450, status: "เสร็จสิ้น" },
];

const members = [
  { name: "นที วงศ์สวัสดิ์", email: "natee@example.com", tier: "Gold", points: 1280, spend: 16450, joined: "ก.พ. 2024", status: "ใช้งาน" },
  { name: "กิตติพงษ์ วัฒนชัย", email: "kit@email.com", tier: "VIP", points: 2450, spend: 32100, joined: "ก.ย. 2023", status: "ใช้งาน" },
  { name: "ธนกร สุขใจ", email: "tanakorn@email.com", tier: "Silver", points: 690, spend: 8700, joined: "พ.ค. 2025", status: "ใช้งาน" },
  { name: "ภาคิน จิตต์ดี", email: "pakin@email.com", tier: "Bronze", points: 280, spend: 3500, joined: "ม.ค. 2026", status: "ใช้งาน" },
  { name: "วรเมธ ศรีสุข", email: "woramet@email.com", tier: "Gold", points: 1420, spend: 18900, joined: "ต.ค. 2024", status: "ใช้งาน" },
];

const staff = [
  { name: "พี่เจ", specialty: "Classic & Fade", rating: "4.9", appointments: 6, revenue: 2450, photo: "photo-1503951914875-452162b0f3f1" },
  { name: "มาร์ค", specialty: "Modern & Texture", rating: "4.8", appointments: 5, revenue: 1980, photo: "photo-1599351431202-1e0f0137899a" },
  { name: "บอส", specialty: "Beard & Grooming", rating: "5.0", appointments: 4, revenue: 2200, photo: "photo-1622286342621-4bd786c2447c" },
];

const promotions = [
  { tag: "MONTHLY QUEST", title: "Mullet Season", detail: "ลด 15% พร้อมโบนัส 200 แต้ม เมื่อร่วมภารกิจทรงผมประจำเดือน", expiry: "31 ต.ค. 2026", active: true },
  { tag: "OFF-PEAK", title: "Morning Cut", detail: "รับส่วนลด 10% สำหรับคิววันธรรมดาก่อนเวลา 12:00 น.", expiry: "ไม่มีกำหนด", active: true },
  { tag: "MEMBERSHIP", title: "Gold Birthday Privilege", detail: "สมาชิก Gold รับส่วนลดพิเศษ 20% ตลอดเดือนเกิด", expiry: "31 ธ.ค. 2026", active: false },
];

const $ = (selector, root = document) => root.querySelector(selector);
const loginScreen = $("#loginScreen");
const adminApp = $("#adminApp");
const adminToast = $("#adminToast");
let toastTimer;
let activeView = "overview";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatDay(date) {
  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
}

function dateLabel(booking) {
  const date = dateAt(booking.offset);
  if (booking.offset === 0) return `วันนี้ · ${formatDay(date)}`;
  if (booking.offset === 1) return `พรุ่งนี้ · ${formatDay(date)}`;
  return `${dayNames[date.getDay()]} ${formatDay(date)}`;
}

function statusClass(status) {
  if (status === "รอชำระ") return "pending";
  if (status === "เสร็จสิ้น") return "done";
  if (status === "ยกเลิก") return "cancelled";
  return "";
}

function customerCell(booking) {
  const name = escapeHtml(booking.name);
  return `<div class="customer-cell"><span class="customer-avatar">${name.charAt(0)}</span><span><b>${name}</b><small>${escapeHtml(booking.email)}</small></span></div>`;
}

function renderBookingRow(booking, editable) {
  const status = editable
    ? `<label class="status-pill row-status ${statusClass(booking.status)}"><select aria-label="สถานะ ${booking.name}" data-booking-id="${booking.id}">${bookingStatus.map((item) => `<option ${item === booking.status ? "selected" : ""}>${item}</option>`).join("")}</select></label>`
    : `<span class="status-pill ${statusClass(booking.status)}">${booking.status}</span>`;
  return `<tr><td>${customerCell(booking)}${editable ? `<small class="booking-id">${escapeHtml(booking.id)}</small>` : ""}</td><td><span class="service-cell">${escapeHtml(booking.service)}<small>${escapeHtml(booking.detail)}</small></span></td><td>${escapeHtml(booking.barber)}</td><td><span class="date-cell">${escapeHtml(dateLabel(booking))}<small>${escapeHtml(booking.time)} น.</small></span></td>${editable ? `<td>฿${money.format(booking.amount)}</td>` : ""}<td>${status}</td></tr>`;
}

function updateSummary() {
  const todaysBookings = bookings.filter((booking) => booking.offset === 0 && booking.status !== "ยกเลิก");
  const revenue = bookings
    .filter((booking) => booking.offset === 0 && booking.status === "เสร็จสิ้น")
    .reduce((total, booking) => total + booking.amount, 0);
  $("#todayRevenue").textContent = `฿${money.format(revenue)}`;
  $("#todayBookings").textContent = todaysBookings.length;
  $("#totalMembers").textContent = money.format(1248 + Math.max(0, members.length - 5));
  $("#navBookingCount").textContent = bookings.filter((booking) => booking.offset === 0 && booking.status !== "เสร็จสิ้น" && booking.status !== "ยกเลิก").length;
  $("#todayLabel").textContent = today.toLocaleDateString("th-TH", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  $("#recentBookings").innerHTML = [...bookings]
    .sort((a, b) => a.offset - b.offset || a.time.localeCompare(b.time))
    .slice(0, 5)
    .map((booking) => renderBookingRow(booking, false))
    .join("");
  $("#nextAppointments").innerHTML = [...bookings]
    .filter((booking) => booking.offset === 0 && booking.status !== "ยกเลิก" && booking.status !== "เสร็จสิ้น")
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3)
    .map((booking) => `<div class="next-item"><span class="next-time">${booking.time}</span><span class="next-person"><b>${booking.name}</b><small>${booking.service}</small></span><span class="next-barber">${booking.barber}</span></div>`)
    .join("") || `<p class="empty-state">ไม่มีคิวที่กำลังจะมาถึง</p>`;
  renderBookings();
}

function renderBookings() {
  const query = ($("#bookingSearch").value || "").trim().toLowerCase();
  const filter = $("#bookingFilter").value;
  const visible = [...bookings]
    .sort((a, b) => a.offset - b.offset || a.time.localeCompare(b.time))
    .filter((booking) => filter === "all" || booking.status === filter)
    .filter((booking) => [booking.name, booking.email, booking.service, booking.barber, booking.id].some((value) => value.toLowerCase().includes(query)));
  $("#allBookings").innerHTML = visible.map((booking) => renderBookingRow(booking, true)).join("")
    || `<tr><td colspan="6" class="empty-table">ไม่พบรายการจองที่ตรงกับการค้นหา</td></tr>`;
  $("#bookingResultCount").textContent = `แสดง ${visible.length} จาก ${bookings.length} รายการ`;
  $("#allBookings").querySelectorAll("select[data-booking-id]").forEach((select) => {
    select.addEventListener("change", () => {
      const booking = bookings.find((item) => item.id === select.dataset.bookingId);
      if (!booking) return;
      booking.status = select.value;
      updateSummary();
      showToast(`อัปเดตสถานะ ${booking.id} เป็น “${booking.status}” แล้ว`);
    });
  });
}

function renderMembers() {
  const query = ($("#memberSearch").value || "").trim().toLowerCase();
  const visible = members.filter((member) => `${member.name} ${member.email} ${member.tier}`.toLowerCase().includes(query));
  $("#membersTable").innerHTML = visible.map((member) => {
    const tierClass = member.tier === "VIP" ? "tier-vip" : `tier-${member.tier.toLowerCase()}`;
    return `<tr><td>${customerCell(member)}</td><td><span class="tier-pill ${tierClass}">${escapeHtml(member.tier)}</span></td><td>${money.format(member.points)} pts</td><td>฿${money.format(member.spend)}</td><td>${escapeHtml(member.joined)}</td><td><span class="member-active">${escapeHtml(member.status)}</span></td></tr>`;
  }).join("") || `<tr><td colspan="6" class="empty-table">ไม่พบสมาชิก</td></tr>`;
  $("#memberCountCard").textContent = money.format(1248 + Math.max(0, members.length - 5));
}

function renderStaff() {
  $("#staffGrid").innerHTML = staff.map((barber) => {
    const image = `https://images.unsplash.com/${barber.photo}?auto=format&fit=crop&w=120&q=75`;
    return `<article class="staff-card"><div class="staff-card-top"><span class="staff-photo" style="background-image:url('${image}')"></span><span class="staff-name"><b>${escapeHtml(barber.name)}</b><small>${escapeHtml(barber.specialty)}</small></span><span class="staff-rating">★ ${escapeHtml(barber.rating)}</span></div><div class="staff-stats"><span>คิววันนี้<b>${barber.appointments} คิว</b></span><span>ยอดบริการวันนี้<b>฿${money.format(barber.revenue)}</b></span></div><div class="staff-status"><span>สถานะวันนี้</span><i>● พร้อมให้บริการ</i></div></article>`;
  }).join("");
}

function renderPromotions() {
  $("#promotionGrid").innerHTML = promotions.map((promotion, index) => `<article class="promotion-card"><div class="promo-top"><span class="promo-tag">${escapeHtml(promotion.tag)}</span><button class="promo-toggle ${promotion.active ? "on" : ""}" aria-label="${promotion.active ? "ปิด" : "เปิด"} ${escapeHtml(promotion.title)}" aria-pressed="${promotion.active}" data-promo-index="${index}"></button></div><h2>${escapeHtml(promotion.title)}</h2><p>${escapeHtml(promotion.detail)}</p><div class="promo-expiry"><span>สิ้นสุด</span><b>${escapeHtml(promotion.expiry)}</b></div></article>`).join("");
  $("#promotionGrid").querySelectorAll(".promo-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const promotion = promotions[Number(button.dataset.promoIndex)];
      promotion.active = !promotion.active;
      renderPromotions();
      showToast(`${promotion.title}: ${promotion.active ? "เปิดใช้งานแล้ว" : "ปิดใช้งานแล้ว"}`);
    });
  });
}

function showView(view) {
  const target = $(`#view-${view}`);
  if (!target) return;
  activeView = view;
  document.querySelectorAll(".view-panel").forEach((panel) => panel.classList.toggle("active", panel === target));
  document.querySelectorAll(".side-link").forEach((link) => link.classList.toggle("active", link.dataset.view === view));
  $("#currentPageName").textContent = { overview: "ภาพรวม", bookings: "รายการจอง", members: "สมาชิก", staff: "ทีมช่าง", promotions: "โปรโมชัน" }[view];
}

function showToast(message) {
  adminToast.textContent = message;
  adminToast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => adminToast.classList.remove("show"), 2600);
}

function signIn() {
  loginScreen.hidden = true;
  adminApp.hidden = false;
  updateSummary();
  renderMembers();
  renderStaff();
  renderPromotions();
}

$("#adminLoginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("#adminEmail").value.trim().toLowerCase();
  const password = $("#adminPassword").value;
  if (email !== "admin@gmail.com" || password !== "1234") {
    $("#loginError").textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง";
    $("#adminPassword").setAttribute("aria-invalid", "true");
    return;
  }
  $("#loginError").textContent = "";
  $("#adminPassword").removeAttribute("aria-invalid");
  sessionStorage.setItem("street-barber-admin", "demo-session");
  signIn();
});

$("#logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("street-barber-admin");
  adminApp.hidden = true;
  loginScreen.hidden = false;
  $("#adminLoginForm").reset();
  showView("overview");
});

document.querySelectorAll(".side-link").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
document.querySelectorAll("[data-open-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.openView)));
$("#bookingSearch").addEventListener("input", renderBookings);
$("#bookingFilter").addEventListener("change", renderBookings);
$("#memberSearch").addEventListener("input", renderMembers);

$("#addBookingButton").addEventListener("click", () => {
  const name = window.prompt("ชื่อลูกค้าสำหรับรายการจองตัวอย่าง:");
  if (!name || !name.trim()) return;
  const id = `SB-${String(26050 + bookings.length).padStart(5, "0")}`;
  bookings.push({ id, name: name.trim(), email: "walk-in@streetbarberclub.demo", service: "ตัดผม + สระ", detail: "Haircut & Wash", barber: "พี่เจ", time: "18:00", offset: 0, amount: 450, status: "ยืนยันแล้ว" });
  updateSummary();
  showView("bookings");
  showToast(`เพิ่มรายการจอง ${id} แล้ว`);
});

$("#addMemberButton").addEventListener("click", () => {
  const name = window.prompt("ชื่อสมาชิกตัวอย่าง:");
  if (!name || !name.trim()) return;
  members.unshift({ name: name.trim(), email: "new-member@streetbarberclub.demo", tier: "Bronze", points: 0, spend: 0, joined: "วันนี้", status: "ใช้งาน" });
  renderMembers();
  showToast(`เพิ่ม ${name.trim()} ในรายชื่อสมาชิกแล้ว`);
});

$("#addStaffButton").addEventListener("click", () => {
  const name = window.prompt("ชื่อช่างตัวอย่าง:");
  if (!name || !name.trim()) return;
  staff.push({ name: name.trim(), specialty: "Barber", rating: "ใหม่", appointments: 0, revenue: 0, photo: "photo-1503951914875-452162b0f3f1" });
  renderStaff();
  showToast(`เพิ่มช่าง ${name.trim()} แล้ว`);
});

$("#addPromotionButton").addEventListener("click", () => {
  const title = window.prompt("ชื่อโปรโมชันตัวอย่าง:");
  if (!title || !title.trim()) return;
  promotions.unshift({ tag: "NEW CAMPAIGN", title: title.trim(), detail: "โปรโมชันใหม่สำหรับลูกค้า Street Barber Club", expiry: "กำหนดภายหลัง", active: true });
  renderPromotions();
  showToast(`สร้างโปรโมชัน ${title.trim()} แล้ว`);
});

$("#revenueRange").addEventListener("change", (event) => {
  showToast(`แสดงภาพรวม: ${event.target.value} · ข้อมูลรายได้เป็นข้อมูลจำลอง`);
});

if (sessionStorage.getItem("street-barber-admin") === "demo-session") signIn();
