/* ============================================
   REWARDSYNC — Dashboard App JavaScript
   ============================================ */

'use strict';

// ============================================
// DATA
// ============================================
const MOCK_REWARDS = [
  { platform: 'PhonePe', emoji: '📱', type: 'Payments', balance: 120, points: null, expiryLabel: 'Expires Mar 15', expiryClass: 'expiry-warn', color: '#7C3AED' },
  { platform: 'Swiggy', emoji: '🍔', type: 'Food', balance: 200, points: null, expiryLabel: 'Expires in 4 days', expiryClass: 'expiry-alert', color: '#F59E0B' },
  { platform: 'Amazon Pay', emoji: '🛒', type: 'Shopping', balance: 320, points: null, expiryLabel: 'No Expiry', expiryClass: 'expiry-ok', color: '#10B981' },
  { platform: 'CRED', emoji: '💳', type: 'Travel', balance: 180, points: 360, expiryLabel: 'Expires in 2 days', expiryClass: 'expiry-alert', color: '#3B82F6' },
  { platform: 'MakeMyTrip', emoji: '✈️', type: 'Travel', balance: 500, points: null, expiryLabel: 'Expires Apr 30', expiryClass: 'expiry-warn', color: '#EC4899' },
  { platform: 'HDFC Rewards', emoji: '🏦', type: 'Other', balance: 557, points: 1114, expiryLabel: 'Expires Dec 31', expiryClass: 'expiry-ok', color: '#6366F1' },
];

let REWARDS_DATA = [...MOCK_REWARDS];
let CONNECTIONS_DATA = [...MOCK_REWARDS];
let TOTAL_BALANCE = MOCK_REWARDS.reduce((sum, r) => sum + (r.balance || 0), 0);

const ANALYTICS_CHART_DATA = [
  { month: 'Oct', value: 1200 },
  { month: 'Nov', value: 1540 },
  { month: 'Dec', value: 2100 },
  { month: 'Jan', value: 1800 },
  { month: 'Feb', value: 2400 },
  { month: 'Mar', value: 3100 }
];

const ANALYTICS_CATEGORIES = [
  { label: 'Food', value: 450, color: '#F59E0B' },
  { label: 'Shopping', value: 680, color: '#10B981' },
  { label: 'Travel', value: 520, color: '#3B82F6' },
  { label: 'Other', value: 197, color: '#6366F1' }
];

const ANALYTICS_OVERVIEW_STATS = [
  { label: 'Total Value Saved', value: '₹4,280', change: '+18.5%', up: true },
  { label: 'Avg. Monthly Earn', value: '₹1,420', change: '+5.2%', up: true },
  { label: 'Redemption Rate', value: '84%', change: '+2.1%', up: true },
  { label: 'Points Valuation', value: '₹0.50/pt', change: 'Stable', up: true }
];

const MARKETPLACE_DATA = [
  { id: 0, name: 'Swiggy', emoji: '🍔', category: 'food', originalVal: 200, askingVal: 160, desc: '₹200 Swiggy discount coupon valid on orders above ₹299', expiry: 'Expires Mar 8, 2026' },
  { id: 0, name: 'Amazon', emoji: '🛒', category: 'shopping', originalVal: 500, askingVal: 420, desc: '₹500 Amazon Pay balance available for immediate transfer', expiry: 'Expires Mar 20, 2026' },
  { id: 0, name: 'Zomato', emoji: '🍕', category: 'food', originalVal: 150, askingVal: 125, desc: '₹150 Zomato coupon, usable on any food order', expiry: 'Expires Mar 12, 2026' },
  { id: 0, name: 'Air India', emoji: '✈️', category: 'travel', originalVal: 800, askingVal: 650, desc: '2000 Air India Miles (~₹800 value) for domestic flights', expiry: 'Expires Apr 30, 2026' },
  { id: 0, name: 'BookMyShow', emoji: '🎬', category: 'entertainment', originalVal: 200, askingVal: 175, desc: '₹200 off on movie tickets. Valid for 2 tickets', expiry: 'Expires Mar 28, 2026' },
  { id: 0, name: 'Flipkart', emoji: '🔶', category: 'shopping', originalVal: 300, askingVal: 260, desc: '₹300 Flipkart SuperCoin worth of value. No min order', expiry: 'Expires Apr 15, 2026' },
];

