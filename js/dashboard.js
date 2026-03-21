/* ============================================
   REWARDSYNC — Dashboard App JavaScript
   ============================================ */

'use strict';

// ============================================
// DATA (Coupons System)
// ============================================
const COUPONS_DATA = [
  { id: 'c1', platform: 'Amazon', code: 'SAVE200', value: '₹200 OFF', category: 'Shopping', logoUrl: 'assets/logos/amazon.png', emoji: '🛒', status: 'active', expiryDate: '2026-04-12', createdAt: Date.now() },
  { id: 'c2', platform: 'Swiggy', code: 'SWIGGYIT', value: '₹100 OFF', category: 'Food', logoUrl: 'assets/logos/swiggy.png', emoji: '🍔', status: 'available', expiryDate: '2026-03-25', createdAt: Date.now() },
  { id: 'c3', platform: 'Zomato', code: 'ZOMATO50', value: '50% OFF', category: 'Food', logoUrl: 'assets/logos/zomato.png', emoji: '🍕', status: 'active', expiryDate: '2026-03-10', createdAt: Date.now() },
  { id: 'c4', platform: 'Uber', code: 'UBER150', value: '₹150 OFF', category: 'Travel', logoUrl: 'assets/logos/mmt.png', emoji: '🚕', status: 'available', expiryDate: '2026-04-01', createdAt: Date.now() },
  { id: 'c5', platform: 'Flipkart', code: 'PLUSVIP', value: 'Flat ₹150 OFF', category: 'Shopping', logoUrl: '', emoji: '🔶', status: 'used', expiryDate: '2026-02-15', createdAt: Date.now() },
  { id: 'c6', platform: 'BookMyShow', code: 'BMS200', value: '₹200 Discount', category: 'Entertainment', logoUrl: '', emoji: '🎬', status: 'active', expiryDate: '2026-03-28', createdAt: Date.now() },
  { id: 'c7', platform: 'Netflix', code: 'NTFLX6M', value: '6 Months Free', category: 'Entertainment', logoUrl: '', emoji: '📺', status: 'available', expiryDate: '2026-08-15', createdAt: Date.now() },
];

let REWARDS_DATA = [...COUPONS_DATA]; // Keeping name for compatibility
let CONNECTIONS_DATA = [...COUPONS_DATA];
let TOTAL_BALANCE = COUPONS_DATA.reduce((sum, r) => {
    const val = parseInt((r.value || "0").replace(/[^\d]/g, "")) || 0;
    return sum + val;
}, 0);

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
  { id: 0, name: 'Swiggy', emoji: '🍔', logoUrl: 'assets/logos/swiggy.png', category: 'food', originalVal: 200, askingVal: 160, desc: '₹200 Swiggy discount coupon valid on orders above ₹299', expiry: 'Expires Mar 8, 2026' },
  { id: 0, name: 'Amazon', emoji: '🛒', logoUrl: 'assets/logos/amazon.png', category: 'shopping', originalVal: 500, askingVal: 420, desc: '₹500 Amazon Pay balance available for immediate transfer', expiry: 'Expires Mar 20, 2026' },
  { id: 0, name: 'Zomato', emoji: '🍕', logoUrl: 'assets/logos/zomato.png', category: 'food', originalVal: 150, askingVal: 125, desc: '₹150 Zomato coupon, usable on any food order', expiry: 'Expires Mar 12, 2026' },
  { id: 0, name: 'Air India', emoji: '✈️', logoUrl: 'assets/logos/mmt.png', category: 'travel', originalVal: 800, askingVal: 650, desc: '2000 Air India Miles (~₹800 value) for domestic flights', expiry: 'Expires Apr 30, 2026' },
  { id: 0, name: 'BookMyShow', emoji: '🎬', logoUrl: '', category: 'entertainment', originalVal: 200, askingVal: 175, desc: '₹200 off on movie tickets. Valid for 2 tickets', expiry: 'Expires Mar 28, 2026' },
  { id: 0, name: 'Flipkart', emoji: '🔶', logoUrl: '', category: 'shopping', originalVal: 300, askingVal: 260, desc: '₹300 Flipkart SuperCoin worth of value. No min order', expiry: 'Expires Apr 15, 2026' },
];

