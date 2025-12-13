// पेज लोड होते ही आज की तारीख डिस्प्ले करें
document.getElementById('current-date').textContent = new Date().toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// गणना करने और HTML में प्रदर्शित करने का मुख्य फ़ंक्शन
function calculateAndDisplayRates() {
    // --- इनपुट से बेस रेट लें ---
    const silverBaseInput = document.getElementById('silver-base-input');
    const gold24kBaseInput = document.getElementById('gold-24k-base-input');

    // parseFloat का उपयोग करें ताकि स्ट्रिंग को संख्या में बदला जा सके
    const silverBaseRate = parseFloat(silverBaseInput.value);
    const gold24kBaseRate = parseFloat(gold24kBaseInput.value);

    // यदि इनपुट मान्य नहीं है तो रोक दें
    if (isNaN(silverBaseRate) || isNaN(gold24kBaseRate)) {
        alert("कृपया सोने और चांदी के लिए वैध संख्यात्मक बेस रेट दर्ज करें।");
        return;
    }

    const gstRate = 0.03; // 3% GST
    
    // ------------------------------------
    // --- सिल्वर (1 Kg) गणना ---
    // ------------------------------------
    const silverGstAmount = silverBaseRate * gstRate;
    const silverFinalRate = silverBaseRate + silverGstAmount;

    // सिल्वर डिस्प्ले
    document.getElementById('disp-silver-base').textContent = silverBaseRate.toFixed(2);
    document.getElementById('disp-silver-gst').textContent = silverGstAmount.toFixed(2);
    document.getElementById('disp-silver-final').textContent = silverFinalRate.toFixed(2);


    // ------------------------------------
    // --- गोल्ड (10 Gm) गणना (GST शामिल) ---
    // ------------------------------------
    
    // 1. बेस रेट की गणना (बिना GST)
    const gold24kBase = gold24kBaseRate;
    const gold22kBase = gold24kBase * (22 / 24); 
    const gold18kBase = gold24kBase * (18 / 24); 

    // 2. GST राशि की गणना
    const gst24k = gold24kBase * gstRate;
    const gst22k = gold22kBase * gstRate;
    const gst18k = gold18kBase * gstRate;

    // 3. अंतिम दर की गणना (बेस + GST)
    const gold24kFinal = gold24kBase + gst24k;
    const gold22kFinal = gold22kBase + gst22k;
    const gold18kFinal = gold18kBase + gst18k;

    // 4. HTML में गोल्ड डिस्प्ले
    
    // 24K डिस्प्ले
    document.getElementById('base-gold-24k').textContent = gold24kBase.toFixed(2);
    document.getElementById('gst-gold-24k').textContent = gst24k.toFixed(2);
    document.getElementById('final-gold-24k').textContent = gold24kFinal.toFixed(2);
    
    // 22K डिस्प्ले
    document.getElementById('base-gold-22k').textContent = gold22kBase.toFixed(2);
    document.getElementById('gst-gold-22k').textContent = gst22k.toFixed(2);
    document.getElementById('final-gold-22k').textContent = gold22kFinal.toFixed(2);

    // 18K डिस्प्ले
    document.getElementById('base-gold-18k').textContent = gold18kBase.toFixed(2);
    document.getElementById('gst-gold-18k').textContent = gst18k.toFixed(2);
    document.getElementById('final-gold-18k').textContent = gold18kFinal.toFixed(2);

    // alert("रेट सफलतापूर्वक अपडेट और गणना किए गए हैं!"); // इसे लाइव करते समय हटा दें
}

// पेज लोड होते ही शुरुआती वैल्यू (default values) के साथ गणना करें
document.addEventListener('DOMContentLoaded', calculateAndDisplayRates);