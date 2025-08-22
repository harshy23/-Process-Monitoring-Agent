import './style.css';

// Tab toggles
document.querySelector(".system").addEventListener("click", () => {
  document.querySelector(".systems").style.display = "block";
  document.querySelector(".processes").style.display = "none";
  loadSystem(); // refresh system panel when opened
});

document.querySelector(".process").addEventListener("click", () => {
  document.querySelector(".systems").style.display = "none";
  document.querySelector(".processes").style.display = "block";
});

const API_URL = 'http://127.0.0.1:8000/api/process-data-view/'; 
const SYSTEM_URL = 'http://127.0.0.1:8000/api/system-info/';     
let processSearch = "";

// ---------------- Processes ----------------

async function fetchProcesses() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (e) {
    console.error('Fetch error:', e);
    return [];
  }
}

function buildTree(list) {
  const map = {};
  const roots = [];
  list.forEach(p => { map[p.pid] = { ...p, children: [] }; });
  list.forEach(p => {
    const node = map[p.pid];
    if (p.parent_pid && map[p.parent_pid]) {
      map[p.parent_pid].children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function rowHTML(proc, level) {
  const hasKids = proc.children && proc.children.length > 0;
  const indent = level * 50;
  return `
    <tr data-level="${level}">
      <td style="padding-left:${indent}px">
        ${hasKids ? '<span class="toggle">▶</span> ' : ''}
        ${proc.name ?? '-'}
      </td>
      <td>${proc.pid ?? '-'}</td>
      <td>${proc.cpu ?? '-'}</td>
      <td>${proc.memory ?? '-'}</td>
      <td>${proc.parent_pid ?? '-'}</td>
    </tr>
  `;
}

function renderTree(nodes, level = 0) {
  let html = '';
  nodes.forEach(n => {
    html += rowHTML(n, level);
    if (n.children && n.children.length) {
      html += renderTree(n.children, level + 1);
    }
  });
  return html;
}

function wireToggles() {
  document.querySelector('#process-table tbody').addEventListener('click', (e) => {
    if (!e.target.classList.contains('toggle')) return;
    const tr = e.target.closest('tr');
    const level = Number(tr.dataset.level);
    let next = tr.nextElementSibling;
    const show = e.target.textContent.trim() === '▶'; // expand if ▶
    e.target.textContent = show ? '▼' : '▶';

    while (next && Number(next.dataset.level) > level) {
      const isDirectChild = Number(next.dataset.level) === level + 1;
      if (isDirectChild) {
        next.style.display = show ? '' : 'none';
        if (!show) {
          // hide all descendants of this child
          let scan = next.nextElementSibling;
          while (scan && Number(scan.dataset.level) > Number(next.dataset.level)) {
            scan.style.display = 'none';
            scan = scan.nextElementSibling;
          }
          // reset nested toggles under the collapsed branch
          const nestedToggle = next.querySelector('.toggle');
          if (nestedToggle) nestedToggle.textContent = '▶';
        }
      }
      next = next.nextElementSibling;
    }
  });
}

function collapseAllChildren() {
  document.querySelectorAll('#process-table tbody tr').forEach(tr => {
    if (Number(tr.dataset.level) > 0) tr.style.display = 'none';
  });
  document.querySelectorAll('#process-table .toggle').forEach(t => t.textContent = '▶');
}
 // formating time
function formatTimestamp(ts) {
  if (!ts) return '-';
  const d = new Date(ts); 
  if (isNaN(d)) return ts; 

  const opts = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat(undefined, opts).format(d);
}
async function load() {
  const data = await fetchProcesses();
  if (!data.length) return;

  document.getElementById('host-name').textContent = 'Hostname: ' + (data[0]?.hostname ?? '-');
  document.getElementById('host-meta').textContent = 'Timestamp: ' + formatTimestamp(data[1]?.timestamp);

  const q = (processSearch || "").trim().toLowerCase();
  let html = '';
  if (q) {
    const matches = data.filter(
      p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        String(p.pid).includes(q)
    );
    html = matches
      .map(p =>
        `<tr data-level="0">
          <td>${p.name ?? '-'}</td>
          <td>${p.pid ?? '-'}</td>
          <td>${p.cpu ?? '-'}</td>
          <td>${p.memory ?? '-'}</td>
          <td>${p.parent_pid ?? '-'}</td>
        </tr>`
      )
      .join('');
    document.querySelector('#process-table tbody').innerHTML = html;
    return;
  }


  const tree = buildTree(data);
  document.querySelector('#process-table tbody').innerHTML = renderTree(tree);
  collapseAllChildren();
}


document.getElementById("process-search").addEventListener("input", (e) => {
  console.log("bhai hi")
  processSearch = e.target.value;
  load();
});


// ---------------- System Info ----------------

async function fetchSystem() {
  try {
    const res = await fetch(SYSTEM_URL);
    const json = await res.json();
    return json.data || {};
  } catch (e) {
    console.error('System fetch error:', e);
    return {};
  }
}

function renderSystem(sys) {
  const el = document.querySelector('.systems');
  el.innerHTML = `
    <table cellpadding="5">
      <tr><th>Name</th><td>${sys.hostname ?? '-'}</td></tr>
      <tr><th>Operating System</th><td>${sys.os ?? '-'}</td></tr>
      <tr><th>Processor</th><td>${sys.processor ?? '-'}</td></tr>
      <tr><th>Number of Cores</th><td>${sys.cores ?? '-'}</td></tr>
      <tr><th>Number of Threads</th><td>${sys.threads ?? '-'}</td></tr>
      <tr><th>RAM (GB)</th><td>${sys.ram_gb ?? '-'}</td></tr>
      <tr><th>Used RAM (GB)</th><td>${sys.used_ram_gb ?? '-'}</td></tr>
      <tr><th>Available RAM (GB)</th><td>${sys.available_ram_gb ?? '-'}</td></tr>
      <tr><th>Storage Free (GB)</th><td>${sys.storage_free_gb ?? '-'}</td></tr>
      <tr><th>Storage Total (GB)</th><td>${sys.storage_total_gb ?? '-'}</td></tr>
      <tr><th>Storage Used (GB)</th><td>${sys.storage_used_gb ?? '-'}</td></tr>
      <tr><th>Latest Timestamp</th><td>${sys.timestamp ?? '-'}</td></tr>
    </table>
  `;
}

async function loadSystem() {
  const sys = await fetchSystem();
  renderSystem(sys);
}
document.getElementById("refresh").addEventListener("click", () => {
  load();
  loadSystem();
});



window.addEventListener('load', () => {
  load();
  loadSystem();
  wireToggles();
});