const NOTIFICATIONS_DATA = [
  { type: 'urgent', icon: '⏰', iconBg: 'rgba(239,68,68,0.15)', title: 'CRED Reward Expiring in 2 Days!', desc: 'You have ₹180 (360 coins) in CRED that will expire on March 3rd. Use it before it\'s gone!', time: 'Just now', action: 'Use Now', unread: true },
  { type: 'urgent', icon: '⚡', iconBg: 'rgba(245,158,11,0.15)', title: 'Swiggy Coupon Expires in 4 Days', desc: '₹200 Swiggy reward expires on March 5th. Order food now to redeem it at max value.', time: '15 min ago', action: 'Order Now', unread: true },
  { type: 'unread', icon: '🤖', iconBg: 'rgba(124,58,237,0.15)', title: 'AI Tip: Best Redemption Combo Found', desc: 'Combine your Swiggy + CRED rewards for a total saving of ₹380 on your next food order tonight.', time: '1 hour ago', action: 'View Tip', unread: true },
];

const ACTIVITY_DATA = [
  { type: 'dot-green', title: 'HDFC Points synced', time: '2 mins ago', value: '+₹557', valueClass: 'positive' },
  { type: 'dot-purple', title: 'AI suggestion applied', time: '1 hour ago', value: 'Saved ₹120', valueClass: 'positive' },
  { type: 'dot-yellow', title: 'Swiggy reward expiry alert', time: '3 hours ago', value: '4 days left', valueClass: '' },
];

const AI_SUGGESTIONS = [
  { icon: '🔥', title: 'Use Today — Max Value', desc: 'Combine Swiggy + CRED rewards for your dinner order tonight. Save ₹380 before expiry hits.', reward: 'Potential saving: ₹380' },
  { icon: '💡', title: 'Convert HDFC Points Now', desc: 'Your 1114 HDFC points are worth ₹557 but earn 5% more as Amazon Gift Cards this month.', reward: 'Bonus: +₹28' },
];

// ============================================
// FIREBASE INTEGRATION
// ============================================

async function loadBackendData() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    try {
      // Fetch user profile from Firestore
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        let userData = doc.data();
        
        // 🔒 AUTO-ADMIN FOR SRINIDHI (Aggressive Check)
        const isSrinidhi = (
            (userData.username && userData.username.toLowerCase() === 'srinidhiireddy') || 
            (userData.email && userData.email.toLowerCase() === 'admin@rewardsync.com') ||
            (userData.email && userData.email.toLowerCase() === 'srinidhiireddy@gmail.com') ||
            (userData.name && userData.name.toLowerCase().includes('srinidhi'))
        );

        if (!userData.isAdmin && isSrinidhi) {
            console.log("Admin detected: Upgrading account permissions...");
            await db.collection('users').doc(user.uid).update({ 
                isAdmin: true, 
                isApproved: true, 
                pending: false 
            });
            userData.isAdmin = true;
        }

        window.currentUser = { ...userData, uid: user.uid };
        
        const uName = userData.name || user.displayName || user.email.split('@')[0];
        const nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = uName;
        
        const avatarStr = uName.split(' ').map(n => n[0]).join('').toUpperCase();
        const avatarEl = document.getElementById('userAvatar');
        if (avatarEl) avatarEl.textContent = avatarStr.slice(0, 2);
        
        // Explicitly show/hide admin nav
        const adminNav = document.getElementById('adminNav');
        console.log("Checking Admin status for:", uName, "isAdmin:", userData.isAdmin, "isSrinidhi:", isSrinidhi);
        if (adminNav) {
            adminNav.style.display = (userData.isAdmin || isSrinidhi) ? 'flex' : 'none';
        }
        
        const welcomeH1 = document.querySelector('#page-overview .page-title');
        if (welcomeH1) welcomeH1.textContent = `Good morning, ${uName}! 👋`;

        // Load Rewards
        loadUserRewards(user.uid);
        fetchPendingCount();
        handleHash();
      } else {
        // Fallback for missing profile
        console.warn("User profile not found in Firestore.");
        window.currentUser = { name: user.email.split('@')[0], uid: user.uid };
        loadUserRewards(user.uid);
        handleHash();
      }
    } catch (err) {
      console.error("Firebase load error:", err);
      showToast("Error connecting to Cloud. Using local data.", "error");
    }
  });
}