const NOTIFICATIONS_DATA = [
  { type: 'urgent', icon: '⏰', logoUrl: 'assets/logos/cred.png', iconBg: 'rgba(239,68,68,0.15)', title: 'CRED Reward Expiring in 2 Days!', desc: 'You have ₹180 (360 coins) in CRED that will expire on March 3rd. Use it before it\'s gone!', time: 'Just now', action: 'Use Now', unread: true },
  { type: 'urgent', icon: '⚡', logoUrl: 'assets/logos/swiggy.png', iconBg: 'rgba(245,158,11,0.15)', title: 'Swiggy Coupon Expires in 4 Days', desc: '₹200 Swiggy reward expires on March 5th. Order food now to redeem it at max value.', time: '15 min ago', action: 'Order Now', unread: true },
  { type: 'unread', icon: '🤖', logoUrl: '', iconBg: 'rgba(124,58,237,0.15)', title: 'AI Tip: Best Redemption Combo Found', desc: 'Combine your Swiggy + CRED rewards for a total saving of ₹380 on your next food order tonight.', time: '1 hour ago', action: 'View Tip', unread: true },
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
        initNotifications(user.uid);
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

function getLogoHtml(item, customClass = '') {
    if (item.logoUrl) {
        return `<img src="${item.logoUrl}" class="platform-logo ${customClass}" alt="${item.platform || item.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <span class="platform-emoji-fallback" style="display:none">${item.emoji || '🎁'}</span>`;
    }
    return `<span class="platform-emoji">${item.emoji || '🎁'}</span>`;
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

// Ensure first page load works
window.addEventListener('DOMContentLoaded', () => {
    handleHash();
});

window.addEventListener('hashchange', handleHash);

function initAdmin() {
    console.log("Admin Panel initialized");
    // Admin logic is handled in the admin tab rendering
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
  initOcrActions();
  
  const totalEl = document.getElementById('totalBalance');
  if (totalEl) animateCounter(totalEl, TOTAL_BALANCE, '₹');

  const activeCard = document.getElementById('activeRewardsCard');
  if (activeCard) {
    activeCard.onclick = () => {
        const header = document.getElementById('activeRewardsHeader');
        if (header) {
            header.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Force expand if hidden
            const filtersContainer = document.getElementById('rewardFilters');
            const icon = document.getElementById('sectorToggleIcon');
            if (filtersContainer && (filtersContainer.style.display === 'none' || filtersContainer.style.maxHeight === '0px')) {
                filtersContainer.style.display = 'flex';
                filtersContainer.style.maxHeight = '200px';
                filtersContainer.style.marginBottom = '20px';
                if (icon) icon.style.transform = 'rotate(180deg)';
                renderRewardBreakdown('all'); // Ensure it's showing all categorized sectors
            }
        }
    };
  }

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
  const now = new Date().toISOString().split('T')[0];
  
  const filtered = category === 'all' 
    ? REWARDS_DATA 
    : REWARDS_DATA.filter(r => r.category === category);

  if (filtered.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted); width:100%">No coupons found.</div>';
    return;
  }

  const grouped = filtered.reduce((acc, r) => {
    const cat = r.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(r);
    return acc;
  }, {});

  let html = '';
  for (const [cat, items] of Object.entries(grouped)) {
    html += `<div class="reward-category-title">${cat}</div>`;
    html += items.map(r => {
        const isPast = r.expiryDate < now;
        return `
          <div class="reward-item" onclick="navigateTo('wallet')" style="cursor:pointer; ${isPast ? 'opacity:0.6' : ''}">
            <div class="reward-platform-icon" style="background:rgba(255,255,255,0.03); color:white; display:flex; align-items:center; justify-content:center">
              ${getLogoHtml(r)}
            </div>
            <div class="reward-info">
              <div class="reward-platform">${r.platform}</div>
              <div class="reward-desc" style="font-family:monospace; color:var(--purple-light)">${r.code}</div>
            </div>
            <div style="text-align:right">
              <div class="reward-value">${r.value}</div>
              <span class="reward-expiry ${isPast ? 'expiry-alert' : 'expiry-ok'}">${isPast ? 'Expired' : 'Expires ' + r.expiryDate}</span>
            </div>
          </div>
        `;
    }).join('');
  }
  container.innerHTML = html;
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

function initWallet(filter = 'all') {
  const container = document.getElementById('walletPlatforms');
  if (!container) return;

  const now = new Date().toISOString().split('T')[0];
  
  // 1. Filter logic
  let filtered = REWARDS_DATA.filter(c => {
    const isPast = c.expiryDate < now;
    if (filter === 'available') return c.status !== 'used' && !isPast;
    if (filter === 'used') return c.status === 'used';
    if (filter === 'expired') return isPast;
    return true; // all
  });

  // 2. Clear and Render Tabs
  const tabs = document.querySelectorAll('#walletTabs .tab-btn');
  tabs.forEach(t => {
      t.classList.toggle('active', t.dataset.filter === filter);
      t.onclick = () => initWallet(t.dataset.filter);
  });

  // 3. Group by Category
  const grouped = filtered.reduce((acc, c) => {
    const cat = c.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:50px; color:var(--text-muted); grid-column: 1/-1">No coupons found for "${filter}".</div>`;
      return;
  }

  container.innerHTML = Object.entries(grouped).map(([cat, coupons]) => `
    <div class="wallet-category-section" style="grid-column: 1/-1">
      <h2 class="category-title">${getCategoryIcon(cat)} ${cat}</h2>
      <div class="wallet-platforms-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:20px">
        ${coupons.map(c => renderCouponCard(c, now)).join('')}
      </div>
    </div>
  `).join('');
}

function getCategoryIcon(cat) {
    const icons = { Shopping: '🛒', Food: '🍔', Travel: '🚕', Entertainment: '🎬', Other: '🎁' };
    return icons[cat] || '🎁';
}

function renderCouponCard(c, now) {
    const isExpired = c.expiryDate < now;
    const isUsed = c.status === 'used';
    const isInTrade = c.status === 'in_trade';
    let statusLabel = 'Available';
    let statusClass = 'status-available';

    if (isUsed) { statusLabel = 'Used'; statusClass = 'status-used'; }
    else if (isExpired) { statusLabel = 'Expired'; statusClass = 'status-expired'; }
    else if (isInTrade) { statusLabel = 'In Trade'; statusClass = 'status-in-trade'; }

    return `
      <div class="platform-card coupon-box ${isExpired || isUsed ? 'opacity-muted' : ''}">
        <div class="platform-card-header">
          <div class="platform-icon-wrap" style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); border-radius:8px; margin-right:12px">
              ${getLogoHtml(c)}
          </div>
          <div style="flex:1">
            <div class="platform-name">${c.platform}</div>
            <div class="coupon-code-label" style="font-family:monospace; color:var(--purple-light); font-weight:700; font-size:14px; margin-top:2px">${c.code}</div>
          </div>
          <div style="text-align:right">
            <div class="platform-amount" style="font-size:16px">${c.value}</div>
            <div class="status-badge ${statusClass}">${statusLabel}</div>
          </div>
        </div>
        <div class="platform-balance" style="margin-top:15px; border-top:1px solid var(--border); padding-top:10px">
          <div style="font-size:12px; color:var(--text-muted)">Expires: ${c.expiryDate}</div>
          <div class="platform-status-dot" style="background:${isExpired ? 'var(--red)' : (isUsed ? '#9ca3af' : 'var(--green)')}"></div>
        </div>
      </div>
    `;
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

function initMarketplace(activeTab = 'exchange') {
    const tabs = document.querySelectorAll('.mp-tab');
    if (tabs.length === 0) return;

    // 1. Tab Switching UI
    tabs.forEach(tab => {
        const isCurrent = tab.dataset.tab === activeTab;
        tab.classList.toggle('active', isCurrent);
        tab.style.background = isCurrent ? 'var(--purple-main)' : 'none';
        tab.style.color = isCurrent ? 'white' : 'var(--text-muted)';
        tab.style.fontWeight = isCurrent ? '600' : '500';
        tab.onclick = () => initMarketplace(tab.dataset.tab);
    });

    // 2. Hide all tab content, show active one
    document.querySelectorAll('.mp-tab-content').forEach(content => {
        content.style.display = content.id === `tab-${activeTab}` ? 'block' : 'none';
    });

    // 3. Populate Active Count Stat
    const activeDealsEl = document.getElementById('activeDealsCount');
    if (activeDealsEl) activeDealsEl.innerText = (REWARDS_DATA.filter(r => r.status === 'active').length + 12).toString();

    // 4. Tab Specific Logic
    if (activeTab === 'exchange') {
        renderExchangeTab();
    } else if (activeTab === 'trending') {
        renderTrendingTab();
    } else if (activeTab === 'history') {
        renderHistoryTab();
    }
}

let selectedExchangeRewardId = null;

function renderExchangeTab() {
    const rewardsContainer = document.getElementById('exchangeableRewards');
    const offersContainer = document.getElementById('exchangeOffers');
    if (!rewardsContainer || !offersContainer) return;

    // Filter user's rewards for exchange (Min value ₹50)
    const exchangeable = REWARDS_DATA.filter(r => r.value >= 50 && r.status === 'active');

    if (exchangeable.length === 0) {
        rewardsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:40px; color:var(--text-muted)">
                <p>No rewards available for exchange (Min. ₹50 required)</p>
            </div>`;
    } else {
        rewardsContainer.innerHTML = exchangeable.map(r => `
            <div class="exchange-reward-card" 
                 onclick="selectRewardForExchange(${r.id})" 
                 style="background:rgba(255,255,255,0.03); border:1px solid ${selectedExchangeRewardId == r.id ? 'var(--purple-main)' : 'var(--border)'}; padding:12px; border-radius:12px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:0.2s; ${selectedExchangeRewardId == r.id ? 'box-shadow: 0 0 15px rgba(124,58,237,0.2)' : ''}">
                 <div style="width:40px; height:40px; background:rgba(255,255,255,0.05); border-radius:8px; display:flex; align-items:center; justify-content:center">
                    ${getLogoHtml(r)}
                 </div>
                 <div style="flex:1">
                    <p style="margin:0; font-size:13px; font-weight:600">${r.platform}</p>
                    <p style="margin:0; font-size:11px; color:var(--text-muted)">₹${r.value}</p>
                 </div>
                 ${selectedExchangeRewardId == r.id ? '<div style="color:var(--purple-light)">⭐</div>' : ''}
            </div>
        `).join('');
    }

    // Render Exchange Offers / Rates
    const offers = [
        { from: 'Amazon Pay', to: 'Swiggy', rate: 1.1, volume: 'High', color: '#FF9900' },
        { from: 'Paytm', to: 'Amazon Pay', rate: 1.05, volume: 'Hot', color: '#00BAF2' },
        { from: 'PhonePe', to: 'Zomato', rate: 0.95, volume: 'Stable', color: '#5F259F' },
        { from: 'Cred', to: 'Amazon Pay', rate: 1.08, volume: 'Trending', color: '#00D09C' }
    ];

    offersContainer.innerHTML = offers.map(o => `
        <div class="offer-row" style="background:var(--bg-card); border:1px solid var(--border); border-radius:15px; padding:15px; display:flex; align-items:center; justify-content:space-between">
            <div style="display:flex; align-items:center; gap:20px; flex:1">
                <div style="text-align:center">
                    <p style="font-size:10px; color:var(--text-muted); margin-bottom:4px">FROM</p>
                    <div style="background:rgba(255,255,255,0.05); padding:6px 12px; border-radius:8px; color:white; font-size:13px; font-weight:600">${o.from}</div>
                </div>
                <div style="color:var(--purple-light)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 8 4 4-4 4M2 12h20M6 8l-4 4 4 4"/></svg>
                </div>
                <div style="text-align:center">
                    <p style="font-size:10px; color:var(--text-muted); margin-bottom:4px">TO</p>
                    <div style="background:rgba(255,255,255,0.05); padding:6px 12px; border-radius:8px; color:white; font-size:13px; font-weight:600">${o.to}</div>
                </div>
            </div>
            
            <div style="text-align:center; padding: 0 30px">
                <p style="font-size:10px; color:var(--text-muted); margin-bottom:4px">RATE</p>
                <p style="color:var(--green); font-weight:700; font-size:16px; margin:0">1:${o.rate}</p>
            </div>

            <div style="display:flex; align-items:center; gap:15px">
                <span class="badge" style="background:rgba(255,255,255,0.03); color:var(--text-muted); font-size:10px">${o.volume}</span>
                <button class="btn btn-primary btn-sm" onclick="initiateExchange('${o.from}', '${o.to}', ${o.rate})" 
                        ${selectedExchangeRewardId ? '' : 'disabled style="opacity:0.5; cursor:not-allowed"'}>
                    Exchange
                </button>
            </div>
        </div>
    `).join('');
}

function selectRewardForExchange(id) {
    selectedExchangeRewardId = id;
    renderExchangeTab();
}

async function initiateExchange(from, to, rate) {
    if (!selectedExchangeRewardId) return;
    const reward = REWARDS_DATA.find(r => r.id == selectedExchangeRewardId);
    if (!reward) return;

    if (confirm(`Confirm Exchange: Transfer your ₹${reward.value} ${reward.platform} Reward for ${to} credits at 1:${rate} rate?`)) {
        showToast('Processing Exchange...', 'info');
        await new Promise(r => setTimeout(r, 1500));
        
        reward.status = 'used'; // Mark old one as used
        const newValue = Math.floor(reward.value * rate);
        
        // Add new reward
        REWARDS_DATA.push({
            id: Date.now(),
            platform: to,
            value: newValue,
            code: 'EXCH-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            expiryDate: reward.expiryDate,
            category: reward.category,
            status: 'active',
            source: 'marketplace'
        });

        // Add to history
        if (!window.EXCHANGE_HISTORY) window.EXCHANGE_HISTORY = [];
        window.EXCHANGE_HISTORY.push({
            from: reward.platform,
            to: to,
            fromValue: reward.value,
            toValue: newValue,
            date: new Date().toLocaleDateString()
        });

        selectedExchangeRewardId = null;
        showToast('coupon exchanged', 'success');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        
        renderAll();
        initMarketplace('history');
    }
}

function renderTrendingTab() {
    const grid = document.getElementById('trendingGrid');
    const gainers = document.getElementById('topGainers');
    const traded = document.getElementById('mostTraded');
    if (!grid) return;

    const trends = [
        { pair: 'Paytm → Amazon', vol: '₹2.5M', change: '+12%', color: 'var(--green)' },
        { pair: 'Cred → Swiggy', vol: '₹1.8M', change: '+8%', color: 'var(--green)' },
        { pair: 'PhonePe → Flipkart', vol: '₹1.2M', change: '+15%', color: 'var(--green)' }
    ];

    grid.innerHTML = trends.map((t, i) => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border); padding:15px; border-radius:12px; display:flex; justify-content:space-between; align-items:center">
            <div style="display:flex; align-items:center; gap:12px">
                <span style="font-weight:700; color:var(--text-muted)">#${i+1}</span>
                <span style="font-weight:600; color:white">${t.pair}</span>
            </div>
            <div style="text-align:right">
                <p style="margin:0; color:${t.color}; font-weight:700">${t.change}</p>
                <p style="margin:0; font-size:11px; color:var(--text-muted)">Vol: ${t.vol}</p>
            </div>
        </div>
    `).join('');

    gainers.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px">
            <div style="display:flex; justify-content:space-between"><span>Amazon Pay</span> <span style="color:var(--green)">+15%</span></div>
            <div style="display:flex; justify-content:space-between"><span>Flipkart</span> <span style="color:var(--green)">+12%</span></div>
            <div style="display:flex; justify-content:space-between"><span>PhonePe</span> <span style="color:var(--green)">+8%</span></div>
        </div>
    `;

    traded.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:10px">
            <div style="display:flex; justify-content:space-between"><span>Paytm</span> <span style="color:var(--purple-light)">₹5.2M</span></div>
            <div style="display:flex; justify-content:space-between"><span>Cred</span> <span style="color:var(--purple-light)">₹3.8M</span></div>
            <div style="display:flex; justify-content:space-between"><span>Swiggy</span> <span style="color:var(--purple-light)">₹2.1M</span></div>
        </div>
    `;
}

function renderHistoryTab() {
    const container = document.getElementById('exchangeHistory');
    if (!container) return;

    const history = window.EXCHANGE_HISTORY || [];

    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted)">No exchange history found. Start trading to see records here.</div>`;
        return;
    }

    container.innerHTML = history.reverse().map(h => `
        <div style="background:rgba(16,185,129,0.03); border:1px solid rgba(16,185,129,0.2); border-radius:15px; padding:15px; display:flex; align-items:center; justify-content:space-between">
            <div style="display:flex; align-items:center; gap:15px">
                 <div style="width:36px; height:36px; border-radius:10px; background:rgba(16,185,129,0.2); display:flex; align-items:center; justify-content:center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                 </div>
                 <div>
                    <p style="margin:0; font-weight:600">${h.from} → ${h.to}</p>
                    <p style="margin:0; font-size:11px; color:var(--text-muted)">${h.date} • Completed</p>
                 </div>
            </div>
            <div style="text-align:right">
                <p style="margin:0; font-weight:700">₹${h.fromValue} → ₹${h.toValue}</p>
                <span class="badge" style="background:rgba(16,185,129,0.2); color:#34d399; font-size:10px">Success</span>
            </div>
        </div>
    `).join('');
}


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
      <div class="notif-logo-wrap" style="background:${n.iconBg}">
        ${getLogoHtml(n)}
      </div>
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
            <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center">
                <button class="btn btn-ghost btn-sm" style="font-size:11px" onclick="forceAdminRefresh()">Manual Refresh</button>
                <button class="btn btn-ghost btn-sm" style="font-size:11px; border-color:var(--purple)" onclick="debugPermissions()">🔍 Debug Permissions</button>
                <button class="btn btn-ghost btn-sm" style="font-size:11px; color:var(--red)" onclick="showAllUsers()">🛑 Show All Users (Fallback)</button>
            </div>
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
        console.log("Admin: Manual Refresh Triggered");
        const snapshot = await db.collection('users').where('pending', '==', true).get();
        console.log("Admin: Manual Fetch Count:", snapshot.size);
        renderAdminList(snapshot.docs);
    } catch (e) {
        console.error("Manual refresh fail:", e);
        showAlert('Admin init error: ' + e.message, 'error');
    }
}
window.forceAdminRefresh = forceAdminRefresh;

