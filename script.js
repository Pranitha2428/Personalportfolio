// ==========================================
// 1. SAMPLE PROFILES & DEFAULT DATA
// ==========================================
const studentProfiles = [
  {
    name: "Patla Poorna Pranitha Reddy",
    role: "2nd Year B.Tech Student (ECE)",
    bio: "Passionate about software design, digital logic, and autonomous hardware prototypes.",
    skills: ["Python", "Digital Logic", "HTML/CSS", "Embedded C"]
  },
  {
    name:"Lakshmi Shayana",
    role: "2nd Year B.Tech Student (CSE)",
    bio: "Focusing on full-stack web development, REST APIs, and relational database design.",
    skills: ["JavaScript", "Node.js", "React", "SQL"]
  },
  {
    name: "Savitri",
    role: "2nd Year B.Tech Student (ECE)",
    bio: "Interested in embedded systems, microcontroller programming, and IoT hardware.",
    skills: ["Embedded C", "Arduino", "Circuit Design"]
  },
  {
    name: "Sravanthi",
    role: "2nd Year B.Tech Student (AI & DS)",
    bio: "Working on data analysis, machine learning algorithms, and Python automation scripts.",
    skills: ["Python", "Pandas", "NumPy", "Data Visualization"]
  }
];

const defaultProjects = [
  {
    id: 1,
    title: "Autonomous Food Loader Prototype",
    desc: "Portion-control prototype trolley engineered for automated food handling in hostel mess environments.",
    tags: ["Hardware", "Embedded"]
  },
  {
    id: 2,
    title: "Sequential Logic & Counter Visualizer",
    desc: "Interactive web visualization suite for evaluating asynchronous counters, CPLDs, and state circuits.",
    tags: ["Software", "Digital Logic"]
  }
];

const defaultSkills = ["Python", "JavaScript (ES6)", "Digital Logic Circuit Design", "HTML5 & CSS Grid/Flexbox", "Embedded C"];

if (!localStorage.getItem('appProjects')) {
  localStorage.setItem('appProjects', JSON.stringify(defaultProjects));
}
if (!localStorage.getItem('appSkills')) {
  localStorage.setItem('appSkills', JSON.stringify(defaultSkills));
}

// ==========================================
// 2. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

// ==========================================
// 3. GLOBAL NAVIGATION FUNCTIONS
// ==========================================
function openPortal() {
  document.getElementById('portalScreen').style.display = 'flex';
  document.getElementById('userPage').style.display = 'none';
  document.getElementById('adminPage').style.display = 'none';
  showToast("Switched to Main Portal");
}

function openUserPage() {
  document.getElementById('portalScreen').style.display = 'none';
  document.getElementById('userPage').style.display = 'block';
  document.getElementById('adminPage').style.display = 'none';
  renderProfiles();
  renderSkills();
  renderProjects('all');
  showToast("Entered User Module");
}

