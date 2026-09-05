import { galleryData, memberRoles } from './data.js';

let currentChannel = 'all';
let currentView = 'chat';

function init() {
  lucide.createIcons();
  renderMembers();
  renderFeed();
}

function renderFeed() {
  const feed = document.getElementById("main-feed");
  feed.innerHTML = "";

  if (currentView === 'discover') {
    renderDiscoverView(feed);
    return;
  }

  const items = currentChannel === 'all' 
    ? galleryData 
    : galleryData.filter(i => i.category === currentChannel);

  items.forEach(item => {
    const msg = document.createElement("div");
    msg.className = "flex gap-4 hover:bg-[#2e3035] -mx-4 px-4 py-2 rounded transition-colors";
    msg.innerHTML = `
      <img src="${item.avatar}" class="w-10 h-10 rounded-full bg-[#1e1f22] flex-shrink-0">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-sm" style="color: ${item.roleColor}">${item.artist}</span>
          <span class="text-[10px] text-[#949ba4]">${item.timestamp}</span>
        </div>
        
        <!-- Discord Embed Card (Screenshot 3) -->
        <div class="discord-embed mt-2" style="border-left-color: ${item.embedColor}">
          <h4 class="font-bold text-white text-sm mb-1">${item.title}</h4>
          <p class="text-xs text-[#dbdee1] mb-3">${item.description}</p>
          <img src="${item.imageUrl}" class="rounded max-h-[380px] w-auto object-cover cursor-pointer">
          <div class="mt-3 flex gap-1.5">
            ${item.tags.map(t => `<span class="bg-[#383a40] text-[10px] text-[#b5bac1] px-2 py-0.5 rounded">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
    feed.appendChild(msg);
  });
  lucide.createIcons();
}

// Discover Mode (Grid View matching Screenshot 2)
function renderDiscoverView(container) {
  container.className = "flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
  galleryData.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-[#2b2d31] rounded-lg overflow-hidden border border-[#1f2023] hover:shadow-xl transition-all";
    card.innerHTML = `
      <div class="h-32 bg-cover bg-center" style="background-image: url('${item.imageUrl}')"></div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-2">
          <img src="${item.avatar}" class="w-6 h-6 rounded-full">
          <span class="text-xs font-bold text-white">${item.artist}</span>
        </div>
        <h3 class="font-bold text-white text-sm mb-1">${item.title}</h3>
        <p class="text-xs text-[#949ba4] line-clamp-2">${item.description}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderMembers() {
  const sidebar = document.getElementById("member-sidebar");
  sidebar.innerHTML = "";

  memberRoles.forEach(role => {
    const group = document.createElement("div");
    group.innerHTML = `<h5 class="text-[11px] font-bold text-[#949ba4] tracking-wider mb-1">${role.name}</h5>`;
    
    role.members.forEach(m => {
      const item = document.createElement("div");
      item.className = "flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#35373c] cursor-pointer";
      item.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-[#1e1f22] flex items-center justify-center text-xs font-bold text-white relative">
          ${m.name[0]}
          <div class="w-2.5 h-2.5 ${m.status === 'online' ? 'bg-[#23a55a]' : 'bg-[#f0b232]'} rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-[#2b2d31]"></div>
        </div>
        <div class="flex flex-col min-w-0">
          <div class="flex items-center gap-1">
            <span class="text-xs font-medium truncate" style="color: ${role.color}">${m.name}</span>
            ${m.isBot ? `<span class="bg-[#5865f2] text-[9px] font-bold text-white px-1 rounded">BOT</span>` : ''}
          </div>
          ${m.activity ? `<span class="text-[10px] text-[#949ba4] truncate">${m.activity}</span>` : ''}
        </div>
      `;
      group.appendChild(item);
    });
    sidebar.appendChild(group);
  });
}

window.filterChannel = (cat) => {
  currentChannel = cat;
  currentView = 'chat';
  document.getElementById("main-feed").className = "flex-1 overflow-y-auto p-4 space-y-6";
  document.getElementById("header-title").innerText = cat;
  renderFeed();
};

window.switchView = (view) => {
  currentView = view;
  if (view === 'discover') {
    document.getElementById("header-title").innerText = "Discover / Community Cards";
    document.getElementById("member-sidebar").classList.add("hidden");
  } else {
    document.getElementById("member-sidebar").classList.remove("hidden");
  }
  renderFeed();
};

init();