const MASTER_PASS = "Prabhu@12";
const WHATSAPP_NUMBER = "8574481775";

// Slider Logic
let slideIdx = 0;
function moveSlider() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(s => s.classList.remove('active'));
    slideIdx = (slideIdx + 1) % slides.length;
    slides[slideIdx].classList.add('active');
    setTimeout(moveSlider, 4000);
}

// Admin Logic
function accessAdmin() {
    if(prompt("Staff Password:") === MASTER_PASS) toggleAdmin();
}
function toggleAdmin() {
    const p = document.getElementById('admin-panel');
    p.style.display = (p.style.display === 'none') ? 'flex' : 'none';
}

function saveRates() {
    const g = document.getElementById('g-base').value;
    const s = document.getElementById('s-base').value;
    localStorage.setItem('nagina_rates', JSON.stringify({gBase: g, sBase: s}));
    renderAll();
    alert("Rates Updated!");
}

function saveProduct() {
    const link = document.getElementById('p-link').value;
    const name = document.getElementById('p-name').value;
    const cat = document.getElementById('p-cat').value;
    let catalog = JSON.parse(localStorage.getItem('nagina_catalog')) || [];
    catalog.push({ id: Date.now(), link, name, cat });
    localStorage.setItem('nagina_catalog', JSON.stringify(catalog));
    renderAll();
}

function deleteItem(id) {
    let catalog = JSON.parse(localStorage.getItem('nagina_catalog'));
    localStorage.setItem('nagina_catalog', JSON.stringify(catalog.filter(i => i.id !== id)));
    renderAll();
}

// Render Table with Reference Image Style
function renderAll() {
    const rates = JSON.parse(localStorage.getItem('nagina_rates')) || {gBase:0, sBase:0};
    const gb = parseFloat(rates.gBase);
    const sb = parseFloat(rates.sBase);

    const goldRows = [
        { lab: "24K (99.9)", price: gb },
        { lab: "22K (91.6)", price: Math.round(gb * 0.9166) },
        { lab: "18K (75.0)", price: Math.round(gb * 0.75) },
        { lab: "14K (58.3)", price: Math.round(gb * 0.583) },
        { lab: "9K (37.5)", price: Math.round(gb * 0.375) }
    ];

    let gHTML = "";
    goldRows.forEach(item => {
        const gst = Math.round(item.price * 0.03);
        const final = item.price + gst;
        gHTML += `
            <tr>
                <td>${item.lab}</td>
                <td>${item.price.toLocaleString()}</td>
                <td><span class="gst-highlight">${gst.toLocaleString()}</span></td>
                <td class="final-rate">${final.toLocaleString()}</td>
            </tr>`;
    });
    document.getElementById('gold-list').innerHTML = gHTML;

    // Silver Table
    const sGst = Math.round(sb * 0.03);
    document.getElementById('silver-list').innerHTML = `
        <tr><td>बेस रेट (1 Kg)</td><td>${sb.toLocaleString()}</td></tr>
        <tr><td>GST (3%)</td><td><span class="gst-highlight">${sGst.toLocaleString()}</span></td></tr>
        <tr style="background:#f1f8e9"><td style="font-weight:bold">अंतिम दर</td><td class="final-rate">${(sb + sGst).toLocaleString()}</td></tr>
        <tr><td>चाँदी (10 Gm)</td><td>${Math.round((sb+sGst)/100).toLocaleString()}</td></tr>
    `;

    // Catalog & Admin
    const gGal = document.getElementById('gold-gallery');
    const sGal = document.getElementById('silver-gallery');
    const admL = document.getElementById('admin-item-list');
    gGal.innerHTML = ""; sGal.innerHTML = ""; admL.innerHTML = "";

    const catalog = JSON.parse(localStorage.getItem('nagina_catalog')) || [];
    catalog.forEach(item => {
        const card = `<div class="product-item"><img src="${item.link}"><div style="padding:8px;"><strong>${item.name}</strong><a href="https://wa.me/${WHATSAPP_NUMBER}?text=Details: ${item.name}" class="wa-link">Enquire</a></div></div>`;
        if(item.cat === 'gold') gGal.innerHTML += card; else sGal.innerHTML += card;
        admL.innerHTML += `<div style="display:flex;justify-content:space-between;padding:5px;border-bottom:1px solid #eee;"><span>${item.name}</span><button onclick="deleteItem(${item.id})" style="color:red;border:none;background:none;cursor:pointer;">✖</button></div>`;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    moveSlider();
    renderAll();
});