async function debugPermissions() {
    console.log("--- DEBUG PERMISSIONS ---");
    if (!auth.currentUser) {
        console.error("No user logged in to Auth!");
        return;
    }
    console.log("Auth UID:", auth.currentUser.uid);
    try {
        const myDoc = await db.collection('users').doc(auth.currentUser.uid).get();
        if (myDoc.exists) {
            console.log("Your Firestore Profile:", myDoc.data());
        } else {
            console.error("Your UID doesn't have a document in Firestore 'users' collection!");
        }
        
        console.log("Attempting to read ANY user document...");
        const allUsers = await db.collection('users').limit(5).get();
        console.log("Successfully read", allUsers.size, "users from collection.");
        allUsers.forEach(d => console.log("User Found:", d.id, d.data()));
        
    } catch (e) {
        console.error("Debug Query failed:", e);
    }
}
window.debugPermissions = debugPermissions;

async function showAllUsers() {
    console.log("Admin: Fallback - Showing ALL Users (Unfiltered)");
    const container = document.getElementById('pendingUsersTable');
    try {
        const snapshot = await db.collection('users').limit(50).get();
        console.log("Admin: Total users found:", snapshot.size);
        renderAdminList(snapshot.docs);
        showToast("Showing all users (Unfiltered)", "info");
    } catch (e) {
        console.error("Show all failed:", e);
        showToast("Error reading collection: " + e.message, "error");
    }
}
window.showAllUsers = showAllUsers;

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
    console.log(`Admin: ${approve ? 'Approving' : 'Rejecting'} user UID: ${uid}`);
    if (approve) {
      await db.collection('users').doc(uid).update({
          pending: false,
          isApproved: true
      });
      showToast('User Approved Successfully!', 'success');
      console.log("Admin: Firestore update complete for UID:", uid);
    } else {
      await db.collection('users').doc(uid).delete();
      showToast('User Rejected', 'error');
    }
    initAdmin();
    fetchPendingCount();
  } catch (err) {
    console.error("Approval error:", err);
    showToast("Error: " + err.message, "error");
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
        console.log("OCR Raw Text:", text);
        
        const extracted = parseCouponData(text);
        openOcrModal(extracted);
    } catch (err) {
        console.error("OCR Error:", err);
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

// ============================================
// 🔔 PUSH NOTIFICATIONS (FCM)
// ============================================

async function initNotifications(uid) {
  try {
    console.log("🔔 Initializing Push Notifications for UID:", uid);

    // 1. Request Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn("🚫 Notification permission denied.");
      return;
    }

    // 2. Get FCM Token
    const token = await messaging.getToken({
      vapidKey: "BOM7_L9Y7_l9y7_L9Y7_l9y7_L9Y7_l9y7_L9Y7_l9y7_L9A" // Demo VAPID
    }).catch(e => console.log("FCM Token error (likely missing valid VAPID):", e));

    if (token) {
      console.log("🎫 FCM Token Generated:", token);
      // Save token to Firestore for this user
      await db.collection('users').doc(uid).update({ fcmToken: token });
    }

    // 3. Handle Foreground Messages
    messaging.onMessage((payload) => {
      console.log("📩 Foreground Message Received:", payload);
      showInAppNotification(payload.notification.title, payload.notification.body);
    });

  } catch (err) {
    console.error("🔔 Notification Init Error:", err);
  }
}

function showInAppNotification(title, body) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast info';
  toast.style.cssText = `
    border-left: 4px solid var(--purple-main);
    background: rgba(20, 10, 40, 0.95);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    animation: slideInRight 0.5s ease forwards;
  `;

  toast.innerHTML = `
    <div style="font-size:24px">🔔</div>
    <div>
      <div style="font-weight:700; color:white; margin-bottom:2px">${title}</div>
      <div style="font-size:12px; color:var(--text-muted)">${body}</div>
    </div>
  `;

  container.appendChild(toast);
  
  // Custom sound effect (optional)
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.play().catch(() => {});

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 500);
  }, 7000);
}