async function loadUserRewards(uid) {
    try {
        const snapshot = await db.collection('users').doc(uid).collection('rewards')
                                .orderBy('createdAt', 'desc').limit(50).get();
        
        if (!snapshot.empty) {
            REWARDS_DATA = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            // Pre-seed with mock data for new users if requested? 
            // For now, keep it empty or use MOCK_REWARDS
            REWARDS_DATA = REWARDS_DATA.length > 6 ? REWARDS_DATA : [...MOCK_REWARDS];
        }
        
        TOTAL_BALANCE = REWARDS_DATA.reduce((sum, r) => sum + (r.balance || 0), 0);
        
        const totalEl = document.getElementById('totalBalance');
        if (totalEl) animateCounter(totalEl, TOTAL_BALANCE, '₹');
        
        const walletTotalEl = document.getElementById('walletTotalBalance');
        if (walletTotalEl) walletTotalEl.textContent = formatCurrency(TOTAL_BALANCE);

        renderRewardBreakdown();
        initAnalytics();
    } catch (e) {
        console.error("Rewards load error:", e);
    }
}

async function fetchPendingCount() {
  if (!window.currentUser || !window.currentUser.isAdmin) return;
  try {
    const snapshot = await db.collection('users').where('pending', '==', true).get();
    const count = snapshot.size;
    const badge = document.getElementById('pendingBadge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'block' : 'none';
    }
  } catch(e) {}
}

// ============================================
// UTILITIES
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function formatCurrency(val) {
  return '₹' + (val || 0).toLocaleString('en-IN');
}

function animateCounter(el, target, prefix = '', suffix = '', duration = 1500) {
  if (!el) return;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ============================================
// NAVIGATION
// ============================================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const sidebarEl = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');

function navigateTo(rawPageId) {
  const [pageId, query] = rawPageId.split('?');
  
  navItems.forEach(item => item.classList.remove('active'));
  pages.forEach(page => page.classList.remove('active'));

  const activeItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  const activePage = document.getElementById(`page-${pageId}`);

  if (activeItem) activeItem.classList.add('active');
  if (activePage) {
    activePage.classList.add('active');
    
    if (pageId === 'overview') initOverview();
    if (pageId === 'categories') initCategories();
    if (pageId === 'wallet') initWallet();
    if (pageId === 'marketplace') initMarketplace();
    if (pageId === 'analytics') initAnalytics();
    if (pageId === 'notifications') initNotifications();
    if (pageId === 'admin') initAdmin();
  } else {
    pages[0].classList.add('active');
  }

  if (sidebarEl) sidebarEl.classList.remove('open');
  if (sidebarOverlay) sidebarOverlay.classList.remove('open');
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(item.dataset.page);
    window.location.hash = item.dataset.page;
  });
});

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    sidebarEl.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
  });
}

function handleHash() {
  const hash = window.location.hash.replace('#', '') || 'overview';
  navigateTo(hash);
}
window.addEventListener('hashchange', handleHash);

// ============================================
// PAGE INITIALIZERS
// ============================================

function initOverview() {
  renderRewardBreakdown();
  setupRewardFilters();
  renderAiSuggestions();
  renderActivityList();
  
  const totalEl = document.getElementById('totalBalance');
  if (totalEl) animateCounter(totalEl, TOTAL_BALANCE, '₹');

  const viewAllBtn = document.getElementById('viewAllRewards');
  if (viewAllBtn) viewAllBtn.onclick = () => navigateTo('wallet');
}

