const page = document.body.dataset.page || "home";
const menu = [
  ["home", "หน้าแรก", "index.html"],
  ["booking", "จองคิว", "booking.html"],
  ["styles", "ทรงผม", "styles.html"],
  ["membership", "สมาชิก", "membership.html"],
  ["account", "บัญชีของฉัน", "account.html"],
  ["quests", "ภารกิจ", "quests.html"],
  ["feedback", "ข้อเสนอแนะ", "feedback.html"],
];

document.querySelector("#siteHeader").innerHTML = `
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Street Barber Club หน้าแรก">
      <span class="brand-mark">S<span>/</span>B</span>
      <span class="brand-name">STREET<br /><b>BARBER CLUB</b></span>
    </a>
    <nav class="main-nav" id="mainNav" aria-label="เมนูหลัก">
      ${menu.map(([id, label, href]) => `<a href="${href}" class="${id === page ? "active" : ""}" ${id === page ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>
    <button class="header-auth" id="authButton" type="button">สมัครสมาชิก / เข้าสู่ระบบ</button>
    <button class="mobile-menu-button" id="mobileMenuButton" type="button" aria-label="เปิดเมนู" aria-expanded="false">☰</button>
  </header>
  <dialog class="auth-dialog" id="authDialog" aria-labelledby="authTitle">
    <button class="auth-close" id="authClose" type="button" aria-label="ปิด">×</button>
    <span class="eyebrow">STREET BARBER CLUB</span>
    <h2 id="authTitle">สมัครสมาชิก / เข้าสู่ระบบ</h2>
    <p id="authDescription">เข้าสู่ระบบเพื่อดูคะแนน สิทธิพิเศษ และประวัติการจอง</p>
    <div class="auth-tabs" role="tablist" aria-label="เลือกบัญชี">
      <button type="button" class="auth-tab active" data-auth-mode="login" role="tab" aria-selected="true">เข้าสู่ระบบ</button>
      <button type="button" class="auth-tab" data-auth-mode="register" role="tab" aria-selected="false">สมัครสมาชิก</button>
    </div>
    <form id="authForm" class="auth-form">
      <label for="authName" data-register-field hidden>ชื่อ-นามสกุล</label><input id="authName" data-register-field autocomplete="name" placeholder="ชื่อของคุณ" hidden />
      <label for="authPhone" data-register-field hidden>เบอร์โทรศัพท์</label><input id="authPhone" data-register-field type="tel" autocomplete="tel" placeholder="08X-XXX-XXXX" hidden />
      <label for="authEmail">อีเมล</label><input id="authEmail" type="email" autocomplete="username" placeholder="user@gmail.com" required />
      <label for="authPassword">รหัสผ่าน</label><input id="authPassword" type="password" autocomplete="current-password" placeholder="รหัสผ่าน" minlength="4" required />
      <small id="authError" class="auth-error" role="alert"></small>
      <button class="button button-primary" type="submit">เข้าสู่ระบบ <span>↗</span></button>
    </form>
    <small class="auth-hint" id="authHint">ข้อมูลจำลอง: user@gmail.com · 1234 · บัญชีที่สมัครจะบันทึกในเบราว์เซอร์นี้</small>
    <button class="auth-logout" id="authLogout" type="button" hidden>ออกจากระบบ</button>
  </dialog>`;

document.querySelector("#siteFooter").innerHTML = `
  <footer class="site-footer">
    <div class="footer-main content-wrap">
      <a class="brand" href="index.html"><span class="brand-mark">S<span>/</span>B</span><span class="brand-name">STREET<br /><b>BARBER CLUB</b></span></a>
      <div class="footer-address">ตัดให้เป็นตัวคุณ<small>ซอยสุขุมวิท 39 · กรุงเทพฯ</small></div>
      <div class="footer-hours"><span>OPEN DAILY</span><b>10:00 — 21:00</b></div>
      <a class="footer-admin-link" href="admin.html">ADMIN ↗</a>
    </div>
    <div class="footer-bottom content-wrap"><span>© 2026 STREET BARBER CLUB. ALL RIGHTS RESERVED.</span><span>MADE FOR YOUR NEXT CHAPTER. <b>✳</b></span></div>
  </footer>`;

const authDialog = document.querySelector("#authDialog");
const authButton = document.querySelector("#authButton");
const authError = document.querySelector("#authError");
let toastTimer;
let authMode = "login";

function getMember() {
  try {
    const member = JSON.parse(localStorage.getItem("street-barber-member") || "null");
    if (!member) return null;
    if (member.email === "user@gmail.com") {
      member.name ||= "สมาชิกตัวอย่าง";
      member.phone ||= "081-234-5678";
      member.spend ??= 16450;
      member.bookings ||= [];
    }
    return member;
  } catch (error) {
    console.warn("ไม่สามารถอ่านข้อมูลสมาชิกที่บันทึกไว้ได้", error);
    return null;
  }
}

function renderMember(member) {
  if (!member) {
    authButton.textContent = "สมัครสมาชิก / เข้าสู่ระบบ";
    authButton.classList.remove("member-signed-in");
    document.querySelector("#authTitle").textContent = "สมัครสมาชิก / เข้าสู่ระบบ";
    document.querySelector("#authDescription").textContent = "เข้าสู่ระบบหรือสมัครสมาชิกเพื่อดูคะแนน สิทธิพิเศษ และประวัติการจอง";
    document.querySelector("#authForm").hidden = false;
    document.querySelector("#authHint").hidden = false;
    document.querySelector("#authLogout").hidden = true;
    document.querySelector(".auth-tabs").hidden = false;
    setAuthMode(authMode);
    return;
  }
  authButton.innerHTML = `<span class="user-initial">${(member.name || member.email).charAt(0).toUpperCase()}</span><span>${member.name || member.email}</span>`;
  authButton.classList.add("member-signed-in");
  document.querySelector("#authTitle").textContent = "บัญชีสมาชิก";
  document.querySelector("#authDescription").textContent = `${member.email} · ${member.tier || "Bronze"} Member · ${Number(member.points || 0).toLocaleString()} คะแนน`;
  document.querySelector("#authForm").hidden = true;
  document.querySelector("#authHint").hidden = true;
  document.querySelector("#authLogout").hidden = false;
  document.querySelector(".auth-tabs").hidden = true;
}

function showToast(message) {
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

renderMember(getMember());
function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    const selected = tab.dataset.authMode === mode;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll("[data-register-field]").forEach((field) => {
    field.hidden = mode !== "register";
    if (field.id === "authName" || field.id === "authPhone") field.required = mode === "register";
  });
  document.querySelector("#authPassword").autocomplete = mode === "register" ? "new-password" : "current-password";
  document.querySelector("#authForm button[type='submit']").innerHTML = `${mode === "register" ? "สร้างบัญชีสมาชิก" : "เข้าสู่ระบบ"} <span>↗</span>`;
  authError.textContent = "";
}
document.querySelectorAll(".auth-tab").forEach((tab) => tab.addEventListener("click", () => setAuthMode(tab.dataset.authMode)));
authButton.addEventListener("click", () => {
  if (getMember()) {
    window.location.href = "account.html";
    return;
  }
  setAuthMode("login");
  authDialog.showModal();
});
document.querySelector("#authClose").addEventListener("click", () => authDialog.close());
authDialog.addEventListener("click", (event) => {
  if (event.target === authDialog) authDialog.close();
});
document.querySelector("#authForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#authEmail").value.trim().toLowerCase();
  const password = document.querySelector("#authPassword").value;
  let member;
  if (authMode === "register") {
    const name = document.querySelector("#authName").value.trim();
    const phone = document.querySelector("#authPhone").value.trim();
    if (!name || !phone || password.length < 4) {
      authError.textContent = "กรอกข้อมูลให้ครบ และตั้งรหัสผ่านอย่างน้อย 4 ตัวอักษร";
      return;
    }
    const accounts = JSON.parse(localStorage.getItem("street-barber-accounts") || "[]");
    if (accounts.some((account) => account.email === email)) {
      authError.textContent = "อีเมลนี้มีบัญชีแล้ว กรุณาเข้าสู่ระบบ";
      setAuthMode("login");
      return;
    }
    member = { name, email, phone, password, tier: "Bronze", points: 0, spend: 0, joinedAt: new Date().toISOString(), bookings: [] };
    accounts.push(member);
    localStorage.setItem("street-barber-accounts", JSON.stringify(accounts));
  } else {
    const accounts = JSON.parse(localStorage.getItem("street-barber-accounts") || "[]");
    member = accounts.find((account) => account.email === email && account.password === password);
    if (!member && email === "user@gmail.com" && password === "1234") {
      member = { name: "สมาชิกตัวอย่าง", email, phone: "081-234-5678", tier: "Gold", points: 1280, spend: 16450, joinedAt: "2024-02-01", bookings: [] };
    }
    if (!member) {
      authError.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      return;
    }
  }
  localStorage.setItem("street-barber-member", JSON.stringify(member));
  renderMember(member);
  authDialog.close();
  if (window.location.pathname.toLowerCase().endsWith("/account.html")) window.location.reload();
  showToast(authMode === "register" ? "สมัครสมาชิกเรียบร้อยแล้ว" : "เข้าสู่ระบบสมาชิกเรียบร้อยแล้ว");
});
document.querySelector("#authLogout").addEventListener("click", () => {
  localStorage.removeItem("street-barber-member");
  renderMember(null);
  authDialog.close();
  showToast("ออกจากระบบเรียบร้อยแล้ว");
});

const mobileMenuButton = document.querySelector("#mobileMenuButton");
mobileMenuButton.addEventListener("click", () => {
  const nav = document.querySelector("#mainNav");
  const isOpen = nav.classList.toggle("open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.textContent = isOpen ? "×" : "☰";
});

window.streetBarberToast = showToast;
window.streetBarberMember = getMember;