function openAdminPage() {
  const pin = prompt("Enter Admin Passcode to unlock Admin Page:", "1234");
  if (pin === "1234" || pin === "admin") {
    document.getElementById('portalScreen').style.display = 'none';
    document.getElementById('userPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'block';
    renderSkills();
    renderProjects('all');
    renderMessages();
    showToast("Admin Dashboard Unlocked");
  } else if (pin !== null) {
    alert("Incorrect passcode! Admin access denied.");
  }
}

// ==========================================
// 4. RENDER FUNCTIONS
// ==========================================

// A. Render Profile Search Cards
function renderProfiles(searchTerm = "") {
  const profilesGrid = document.getElementById("userProfilesGrid");
  if (!profilesGrid) return;

  const term = searchTerm.toLowerCase().trim();

  const filtered = studentProfiles.filter(profile => {
    const matchesName = profile.name.toLowerCase().includes(term);
    const matchesRole = profile.role.toLowerCase().includes(term);
    const matchesBio = profile.bio.toLowerCase().includes(term);
    const matchesSkills = profile.skills.some(skill => skill.toLowerCase().includes(term));

    return matchesName || matchesRole || matchesBio || matchesSkills;
  });

  if (filtered.length === 0) {
    profilesGrid.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">No matching student profiles found.</p>`;
    return;
  }

  profilesGrid.innerHTML = filtered.map(p => `
    <div class="card">
      <div>
        <h3 style="font-size: 1rem; margin-bottom: 0.2rem; color: #0f172a;">${p.name}</h3>
        <p style="font-size: 0.75rem; color: #2563eb; font-weight: 600; margin-bottom: 0.5rem;">${p.role}</p>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.8rem;">${p.bio}</p>
        <div>
          ${p.skills.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// B. Render Skills
function renderSkills() {
  const skills = JSON.parse(localStorage.getItem('appSkills') || '[]');
  const userSkillsList = document.getElementById('userSkillsList');
  const adminSkillsList = document.getElementById('adminSkillsList');
  
  if (userSkillsList) {
    userSkillsList.innerHTML = skills.map(skill => `<span class="badge">${skill}</span>`).join('');
  }

  if (adminSkillsList) {
    adminSkillsList.innerHTML = skills.map((skill, index) => `
      <span class="badge">
        ${skill} 
        <span class="skill-delete" onclick="deleteSkill(${index})">&times;</span>
      </span>
    `).join('');
  }
}

function deleteSkill(index) {
  const skills = JSON.parse(localStorage.getItem('appSkills') || '[]');
  skills.splice(index, 1);
  localStorage.setItem('appSkills', JSON.stringify(skills));
  renderSkills();
  showToast("Skill deleted successfully");
}

// C. Render Projects
function renderProjects(filterTag = 'all') {
  const projects = JSON.parse(localStorage.getItem('appProjects') || '[]');
  const projectGrid = document.getElementById('projectGrid');
  const adminPage = document.getElementById('adminPage');
  if (!projectGrid) return;

  const filtered = filterTag === 'all' 
    ? projects 
    : projects.filter(p => p.tags.some(t => t.toLowerCase() === filterTag.toLowerCase()));

  if (filtered.length === 0) {
    projectGrid.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">No project entries found for this tag filter.</p>`;
    return;
  }

  const isAdmin = adminPage && adminPage.style.display === 'block';

  projectGrid.innerHTML = filtered.map(p => `
    <div class="card">
      <div>
        <h3 style="font-size: 1rem; margin-bottom: 0.3rem;">${p.title}</h3>
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 0.8rem;">${p.desc}</p>
        <div>${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      ${isAdmin ? `<button class="btn btn-danger" style="margin-top: 0.8rem;" onclick="deleteProject(${p.id})">Delete Project</button>` : ''}
    </div>
  `).join('');
}

function deleteProject(id) {
  let projects = JSON.parse(localStorage.getItem('appProjects') || '[]');
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem('appProjects', JSON.stringify(projects));
  renderProjects('all');
  showToast("Project deleted!");
}

// D. Render Inquiry Messages
function renderMessages() {
  const msgs = JSON.parse(localStorage.getItem('userInquiries') || '[]');
  const msgTableBody = document.getElementById('msgTableBody');
  if (!msgTableBody) return;

  if (msgs.length > 0) {
    msgTableBody.innerHTML = msgs.map((m, index) => `
      <tr>
        <td><strong>${m.sender}</strong></td>
        <td>${m.text}</td>
        <td><button class="btn btn-danger" onclick="deleteMessage(${index})">Remove</button></td>
      </tr>
    `).join('');
  } else {
    msgTableBody.innerHTML = `<tr><td colspan="3" style="color: #94a3b8;">No user messages received yet.</td></tr>`;
  }
}

function deleteMessage(index) {
  const msgs = JSON.parse(localStorage.getItem('userInquiries') || '[]');
  msgs.splice(index, 1);
  localStorage.setItem('userInquiries', JSON.stringify(msgs));
  renderMessages();
  showToast("Message removed");
}

// ==========================================
// 5. DOM CONTENT LOADED INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // Profile Search Listener
  const searchInput = document.getElementById("profileSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderProfiles(e.target.value);
    });
  }

  // Bio Setup & Save Handler
  const savedBio = localStorage.getItem('profileBio');
  const bioText = document.getElementById('bioText');
  const adminBioIn = document.getElementById('adminBioIn');
  const saveBioBtn = document.getElementById('saveBioBtn');

  if (savedBio && bioText) bioText.innerText = savedBio;
  if (adminBioIn && bioText) adminBioIn.value = bioText.innerText;

  if (saveBioBtn) {
    saveBioBtn.addEventListener('click', () => {
      if (adminBioIn) {
        const updated = adminBioIn.value.trim();
        if (updated) {
          localStorage.setItem('profileBio', updated);
          if (bioText) bioText.innerText = updated;
          showToast("Profile bio updated!");
        }
      }
    });
  }

  // Add Skill Handler
  const addSkillForm = document.getElementById('addSkillForm');
  if (addSkillForm) {
    addSkillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newSkillInput');
      const val = input.value.trim();
      if (val) {
        const skills = JSON.parse(localStorage.getItem('appSkills') || '[]');
        skills.push(val);
        localStorage.setItem('appSkills', JSON.stringify(skills));
        input.value = '';
        renderSkills();
        showToast("Skill added!");
      }
    });
  }

  // Add Project Handler
  const addProjForm = document.getElementById('addProjForm');
  if (addProjForm) {
    addProjForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('pTitle').value.trim();
      const desc = document.getElementById('pDesc').value.trim();
      const tagsRaw = document.getElementById('pTags').value.trim();

      if (title && desc) {
        const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : ["General"];
        const projects = JSON.parse(localStorage.getItem('appProjects') || '[]');
        
        const newProj = {
          id: Date.now(),
          title,
          desc,
          tags
        };

        projects.push(newProj);
        localStorage.setItem('appProjects', JSON.stringify(projects));
        addProjForm.reset();
        renderProjects('all');
        showToast("Project published!");
      }
    });
  }

  // User Message Form Handler
  const userMsgForm = document.getElementById('userMsgForm');
  if (userMsgForm) {
    userMsgForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = document.getElementById('uName').value.trim();
      const text = document.getElementById('uMsg').value.trim();

      if (sender && text) {
        const msgs = JSON.parse(localStorage.getItem('userInquiries') || '[]');
        msgs.push({ sender, text });
        localStorage.setItem('userInquiries', JSON.stringify(msgs));
        userMsgForm.reset();
        showToast("Message sent to Admin inbox!");
        renderMessages();
      }
    });
  }

  // Clear Messages Handler
  const btnClearMsgs = document.getElementById('btnClearMsgs');
  if (btnClearMsgs) {
    btnClearMsgs.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all received messages?")) {
        localStorage.setItem('userInquiries', JSON.stringify([]));
        renderMessages();
        showToast("All messages cleared");
      }
    });
  }

  // Filter Buttons Handler
  const projectFilters = document.getElementById('projectFilters');
  if (projectFilters) {
    projectFilters.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        const filter = e.target.getAttribute('data-filter');
        document.querySelectorAll('#projectFilters button').forEach(b => b.classList.replace('btn-primary', 'btn-outline'));
        e.target.classList.replace('btn-outline', 'btn-primary');
        renderProjects(filter);
      }
    });
  }

  // Initial Population
  renderProfiles();
  renderSkills();
  renderProjects('all');
  renderMessages();
});