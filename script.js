function checkAdmin() {
    const pass = prompt("Enter Password:");
    if (pass === "Prabhu@12") {
        document.getElementById('admin-panel').style.display = 'block';
    } else {
        alert("Incorrect Password!");
    }
}

function logoutAdmin() {
    document.getElementById('admin-panel').style.display = 'none';
}

function calculateAndDisplayRates() {
    const sBase = parseFloat(document.getElementById('silver-base-input').value) || 0;
    const gBase = parseFloat(document.getElementById('gold-24k-base-input').value) || 0;
    const gstRate = 0.03; // 3%

    // Silver 1Kg
    const sGst = sBase * gstRate;
    document.getElementById('disp-silver-base').textContent = sBase.toLocaleString('en-IN');
    document.getElementById('disp-silver-gst').textContent = sGst.toLocaleString('en-IN');
    document.getElementById('disp-silver-final').textContent = Math.round(sBase + sGst).toLocaleString('en-IN');

    // Gold 10Gm Purities
    const purities = [
        { id: '24k', f: 1.0 }, { id: '22k', f: 0.9167 }, { id: '18k', f: 0.75 }, { id: '14k', f: 0.5833 }, { id: '9k', f: 0.375 }
    ];

    purities.forEach(p => {
        const base = gBase * p.f;
        const gst = base * gstRate;
        const final = base + gst;
        document.getElementById(`base-gold-${p.id}`).textContent = Math.round(base).toLocaleString('en-IN');
        document.getElementById(`gst-gold-${p.id}`).textContent = Math.round(gst).toLocaleString('en-IN');
        document.getElementById(`final-gold-${p.id}`).textContent = Math.round(final).toLocaleString('en-IN');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('hi-IN');
    calculateAndDisplayRates();
});