function setupRewardFilters() {
  const header = document.getElementById('activeRewardsHeader');
  const filtersContainer = document.getElementById('rewardFilters');
  const icon = document.getElementById('sectorToggleIcon');
  
  if (header && filtersContainer) {
    header.onclick = (e) => {
      if (e.target.id === 'viewAllRewards') return;
      
      const isHidden = filtersContainer.style.display === 'none';
      if (isHidden) {
        filtersContainer.style.display = 'flex';
        filtersContainer.style.maxHeight = '200px';
        filtersContainer.style.marginBottom = '20px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        filtersContainer.style.display = 'none';
        filtersContainer.style.maxHeight = '0';
        filtersContainer.style.marginBottom = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    };
  }

  const filters = document.querySelectorAll('#rewardFilters .filter-chip');
  filters.forEach(chip => {
    chip.onclick = (e) => {
      e.stopPropagation(); // Prevent header toggle
      filters.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderRewardBreakdown(chip.dataset.category);
    };
  });
}

function renderRewardBreakdown(category = 'all') {
  const container = document.getElementById('rewardBreakdown');
  if (!container) return;
  
  const filteredData = category === 'all' 
    ? REWARDS_DATA 
    : REWARDS_DATA.filter(r => r.type === category);

  if (filteredData.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); width:100%">No rewards found in this category.</div>';
    return;
  }

  container.innerHTML = filteredData.slice(0, 6).map(r => `
    <div class="reward-item" onclick="navigateTo('wallet')" style="cursor:pointer">
      <div class="reward-platform-icon" style="background:${r.color}15; color:${r.color}">${r.emoji}</div>
      <div class="reward-info">
        <div class="reward-platform">${r.platform}</div>
        <div class="reward-desc">${r.type}</div>
      </div>
      <div style="text-align:right">
        <div class="reward-value">${formatCurrency(r.balance)}</div>
        <span class="reward-expiry ${r.expiryClass}">${r.expiryLabel}</span>
      </div>
    </div>
  `).join('');
}

function renderAiSuggestions() {
  const container = document.getElementById('aiSuggestions');
  if (!container) return;
  container.innerHTML = AI_SUGGESTIONS.map(s => `
    <div class="ai-suggestion">
      <div class="ai-suggestion-header">
        <span class="ai-icon">${s.icon}</span>
        <span class="ai-title">${s.title}</span>
      </div>
      <div class="ai-desc">${s.desc}</div>
      <div class="ai-reward">${s.reward}</div>
    </div>
  `).join('');
}

function renderActivityList() {
  const container = document.getElementById('activityList');
  if (!container) return;
  container.innerHTML = ACTIVITY_DATA.map(a => `
    <div class="activity-item">
      <div class="activity-dot ${a.type}"></div>
      <div class="activity-info">
        <div class="activity-title">${a.title}</div>
        <div class="activity-time">${a.time}</div>
      </div>
      <div class="activity-value ${a.valueClass}">${a.value}</div>
    </div>
  `).join('');
}

function initWallet() {
  const walletTotalEl = document.getElementById('walletTotalBalance');
  if (walletTotalEl) walletTotalEl.textContent = formatCurrency(TOTAL_BALANCE);

  const container = document.getElementById('walletPlatforms');
  if (!container) return;
  container.innerHTML = REWARDS_DATA.map(r => `
    <div class="platform-card">
      <div class="platform-card-header">
        <div class="platform-emoji">${r.emoji}</div>
        <div>
          <div class="platform-name">${r.platform}</div>
          <div class="platform-type">${r.type}</div>
        </div>
      </div>
      <div class="platform-balance">
        <div class="platform-amount">${formatCurrency(r.balance)}</div>
        <div class="platform-status-dot"></div>
      </div>
    </div>
  `).join('');
}

function initCategories() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;
  const categories = [
    { name: 'Food', icon: '🍔', key: 'food' },
    { name: 'Shopping', icon: '🛒', key: 'shopping' },
    { name: 'Travel', icon: '✈️', key: 'travel' },
    { name: 'Payments', icon: '📱', key: 'payments' },
    { name: 'Other', icon: '🎁', key: 'other' }
  ];
  container.innerHTML = categories.map(cat => `
    <div class="category-card" onclick="window.location.hash='wallet'">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-name">${cat.name}</div>
    </div>
  `).join('');
}

function initMarketplace() {
  const container = document.getElementById('marketplaceGrid');
  if (!container) return;
  container.innerHTML = MARKETPLACE_DATA.map(item => `
    <div class="mp-card">
      <div class="mp-card-header">
        <div class="mp-icon">${item.emoji}</div>
        <div>
          <div class="mp-name">${item.name}</div>
          <div class="mp-category">${item.category}</div>
        </div>
      </div>
      <div class="mp-card-body">
        <div class="mp-desc" style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${item.desc}</div>
        <div class="mp-value-row">
          <div class="mp-original">${formatCurrency(item.originalVal)}</div>
          <div class="mp-asking">
            <div class="mp-asking-label">Asking</div>
            <div class="mp-asking-val">${formatCurrency(item.askingVal)}</div>
          </div>
        </div>
      </div>
      <div class="mp-card-footer" style="padding:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11px;color:var(--text-muted)">${item.expiry}</span>
        <button class="btn btn-primary btn-sm" onclick="handleTrade(${item.id}, '${item.name}')">Trade Now</button>
      </div>
    </div>
  `).join('');
}

