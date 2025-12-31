// --- CONFIGURATION (APNI DETAILS YHA BHAREIN) ---
const GITHUB_TOKEN = "GITHUB_TOKEN_PLACEHOLDER"; 
const REPO_OWNER = "insprabhu"; 
const REPO_NAME = "NAGINA-JEWELLERS---Daily-Price";
const FILE_PATH = "data.json"; 
const MASTER_PASS = "Prabhu@12";
const WHATSAPP_NUMBER = "8574481775";

// Default data agar internet na ho
let currentData = {
    rates: { gBase: 0, sBase: 0 },
    catalog: []
};

// 1. GitHub se data load karna
async function loadOnlineData() {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
        const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
        if (res.ok) {
            const json = await res.json();
            currentData = JSON.parse(atob(json.content));
            renderAll();
        }
    } catch (e) { console.log("Data load error"); }
}

// 2. GitHub par data save karna
async function syncToGitHub() {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    let sha = "";
    try {
        const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
        if (res.ok) { const json = await res.json(); sha = json.sha; }
    } catch (e) {}

    const response = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            message: "Update from Admin Panel",
            content: btoa(JSON.stringify(currentData)),
            sha: sha
        })
    });
    if (response.ok) alert("Sabhi devices ke liye rate update ho gaye!");
    else alert("Error: Token check karein.");
}

// Admin Panel Toggle
function accessAdmin() { if(prompt("Staff Password:") === MASTER_PASS) toggleAdmin(); }
function toggleAdmin() {
    const p = document.getElementById('admin-panel');
    p.style.display = (p.style.display === 'none') ? 'flex' : 'none';
}

// Rates Update Logic
function saveRates() {
    const g = document.getElementById('g-base').value;
    const s = document.getElementById('s-base').value;
    if(!g || !s) return alert("Rates bhariye!");
    currentData.rates = { gBase: g, sBase: s };
    renderAll();
    syncToGitHub();
}

function saveProduct() {
    const link = document.getElementById('p-link').value;
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-cat').value;
    if(!link || !name) return alert("Details bhariye!");
    currentData.catalog.push({ id: Date.now(), link, name, cat });
    renderAll();
    syncToGitHub();
}

function deleteItem(id) {
    currentData.catalog = currentData.catalog.filter(i => i.id !== id);
    renderAll();
    syncToGitHub();
}

// UI Rendering
function renderAll() {
    const gb = parseFloat(currentData.rates.gBase);
    const sb = parseFloat(currentData.rates.sBase);

    // Gold Table
    const purities = [
        { lab: "24K (99.9)", f: 1 }, { lab: "22K (91.6)", f: 0.9166 },
        { lab: "18K (75.0)", f: 0.75 }, { lab: "14K (58.3)", f: 0.583 },
        { lab: "9K (37.5)", f: 0.375 }
    ];
    let gH = "";
    purities.forEach(p => {
        const base = Math.round(gb * p.f);
        const gst = Math.round(base * 0.03);
        gH += `<tr><td>${p.lab}</td><td>${base.toLocaleString()}</td><td><span class="gst-highlight">${gst.toLocaleString()}</span></td><td class="final-rate">${(base+gst).toLocaleString()}</td></tr>`;
    });
    document.getElementById('gold-list').innerHTML = gH;

    // Silver Table
    const sGst = Math.round(sb * 0.03);
    document.getElementById('silver-list').innerHTML = `
        <tr><td>बेस रेट (1kg)</td><td>${sb.toLocaleString()}</td></tr>
        <tr><td>3% GST</td><td><span class="gst-highlight">${sGst.toLocaleString()}</span></td></tr>
        <tr style="background:#f1f8e9"><td style="font-weight:bold">अंतिम दर</td><td class="final-rate">${(sb+sGst).toLocaleString()}</td></tr>
        <tr><td>चाँदी (10g)</td><td>${Math.round((sb+sGst)/100).toLocaleString()}</td></tr>`;

    // Catalog
    const gG = document.getElementById('gold-gallery');
    const sG = document.getElementById('silver-gallery');
    const adL = document.getElementById('admin-item-list');
    gG.innerHTML = ""; sG.innerHTML = ""; adL.innerHTML = "";

    currentData.catalog.forEach(item => {
        const card = `<div class="product-item"><img src="${item.link}"><div style="padding:8px;"><strong>${item.name}</strong><a href="https://wa.me/${WHATSAPP_NUMBER}?text=Details: ${item.name}" class="wa-link">Enquire</a></div></div>`;
        if(item.cat === 'gold') gG.innerHTML += card; else sG.innerHTML += card;
        adL.innerHTML += `<div style="display:flex;justify-content:space-between;padding:5px;border-bottom:1px solid #eee;"><span>${item.name}</span><button onclick="deleteItem(${item.id})" style="color:red;border:none;background:none;cursor:pointer;">✖</button></div>`;
    });
}

// Carousel
let sIdx = 0;
function moveSlider() {
    const s = document.querySelectorAll('.slide');
    s.forEach(x => x.classList.remove('active'));
    sIdx = (sIdx + 1) % s.length;
    s[sIdx].classList.add('active');
    setTimeout(moveSlider, 4000);
}

window.onload = () => { loadOnlineData(); moveSlider(); };