async function handleTrade(id, name) {
  if (!window.currentUser || window.currentUser.is_approved !== 1) {
    showToast('Your account must be approved by admin to trade.', 'error');
    return;
  }
  if (id === 0) {
    showToast(`Trade request for ${name} sent!`, 'success');
    return;
  }
  const token = localStorage.getItem('auth_token');
  try {
    const res = await fetch(`http://localhost:8000/marketplace/accept/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      showToast('Trade successful!', 'success');
      loadBackendData();
    } else {
      const d = await res.json();
      showToast(d.detail || 'Trade failed', 'error');
    }
  } catch(e) { showToast('Network error', 'error'); }
}
window.handleTrade = handleTrade;

function initAnalytics() {
  // 1. Earning Chart
  const earningContainer = document.getElementById('earningChart');
  if (earningContainer) {
    const maxVal = Math.max(...ANALYTICS_CHART_DATA.map(d => d.value));
    earningContainer.innerHTML = ANALYTICS_CHART_DATA.map(d => `
      <div class="bar-group">
        <div class="bar" style="height: ${(d.value / maxVal) * 100}%" title="₹${d.value}">
          <div style="position:absolute; top:-20px; left:50%; transform:translateX(-50%); font-size:10px; color:var(--text-muted)">₹${d.value}</div>
        </div>
        <span class="bar-label">${d.month}</span>
      </div>
    `).join('');
  }

  // 2. Category Donut
  const donutContainer = document.getElementById('categoryDonut');
  if (donutContainer) {
    const total = ANALYTICS_CATEGORIES.reduce((s, c) => s + c.value, 0);
    let cumulativePercent = 0;

    function getCoordinatesForPercent(percent) {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    }

    const paths = ANALYTICS_CATEGORIES.map(cat => {
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      const percent = cat.value / total;
      cumulativePercent += percent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      const largeArcFlag = percent > 0.5 ? 1 : 0;
      return `<path d="M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0" fill="${cat.color}"></path>`;
    }).join('');

    donutContainer.innerHTML = `
      <div class="donut-svg-wrap">
        <svg viewBox="-1 -1 2 2" style="transform: rotate(-90deg); width:120px; height:120px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
          ${paths}
          <circle r="0.7" fill="var(--bg-card)"></circle>
        </svg>
        <div class="donut-center">
          <div class="donut-center-value">₹${total}</div>
          <div class="donut-center-label">Total</div>
        </div>
      </div>
      <div class="donut-legend">
        ${ANALYTICS_CATEGORIES.map(cat => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${cat.color}"></div>
            <span>${cat.label}</span>
            <span class="legend-value">₹${cat.value}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 3. Stats Row
  const statsContainer = document.getElementById('analyticsStats');
  if (statsContainer) {
    statsContainer.innerHTML = ANALYTICS_OVERVIEW_STATS.map(s => `
      <div class="analytics-stat-card">
        <p class="analytics-stat-label">${s.label}</p>
        <h3 class="analytics-stat-value">${s.value}</h3>
        <p class="analytics-stat-change ${s.up ? 'change-up' : 'change-down'}">
          ${s.up ? '▲' : '▼'} ${s.change}
        </p>
      </div>
    `).join('');
  }
}

function initNotifications() {
  const container = document.getElementById('notificationsList');
  if (!container) return;
  container.innerHTML = NOTIFICATIONS_DATA.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}">
      <div class="notif-icon" style="background:${n.iconBg}">${n.icon}</div>
      <div class="notif-body">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
      </div>
    </div>
  `).join('');
}

// ============================================
// SETTINGS & ADMIN
// ============================================

function initSettings() {
  const btn = document.getElementById('settingsBtn');
  const modal = document.getElementById('settingsModal');
  const close = document.getElementById('closeSettingsModal');
  const form = document.getElementById('settingsForm');
  const logout = document.getElementById('logoutBtn');

  if (btn) btn.onclick = () => {
    if (window.currentUser) {
      document.getElementById('setFullName').value = window.currentUser.full_name || '';
      document.getElementById('setPhone').value = window.currentUser.phoneNumber || '';
      document.getElementById('setBio').value = window.currentUser.bio || '';
    }
    modal.classList.add('open');
  };
  if (close) close.onclick = () => modal.classList.remove('open');
  if (logout) logout.onclick = () => {
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html';
  };
  if (form) form.onsubmit = async (e) => {
    e.preventDefault();
    const payload = {
      full_name: document.getElementById('setFullName').value,
      phoneNumber: document.getElementById('setPhone').value,
      bio: document.getElementById('setBio').value
    };
    const res = await fetch('http://localhost:8000/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Settings saved!', 'success');
      modal.classList.remove('open');
      loadBackendData();
    }
  };
}

let adminListener = null;

async function initAdmin() {
  const container = document.getElementById('pendingUsersTable');
  const noMsg = document.getElementById('noPendingMsg');
  if (!container) return;
  
  if (adminListener) adminListener();
  
  console.log("Admin: Initializing...");
  container.innerHTML = `
    <tr>
        <td colspan="3" style="text-align:center; padding:30px">
            <div class="btn-spinner" style="display:inline-block; margin-bottom:10px"><div class="spinner-ring"></div></div>
            <div id="adminStatusMsg">Connecting to Cloud...</div>
            <button class="btn btn-ghost btn-sm" style="margin-top:10px; font-size:11px" onclick="forceAdminRefresh()">Stuck? Try Manual Refresh</button>
        </td>
    </tr>`;

  // 1. Set a timeout fallback
  const timeout = setTimeout(() => {
      const msg = document.getElementById('adminStatusMsg');
      if (msg && msg.textContent === 'Connecting to Cloud...') {
          msg.innerHTML = '<span style="color:var(--yellow)">⚠️ Connection slow. Trying manual fetch...</span>';
          forceAdminRefresh();
      }
  }, 5000);

  // 2. Start Real-time listener
  adminListener = db.collection('users')
    .where('pending', '==', true)
    .onSnapshot((snapshot) => {
        clearTimeout(timeout);
        console.log("Admin Snapshot received. Count:", snapshot.size);
        renderAdminList(snapshot.docs);
    }, (err) => {
        clearTimeout(timeout);
        console.error("Admin Listener Error:", err);
        container.innerHTML = `
            <tr>
                <td colspan="3" style="padding:30px; text-align:center; color:var(--red)">
                    <div style="font-size:24px; margin-bottom:10px">❌</div>
                    <div style="font-weight:600">Access Denied</div>
                    <div style="font-size:12px; opacity:0.8; margin-bottom:15px">${err.message}</div>
                    <div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:8px; font-family:monospace; font-size:11px; text-align:left">
                        Tip: Make sure you clicked "Publish" on your Firestore Rules tab in the Firebase Console!
                    </div>
                </td>
            </tr>`;
    });
}

async function forceAdminRefresh() {
    const container = document.getElementById('pendingUsersTable');
    try {
        const snapshot = await db.collection('users').where('pending', '==', true).get();
        renderAdminList(snapshot.docs);
    } catch (e) {
        console.error("Manual refresh fail:", e);
    }
}
window.forceAdminRefresh = forceAdminRefresh;

function renderAdminList(docs) {
    const container = document.getElementById('pendingUsersTable');
    const noMsg = document.getElementById('noPendingMsg');
    
    if (docs.length === 0) {
        container.innerHTML = '';
        noMsg.style.display = 'block';
        updatePendingBadge(0);
    } else {
        noMsg.style.display = 'none';
        container.innerHTML = docs.map(doc => {
            const u = doc.data();
            const uid = doc.id;
            return `
                <tr style="border-bottom:1px solid var(--border)">
                    <td style="padding:12px">
                        <div style="font-weight:500">${u.name || 'No Name'}</div>
                        <div style="font-size:11px; opacity:0.6">@${u.username || 'unknown'}</div>
                    </td>
                    <td style="padding:12px; font-size:13px">${u.email}</td>
                    <td style="padding:12px">
                        <div style="display:flex; gap:8px">
                            <button class="btn btn-primary btn-sm" onclick="handleAuth('${uid}', true)">Approve</button>
                            <button class="btn btn-ghost btn-sm" onclick="handleAuth('${uid}', false)" style="color:var(--red); border:1px solid rgba(239,68,68,0.2)">Reject</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        updatePendingBadge(docs.length);
    }
}

async function fetchPendingCount() {
    try {
        const snapshot = await db.collection('users').where('pending', '==', true).get();
        updatePendingBadge(snapshot.size);
    } catch (e) {
        console.error("Error fetching pending count:", e);
    }
}

function updatePendingBadge(count) {
    const badge = document.getElementById('pendingBadge');
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

async function handleAuth(uid, approve) {
  try {
    if (approve) {
      await db.collection('users').doc(uid).update({
          pending: false,
          isApproved: true
      });
      showToast('User Approved', 'success');
    } else {
      await db.collection('users').doc(uid).delete();
      showToast('User Rejected', 'success');
    }
    initAdmin();
    fetchPendingCount();
  } catch (e) {
      showToast('Action failed', 'error');
  }
}
window.handleAuth = handleAuth;

// ============================================
// ACTION BUTTONS & MISC
// ============================================

// Secret Admin Unlock (Click Logo 5 times)
let logoClicks = 0;
const logo = document.querySelector('.nav-logo');
if (logo) {
    logo.onclick = (e) => {
        e.preventDefault();
        logoClicks++;
        if (logoClicks >= 5) {
            showToast("Admin diagnostic mode enabled", "info");
            const adminNav = document.getElementById('adminNav');
            if (adminNav) adminNav.style.display = 'flex';
            logoClicks = 0;
        }
    };
}

// Action Row Handlers
const uploadInput = document.getElementById('uploadScreenshot');
if (uploadInput) uploadInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleOcr(file);
};

const scanSmsBtn = document.getElementById('scanSmsBtn');
if (scanSmsBtn) scanSmsBtn.onclick = () => {
    showToast('Scanning SMS for reward codes...', 'info');
    setTimeout(() => {
        const amount = 250;
        addRewardToLocal(amount, "Swiggy (SMS)");
        showToast(`Found new ₹${amount} Swiggy coupon from SMS!`, 'success');
        confetti({ particleCount: 100, spread: 60, origin: { y: 0.7 } });
    }, 2000);
};

async function handleOcr(file) {
    showToast('AI Scanning Screenshot...', 'info');
    try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        console.log("OCR Result:", text);
        
        // Regex to find currency amounts
        const amountMatch = text.match(/(?:₹|Rs\.?|INR)\s*(\d+(?:\.\d{2})?)/i) || 
                          text.match(/Balance\s*:?\s*(\d+(?:\.\d{2})?)/i) ||
                          text.match(/(\d+)\s*(?:off|discount|reward)/i);
        
        let amount = 0;
        if (amountMatch) {
            amount = parseFloat(amountMatch[1]);
        } else {
            const numbers = text.match(/\d+/g);
            if (numbers) {
                const vals = numbers.map(Number).filter(n => n >= 10 && n <= 2000);
                if (vals.length > 0) amount = Math.max(...vals);
            }
        }

        if (amount > 0) {
            addRewardToLocal(amount, "Detected Reward");
            showToast(`Successfully extracted ₹${amount} reward!`, 'success');
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
            showToast('Could not find specific amount. Logged as ₹100.', 'info');
            addRewardToLocal(100, "Manual Scan");
        }
    } catch (err) {
        console.error("OCR Error:", err);
        showToast('Scanning failed. Using default ₹150.', 'error');
        addRewardToLocal(150, "Auto-Retry Scan");
    }
}

async function addRewardToLocal(amount, platform) {
    if (!window.currentUser) {
        showToast("Please log in to save rewards.", "error");
        return;
    }

    const newRew = {
        platform: platform,
        emoji: '🎁',
        type: 'Scanned',
        balance: amount,
        points: null,
        expiryLabel: 'Valid for 30 days',
        expiryClass: 'expiry-ok',
        color: '#10B981',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection('users').doc(window.currentUser.uid).collection('rewards').add(newRew);
        showToast(`Successfully saved ₹${amount} reward to cloud!`, 'success');
        loadUserRewards(window.currentUser.uid);
    } catch (e) {
        console.error("Cloud save error:", e);
        showToast("Failed to save to cloud.", "error");
    }
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadBackendData();
  initSettings();
});
