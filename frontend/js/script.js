/* =========================================================
   HOMENEST — CORRECTED SCRIPT.JS
   Keeps existing HomeNest UI and fixes:
   - Admin login/logout
   - Add Property
   - Property persistence
   - Property edit/delete
   - Google Maps
   - Current location
   - Selected property location
   - Google Maps directions
   - WhatsApp Agent
   - Call Agent
   - User requests
   - Admin confirmation/rejection
   - Email notification API
   - Wishlist
   - Property AI
   - Language switching
========================================================= */


/* =========================================================
   PROPERTY DATABASE
========================================================= */

let properties = [
    {
        id: 1,
        name: "Luxury Garden Villa",
        location: "Whitefield, Bengaluru",
        city: "Bengaluru",
        type: "Villa",
        price: 245,
        priceText: "₹2.45 Cr",
        bedrooms: 4,
        bathrooms: 4,
        area: "2,850 sq.ft",
        parking: "2 Cars",
        furnishing: "Fully Furnished",
        facing: "East",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
        amenities: "Swimming Pool • Gym • 24×7 Security • Garden • CCTV • Power Backup",
        description: "A premium family villa in Whitefield with spacious rooms, modern interiors, excellent connectivity and peaceful surroundings.",
        rating: 4.9,
        reviews: 128,
        distance: "2.4 km",
        lat: 12.9698,
        lng: 77.7500
    },

    {
        id: 2,
        name: "Premium City Apartment",
        location: "Baner, Pune",
        city: "Pune",
        type: "Apartment",
        price: 98,
        priceText: "₹98 Lakh",
        bedrooms: 3,
        bathrooms: 3,
        area: "1,720 sq.ft",
        parking: "1 Car",
        furnishing: "Semi Furnished",
        facing: "West",
        image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=85",
        amenities: "Lift • Gym • Security • Parking • Club House • CCTV",
        description: "A modern apartment in Baner designed for comfortable urban living with excellent connectivity to offices and schools.",
        rating: 4.8,
        reviews: 94,
        distance: "4.8 km",
        lat: 18.5590,
        lng: 73.7868
    },

    {
        id: 3,
        name: "Elegant Family Residence",
        location: "Tilakwadi, Belagavi",
        city: "Belagavi",
        type: "Independent House",
        price: 82,
        priceText: "₹82 Lakh",
        bedrooms: 4,
        bathrooms: 3,
        area: "2,200 sq.ft",
        parking: "2 Cars",
        furnishing: "Semi Furnished",
        facing: "North",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
        amenities: "Garden • Parking • CCTV • Security • Power Backup",
        description: "A spacious independent family home located in a well-connected residential neighbourhood of Belagavi.",
        rating: 4.7,
        reviews: 76,
        distance: "7.2 km",
        lat: 15.8497,
        lng: 74.4977
    },

    {
        id: 4,
        name: "Skyline Premium Residence",
        location: "Andheri West, Mumbai",
        city: "Mumbai",
        type: "Apartment",
        price: 210,
        priceText: "₹2.10 Cr",
        bedrooms: 3,
        bathrooms: 2,
        area: "1,480 sq.ft",
        parking: "1 Car",
        furnishing: "Fully Furnished",
        facing: "East",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
        amenities: "Lift • Gym • Pool • Security • Club House • Parking",
        description: "A stylish city residence in Andheri West offering premium amenities and convenient access to Mumbai's major locations.",
        rating: 4.9,
        reviews: 212,
        distance: "8.3 km",
        lat: 19.1364,
        lng: 72.8277
    },

    {
        id: 5,
        name: "Modern Smart Villa",
        location: "Gachibowli, Hyderabad",
        city: "Hyderabad",
        type: "Villa",
        price: 185,
        priceText: "₹1.85 Cr",
        bedrooms: 4,
        bathrooms: 4,
        area: "3,100 sq.ft",
        parking: "2 Cars",
        furnishing: "Fully Furnished",
        facing: "South",
        image: "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1200&q=85",
        amenities: "Smart Home • Pool • Gym • Security • Garden • Parking",
        description: "A modern smart villa close to Gachibowli's technology and business district.",
        rating: 4.8,
        reviews: 109,
        distance: "9.1 km",
        lat: 17.4401,
        lng: 78.3489
    },

    {
        id: 6,
        name: "Spacious Family Home",
        location: "Bagalkot, Karnataka",
        city: "Bagalkot",
        type: "Independent House",
        price: 68,
        priceText: "₹68 Lakh",
        bedrooms: 3,
        bathrooms: 2,
        area: "1,950 sq.ft",
        parking: "2 Cars",
        furnishing: "Unfurnished",
        facing: "West",
        image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=85",
        amenities: "Parking • Garden • Security • Water Supply",
        description: "A spacious home suitable for families looking for comfortable living in Bagalkot.",
        rating: 4.8,
        reviews: 58,
        distance: "6.5 km",
        lat: 16.1691,
        lng: 75.6615
    }
];


/* =========================================================
   LOAD SAVED PROPERTIES
========================================================= */

try {
    const savedProperties =
        JSON.parse(localStorage.getItem("hnProperties") || "null");

    if (Array.isArray(savedProperties) && savedProperties.length) {
        properties = savedProperties;
    }
} catch (error) {
    console.error("Property loading error:", error);
}


/* =========================================================
   GLOBAL STATE
========================================================= */

let selectedProperty = null;
let selectedMapProperty = null;

let requests =
    JSON.parse(localStorage.getItem("hnRequests") || "[]");

let wishlist =
    JSON.parse(localStorage.getItem("hnWishlist") || "[]");

let notifications =
    JSON.parse(localStorage.getItem("hnNotifications") || "[]");

let currentUser =
    JSON.parse(localStorage.getItem("hnUser") || "null");

let currentLanguage =
    localStorage.getItem("hnLanguage") || "en";

let userCoords = null;

let homeNestMap = null;
let homeNestDirectionsService = null;
let homeNestDirectionsRenderer = null;
let homeNestUserMarker = null;
let homeNestPropertyMarker = null;
let homeNestRouteLine = null;


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    en: {
        language: "English",
        home: "Home",
        properties: "Properties",
        explore: "Explore",
        reviews: "Reviews",
        contact: "Contact",
        tag: "✨ India's smarter way to find your next home",
        heroDescription:
            "Discover beautiful homes, apartments, villas and plots across India. Compare properties, explore locations, chat with agents and find the perfect place for your future.",
        location: "LOCATION",
        type: "PROPERTY TYPE",
        budget: "MAX BUDGET",
        search: "Search",
        verified: "Verified Properties",
        buyerRating: "Buyer Rating",
        cities: "Indian Cities",
        exploreHomes: "Explore homes",
        lifestyle: "Find what fits your lifestyle",
        categoryDescription:
            "From modern city apartments to peaceful villas and spacious independent houses, explore properties designed for every lifestyle.",
        featured: "Featured Indian Properties"
    },

    kn: {
        language: "ಕನ್ನಡ",
        home: "ಮುಖಪುಟ",
        properties: "ಆಸ್ತಿಗಳು",
        explore: "ಅನ್ವೇಷಿಸಿ",
        reviews: "ವಿಮರ್ಶೆಗಳು",
        contact: "ಸಂಪರ್ಕ",
        tag: "✨ ನಿಮ್ಮ ಕನಸಿನ ಮನೆಯನ್ನು ಹುಡುಕಿ",
        heroDescription:
            "ಭಾರತದಾದ್ಯಂತ ಸುಂದರ ಮನೆಗಳು ಮತ್ತು ಆಸ್ತಿಗಳನ್ನು ಹುಡುಕಿ.",
        location: "ಸ್ಥಳ",
        type: "ಆಸ್ತಿ ಪ್ರಕಾರ",
        budget: "ಗರಿಷ್ಠ ಬಜೆಟ್",
        search: "ಹುಡುಕಿ",
        verified: "ಪರಿಶೀಲಿಸಿದ ಆಸ್ತಿಗಳು",
        buyerRating: "ಖರೀದಿದಾರರ ರೇಟಿಂಗ್",
        cities: "ಭಾರತೀಯ ನಗರಗಳು",
        exploreHomes: "ಮನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
        lifestyle: "ನಿಮ್ಮ ಜೀವನಶೈಲಿಗೆ ಸೂಕ್ತವಾದುದನ್ನು ಹುಡುಕಿ",
        categoryDescription: "ನಿಮ್ಮ ಅಗತ್ಯಕ್ಕೆ ತಕ್ಕ ಆಸ್ತಿಗಳನ್ನು ಹುಡುಕಿ.",
        featured: "ಭಾರತದ ಪ್ರಮುಖ ಆಸ್ತಿಗಳು"
    },

    hi: {
        language: "हिंदी",
        home: "होम",
        properties: "प्रॉपर्टीज",
        explore: "एक्सप्लोर",
        reviews: "समीक्षाएँ",
        contact: "संपर्क",
        tag: "✨ अपना पसंदीदा घर खोजें",
        heroDescription: "भारत भर में सुंदर प्रॉपर्टीज खोजें।",
        location: "स्थान",
        type: "प्रॉपर्टी प्रकार",
        budget: "अधिकतम बजट",
        search: "खोजें",
        verified: "सत्यापित प्रॉपर्टीज",
        buyerRating: "खरीदार रेटिंग",
        cities: "भारतीय शहर",
        exploreHomes: "घर खोजें",
        lifestyle: "अपनी जीवनशैली के अनुसार घर खोजें",
        categoryDescription: "अपनी जरूरत के अनुसार प्रॉपर्टी खोजें।",
        featured: "भारत की प्रमुख प्रॉपर्टीज"
    },

    mr: {
        language: "मराठी",
        home: "मुख्यपृष्ठ",
        properties: "मालमत्ता",
        explore: "एक्सप्लोर",
        reviews: "परीक्षणे",
        contact: "संपर्क",
        tag: "✨ तुमचे स्वप्नातील घर शोधा",
        heroDescription: "संपूर्ण भारतातील मालमत्ता शोधा.",
        location: "स्थान",
        type: "मालमत्ता प्रकार",
        budget: "कमाल बजेट",
        search: "शोधा",
        verified: "सत्यापित मालमत्ता",
        buyerRating: "खरेदीदार रेटिंग",
        cities: "भारतीय शहरे",
        exploreHomes: "घरे शोधा",
        lifestyle: "तुमच्या जीवनशैलीला योग्य घर शोधा",
        categoryDescription: "तुमच्या गरजेनुसार मालमत्ता शोधा.",
        featured: "भारतामधील प्रमुख मालमत्ता"
    },

    te: {
        language: "తెలుగు",
        home: "హోమ్",
        properties: "ఆస్తులు",
        explore: "అన్వేషించండి",
        reviews: "సమీక్షలు",
        contact: "సంప్రదించండి",
        tag: "✨ మీకు గర్వంగా అనిపించే ఇంటిని కనుగొనండి",
        heroDescription: "భారతదేశంలోని ఆస్తులను కనుగొనండి.",
        location: "ప్రదేశం",
        type: "ఆస్తి రకం",
        budget: "గరిష్ట బడ్జెట్",
        search: "వెతకండి",
        verified: "ధృవీకరించిన ఆస్తులు",
        buyerRating: "కొనుగోలుదారు రేటింగ్",
        cities: "భారత నగరాలు",
        exploreHomes: "ఇళ్లను అన్వేషించండి",
        lifestyle: "మీ జీవనశైలికి సరిపోయేదాన్ని కనుగొనండి",
        categoryDescription: "మీ అవసరానికి సరిపోయే ఆస్తులను కనుగొనండి.",
        featured: "భారతదేశంలోని ప్రముఖ ఆస్తులు"
    },

    ta: {
        language: "தமிழ்",
        home: "முகப்பு",
        properties: "சொத்துகள்",
        explore: "ஆராயுங்கள்",
        reviews: "விமர்சனங்கள்",
        contact: "தொடர்பு",
        tag: "✨ உங்கள் கனவு வீட்டைக் கண்டறியுங்கள்",
        heroDescription: "இந்தியா முழுவதும் சொத்துகளை கண்டறியுங்கள்.",
        location: "இடம்",
        type: "சொத்து வகை",
        budget: "அதிகபட்ச பட்ஜெட்",
        search: "தேடுங்கள்",
        verified: "சரிபார்க்கப்பட்ட சொத்துகள்",
        buyerRating: "வாங்குபவர் மதிப்பீடு",
        cities: "இந்திய நகரங்கள்",
        exploreHomes: "வீடுகளை ஆராயுங்கள்",
        lifestyle: "உங்கள் வாழ்க்கை முறைக்கு ஏற்றதை கண்டறியுங்கள்",
        categoryDescription: "உங்கள் தேவைக்கு ஏற்ற சொத்துகளை கண்டறியுங்கள்.",
        featured: "இந்தியாவின் சிறந்த சொத்துகள்"
    },

    ml: {
        language: "മലയാളം",
        home: "ഹോം",
        properties: "പ്രോപ്പർട്ടികൾ",
        explore: "പര്യവേക്ഷണം",
        reviews: "അവലോകനങ്ങൾ",
        contact: "ബന്ധപ്പെടുക",
        tag: "✨ നിങ്ങളുടെ സ്വപ്ന വീട് കണ്ടെത്തൂ",
        heroDescription: "ഇന്ത്യയിലെ മികച്ച പ്രോപ്പർട്ടികൾ കണ്ടെത്തൂ.",
        location: "സ്ഥലം",
        type: "പ്രോപ്പർട്ടി തരം",
        budget: "പരമാവധി ബജറ്റ്",
        search: "തിരയുക",
        verified: "സ്ഥിരീകരിച്ച പ്രോപ്പർട്ടികൾ",
        buyerRating: "വാങ്ങുന്നവരുടെ റേറ്റിംഗ്",
        cities: "ഇന്ത്യൻ നഗരങ്ങൾ",
        exploreHomes: "വീടുകൾ കണ്ടെത്തുക",
        lifestyle: "നിങ്ങളുടെ ജീവിതശൈലിക്ക് അനുയോജ്യം കണ്ടെത്തുക",
        categoryDescription: "നിങ്ങളുടെ ആവശ്യത്തിന് അനുയോജ്യമായ പ്രോപ്പർട്ടികൾ കണ്ടെത്തുക.",
        featured: "ഇന്ത്യയിലെ പ്രധാന പ്രോപ്പർട്ടികൾ"
    },

    gu: {
        language: "ગુજરાતી",
        home: "હોમ",
        properties: "પ્રોપર્ટીઝ",
        explore: "એક્સપ્લોર",
        reviews: "સમીક્ષાઓ",
        contact: "સંપર્ક",
        tag: "✨ તમારું સપનાનું ઘર શોધો",
        heroDescription: "ભારતમાં સુંદર પ્રોપર્ટીઝ શોધો.",
        location: "સ્થાન",
        type: "પ્રોપર્ટી પ્રકાર",
        budget: "મહત્તમ બજેટ",
        search: "શોધો",
        verified: "ચકાસાયેલ પ્રોપર્ટીઝ",
        buyerRating: "ખરીદદાર રેટિંગ",
        cities: "ભારતીય શહેરો",
        exploreHomes: "ઘરો શોધો",
        lifestyle: "તમારી જીવનશૈલી માટે યોગ્ય ઘર શોધો",
        categoryDescription: "તમારી જરૂરિયાત મુજબની પ્રોપર્ટી શોધો.",
        featured: "ભારતની મુખ્ય પ્રોપર્ટીઝ"
    },

    bn: {
        language: "বাংলা",
        home: "হোম",
        properties: "সম্পত্তি",
        explore: "অন্বেষণ",
        reviews: "পর্যালোচনা",
        contact: "যোগাযোগ",
        tag: "✨ আপনার স্বপ্নের বাড়ি খুঁজুন",
        heroDescription: "ভারতের সুন্দর সম্পত্তি খুঁজুন।",
        location: "অবস্থান",
        type: "সম্পত্তির ধরন",
        budget: "সর্বোচ্চ বাজেট",
        search: "অনুসন্ধান",
        verified: "যাচাইকৃত সম্পত্তি",
        buyerRating: "ক্রেতার রেটিং",
        cities: "ভারতীয় শহর",
        exploreHomes: "বাড়ি অন্বেষণ করুন",
        lifestyle: "আপনার জীবনযাত্রার জন্য সঠিক বাড়ি খুঁজুন",
        categoryDescription: "আপনার প্রয়োজন অনুযায়ী সম্পত্তি খুঁজুন।",
        featured: "ভারতের প্রধান সম্পত্তি"
    },

    pa: {
        language: "ਪੰਜਾਬੀ",
        home: "ਹੋਮ",
        properties: "ਪ੍ਰਾਪਰਟੀਜ਼",
        explore: "ਐਕਸਪਲੋਰ",
        reviews: "ਸਮੀਖਿਆਵਾਂ",
        contact: "ਸੰਪਰਕ",
        tag: "✨ ਆਪਣਾ ਸੁਪਨਿਆਂ ਦਾ ਘਰ ਲੱਭੋ",
        heroDescription: "ਭਾਰਤ ਵਿੱਚ ਸੁੰਦਰ ਪ੍ਰਾਪਰਟੀਜ਼ ਲੱਭੋ।",
        location: "ਸਥਾਨ",
        type: "ਪ੍ਰਾਪਰਟੀ ਕਿਸਮ",
        budget: "ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ",
        search: "ਖੋਜੋ",
        verified: "ਪ੍ਰਮਾਣਿਤ ਪ੍ਰਾਪਰਟੀਜ਼",
        buyerRating: "ਖਰੀਦਦਾਰ ਰੇਟਿੰਗ",
        cities: "ਭਾਰਤੀ ਸ਼ਹਿਰ",
        exploreHomes: "ਘਰ ਲੱਭੋ",
        lifestyle: "ਆਪਣੀ ਜੀਵਨਸ਼ੈਲੀ ਲਈ ਸਹੀ ਘਰ ਲੱਭੋ",
        categoryDescription: "ਆਪਣੀ ਲੋੜ ਅਨੁਸਾਰ ਪ੍ਰਾਪਰਟੀ ਲੱਭੋ।",
        featured: "ਭਾਰਤ ਦੀਆਂ ਮੁੱਖ ਪ੍ਰਾਪਰਟੀਜ਼"
    }
};


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage() {

    const t = translations[currentLanguage] || translations.en;

    const languageName =
        document.getElementById("languageName");

    if (languageName) {
        languageName.innerText = t.language;
    }

    document.querySelectorAll("[data-i18n]").forEach(element => {

        const key = element.dataset.i18n;

        if (t[key]) {
            element.innerText = t[key];
        }
    });

    const heroTitle =
        document.getElementById("heroTitle");

    if (heroTitle) {

        if (currentLanguage === "en") {

            heroTitle.innerHTML =
                "Find a place you'll be proud to <span>call home.</span>";

        } else {

            heroTitle.innerText = t.tag;
        }
    }

    localStorage.setItem(
        "hnLanguage",
        currentLanguage
    );
}


function changeLanguage() {

    const languages = [
        "en",
        "kn",
        "hi",
        "mr",
        "te",
        "ta",
        "ml",
        "gu",
        "bn",
        "pa"
    ];

    let index =
        languages.indexOf(currentLanguage);

    if (index < 0) {
        index = 0;
    }

    index =
        (index + 1) % languages.length;

    currentLanguage =
        languages[index];

    applyLanguage();

    showToast(
        "Language changed to " +
        translations[currentLanguage].language
    );

    setTimeout(() => {

        const select =
            document.querySelector(
                ".goog-te-combo"
            );

        if (select) {

            select.value = currentLanguage;

            select.dispatchEvent(
                new Event("change")
            );
        }

    }, 1000);
}


/* =========================================================
   GOOGLE TRANSLATE
========================================================= */

window.googleTranslateReady = function () {

    if (
        typeof google === "undefined" ||
        !google.translate
    ) {
        return;
    }

    const element =
        document.getElementById(
            "google_translate_element"
        );

    if (!element) {
        return;
    }

    if (
        element.querySelector(
            ".goog-te-combo"
        )
    ) {
        return;
    }

    new google.translate.TranslateElement(
        {
            pageLanguage: "en",
            includedLanguages:
                "en,kn,hi,mr,te,ta,ml,gu,bn,pa",
            autoDisplay: false
        },
        "google_translate_element"
    );
};


/* =========================================================
   RENDER PROPERTIES
========================================================= */

function renderProperties(list = properties) {

    const grid =
        document.getElementById("propertyGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (!list.length) {

        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px">
                <h2>No matching properties found</h2>
                <p style="color:#777;margin-top:8px">
                    Try another location, property type or budget.
                </p>
            </div>
        `;

        return;
    }

    list.forEach(property => {

        const liked =
            wishlist.includes(property.id);

        const card =
            document.createElement("div");

        card.className =
            "property-card";

        card.dataset.id =
            property.id;

        card.innerHTML = `

            <div class="property-img"
                 style="background-image:url('${property.image}')">

                <div class="property-badge">
                    ✓ VERIFIED
                </div>

                <button
                    class="wishlist ${liked ? "active" : ""}"
                    onclick="toggleWishlist(${property.id},this)">
                    ${liked ? "♥" : "♡"}
                </button>

            </div>

            <div class="property-body">

                <div class="location">
                    📍 ${escapeHTML(property.location)}
                </div>

                <h3 class="property-title">
                    ${escapeHTML(property.name)}
                </h3>

                <div class="price">
                    ${escapeHTML(property.priceText)}
                    <small> onwards</small>
                </div>

                <div class="property-meta">

                    <span>🛏 ${property.bedrooms} Beds</span>
                    <span>🚿 ${property.bathrooms} Baths</span>
                    <span>📐 ${escapeHTML(property.area)}</span>
                    <span>🚗 ${escapeHTML(property.parking)}</span>

                </div>

                <div class="rating">

                    ${"★".repeat(
                        Math.round(property.rating || 0)
                    )}

                    <span>
                        ${property.rating || 0}
                        ·
                        ${property.reviews || 0}
                        reviews
                    </span>

                </div>

                <div class="card-buttons">

                    <button
                        class="view-btn"
                        onclick="openProperty(${property.id})">
                        View Details →
                    </button>

                    <button
                        class="request-btn"
                        onclick="requestProperty(${property.id})">
                        🏠 Request
                    </button>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });
}


/* =========================================================
   SEARCH
========================================================= */

function searchProperties() {

    const location =
        document.getElementById("locationSelect")?.value ||
        "all";

    const type =
        document.getElementById("typeSelect")?.value ||
        "all";

    const budget =
        document.getElementById("budgetSelect")?.value ||
        "all";

    const result =
        properties.filter(property => {

            const locationMatch =
                location === "all" ||
                property.city === location;

            const typeMatch =
                type === "all" ||
                property.type === type;

            let budgetMatch = true;

            if (budget !== "all") {

                budgetMatch =
                    Number(property.price) <=
                    Number(budget);
            }

            return (
                locationMatch &&
                typeMatch &&
                budgetMatch
            );
        });

    renderProperties(result);

    document
        .getElementById("properties")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(id, button) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                value => value !== id
            );

        button.classList.remove(
            "active"
        );

        button.innerText = "♡";

        showToast(
            "Removed from wishlist"
        );

    } else {

        wishlist.push(id);

        button.classList.add(
            "active"
        );

        button.innerText = "♥";

        showToast(
            "❤️ Property added to wishlist"
        );
    }

    localStorage.setItem(
        "hnWishlist",
        JSON.stringify(wishlist)
    );

    updateUserPortal();
}

// ============================================================
// VIEW PROPERTY DETAILS
// ============================================================

window.openProperty = function (id) {

    const property = properties.find(
        p => String(p.id) === String(id)
    );

    if (!property) {
        showToast("Property details not found.");
        return;
    }

    // Remember selected property
    selectedProperty = property;

    const modal =
        document.getElementById("propertyModal");

    if (!modal) {
        showToast("Property details window not found.");
        return;
    }

    const modalImage =
        document.getElementById("modalImage");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalLocation =
        document.getElementById("modalLocation");

    const modalPrice =
        document.getElementById("modalPrice");

    const modalFeatures =
        document.getElementById("modalFeatures");

    const modalAmenities =
        document.getElementById("modalAmenities");

    const modalDescription =
        document.getElementById("modalDescription");


    // Image
    if (modalImage) {

        modalImage.src =
            property.image ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c";

        modalImage.alt =
            property.name || "Property";
    }


    // Property name
    if (modalTitle) {

        modalTitle.textContent =
            property.name ||
            "Property";
    }


    // Location
    if (modalLocation) {

        modalLocation.textContent =
            "📍 " +
            (
                property.location ||
                property.city ||
                property.address ||
                "India"
            );
    }


    // Price
    if (modalPrice) {

        modalPrice.textContent =
            property.price ||
            "Price on request";
    }


    // Features
    if (modalFeatures) {

        modalFeatures.innerHTML = `

            <span>
                🛏️ ${property.bedrooms || 0} Bedrooms
            </span>

            <span>
                🛁 ${property.bathrooms || 0} Bathrooms
            </span>

            <span>
                📐 ${property.area || "N/A"}
            </span>

            <span>
                🚗 ${property.parking || "N/A"}
            </span>

            <span>
                🛋️ ${property.furnishing || "N/A"}
            </span>

            <span>
                🧭 ${property.facing || "N/A"}
            </span>
        `;
    }


    // Amenities
    if (modalAmenities) {

        modalAmenities.textContent =
            property.amenities ||
            "Amenities information not available.";
    }


    // Description
    if (modalDescription) {

        modalDescription.textContent =
            property.description ||
            "No description available.";
    }


    // Open property modal
    modal.classList.add("active");
};

/* =========================================================
   SELECTED PROPERTY LOCATION
========================================================= */

window.openSelectedPropertyLocation =
    function () {

        if (!selectedProperty) {

            showToast(
                "Please select a property first."
            );

            return;
        }

        showPropertyOnGoogleMap(
            selectedProperty
        );
    };

// ============================================================
// GOOGLE MAPS
// CURRENT LOCATION → SELECTED PROPERTY
// ============================================================

window.openPropertyRoute = function () {

    // Check selected property
    if (!selectedProperty) {

        showToast(
            "Please select a property first."
        );

        return;
    }


    // Get property location
    const propertyLocation =
        selectedProperty.location ||
        selectedProperty.city ||
        selectedProperty.address;


    if (!propertyLocation) {

        showToast(
            "Property location is not available."
        );

        return;
    }


    // Check browser location support
    if (!navigator.geolocation) {

        showToast(
            "Your browser does not support location."
        );

        return;
    }


    showToast(
        "Getting your current location..."
    );


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            const origin =
                latitude + "," + longitude;


            const destination =
                propertyLocation + ", India";


            // REAL GOOGLE MAPS DIRECTIONS
            const googleMapsURL =
                "https://www.google.com/maps/dir/?api=1" +
                "&origin=" +
                encodeURIComponent(origin) +
                "&destination=" +
                encodeURIComponent(destination) +
                "&travelmode=driving";


            showToast(
                "Opening Google Maps..."
            );


            window.open(
                googleMapsURL,
                "_blank"
            );
        },


        function (error) {

            console.error(
                "Location error:",
                error
            );


            if (error.code === 1) {

                showToast(
                    "Please allow location permission."
                );

            } else if (error.code === 2) {

                showToast(
                    "Current location could not be detected."
                );

            } else if (error.code === 3) {

                showToast(
                    "Location request timed out."
                );

            } else {

                showToast(
                    "Unable to get your current location."
                );
            }
        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
};
/* =========================================================
   GOOGLE MAP COORDINATES
========================================================= */

const CITY_COORDS = {

    Bengaluru: [12.9716, 77.5946],
    Pune: [18.5204, 73.8567],
    Mumbai: [19.0760, 72.8777],
    Hyderabad: [17.3850, 78.4867],
    Delhi: [28.6139, 77.2090],
    Chennai: [13.0827, 80.2707],
    Belagavi: [15.8497, 74.4977],
    Bagalkot: [16.1691, 75.6615],
    Jamakhandi: [16.5046, 75.2915],
    Mysuru: [12.2958, 76.6394],
    Mangaluru: [12.9141, 74.8560],
    Hubballi: [15.3647, 75.1240],
    Ahmedabad: [23.0225, 72.5714],
    Kolkata: [22.5726, 88.3639],
    Jaipur: [26.9124, 75.7873],
    Kochi: [9.9312, 76.2673]
};


function getPropertyCoordinates(property) {

    if (
        property &&
        Number.isFinite(
            Number(property.lat)
        ) &&
        Number.isFinite(
            Number(property.lng)
        )
    ) {

        return {
            lat: Number(property.lat),
            lng: Number(property.lng)
        };
    }

    const city =
        (
            property?.city ||
            property?.location ||
            ""
        )
        .split(",")[0]
        .trim();

    const coords =
        CITY_COORDS[city] ||
        CITY_COORDS.Bengaluru;

    return {
        lat: coords[0],
        lng: coords[1]
    };
}


/* =========================================================
   GOOGLE MAP INITIALIZATION
========================================================= */
window.initGoogleMap = function () {

    const mapElement = document.getElementById("mapVisual");

    if (!mapElement) {
        console.error("mapVisual element not found.");
        return;
    }

    if (
        typeof google === "undefined" ||
        !google.maps
    ) {
        console.error("Google Maps API is not loaded.");
        return;
    }

    homeNestMap = new google.maps.Map(
        mapElement,
        {
            center: {
                lat: 15.8497,
                lng: 74.4977
            },
            zoom: 7,

            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true
        }
    );

    console.log("Google Maps loaded successfully.");

    if (typeof renderMap === "function") {
        renderMap();
    }
};
/* =========================================================
   SHOW PROPERTY ON GOOGLE MAP
========================================================= */
function showPropertyOnGoogleMap(property, userLocation = null) {

    if (!property) {
        showToast("Please select a property.");
        return;
    }

    if (
        typeof google === "undefined" ||
        !google.maps
    ) {
        showToast("Google Maps is not loaded.");
        console.error("Google Maps JavaScript API is not loaded.");
        return;
    }

    const destination = getPropertyCoordinates(property);

    if (!destination) {
        showToast("Property coordinates are not available.");
        console.error("Invalid property coordinates:", property);
        return;
    }

    // Scroll to map
    const mapSection = document.getElementById("map");

    if (mapSection) {
        mapSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    // Make sure map exists
    if (!homeNestMap) {
        showToast("Google Map is still loading.");
        console.error("homeNestMap is null.");
        return;
    }

    // Remove old property marker
    if (homeNestPropertyMarker) {
        homeNestPropertyMarker.setMap(null);
    }

    // Remove old user marker
    if (homeNestUserMarker) {
        homeNestUserMarker.setMap(null);
    }

    // Create PROPERTY marker
    homeNestPropertyMarker = new google.maps.Marker({
        position: destination,
        map: homeNestMap,
        title: property.name || "Property",
        animation: google.maps.Animation.DROP
    });

    // If current location is not available,
    // just show the property.
    if (!userLocation) {

        homeNestMap.setCenter(destination);
        homeNestMap.setZoom(16);

        showToast(
            "📍 " +
            (property.name || "Property") +
            " location shown."
        );

        return;
    }

    // Create CURRENT LOCATION marker
    homeNestUserMarker = new google.maps.Marker({
        position: userLocation,
        map: homeNestMap,
        title: "Your Current Location",
        icon: {
            url:
                "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    });

    // Create Directions Service
    if (!homeNestDirectionsService) {
        homeNestDirectionsService =
            new google.maps.DirectionsService();
    }

    // Create Directions Renderer
    if (homeNestDirectionsRenderer) {
        homeNestDirectionsRenderer.setMap(null);
    }

    homeNestDirectionsRenderer =
        new google.maps.DirectionsRenderer({
            map: homeNestMap,
            suppressMarkers: true,
            preserveViewport: false,

            polylineOptions: {
                strokeColor: "#d93025",
                strokeOpacity: 1,
                strokeWeight: 6
            }
        });

    console.log("Getting REAL road route...");

    // REAL GOOGLE ROAD ROUTE
    homeNestDirectionsService.route(
        {
            origin: {
                lat: Number(userLocation.lat),
                lng: Number(userLocation.lng)
            },

            destination: {
                lat: Number(destination.lat),
                lng: Number(destination.lng)
            },

            travelMode: google.maps.TravelMode.DRIVING,

            optimizeWaypoints: false,

            provideRouteAlternatives: false
        },

        function (result, status) {

            console.log(
                "Google Directions status:",
                status
            );

            if (
                status ===
                google.maps.DirectionsStatus.OK
            ) {

                // THIS DRAWS THE REAL ROAD ROUTE
                homeNestDirectionsRenderer.setDirections(
                    result
                );

                const route =
                    result.routes[0];

                if (
                    route &&
                    route.legs &&
                    route.legs.length > 0
                ) {

                    const leg =
                        route.legs[0];

                    console.log(
                        "ROAD DISTANCE:",
                        leg.distance.text
                    );

                    console.log(
                        "DRIVING TIME:",
                        leg.duration.text
                    );

                    showToast(
                        "📍 Route found • " +
                        leg.distance.text +
                        " • " +
                        leg.duration.text
                    );
                }

            } else {

                console.error(
                    "GOOGLE DIRECTIONS ERROR:",
                    status
                );

                showToast(
                    "Google could not calculate the road route: " +
                    status
                );
            }
        }
    );
}
/* =========================================================
   GOOGLE MAPS DIRECTIONS
========================================================= */
function openGoogleMapsDirections(origin, destination) {

    if (!homeNestMap) {
        showToast("Google Maps is still loading. Please wait a moment.");
        return;
    }

    if (!destination) {
        showToast("Property location is not available.");
        return;
    }

    // Remove old route
    if (homeNestDirectionsRenderer) {
        homeNestDirectionsRenderer.setMap(null);
    }

    // Create Directions Renderer
    homeNestDirectionsRenderer =
        new google.maps.DirectionsRenderer({
            map: homeNestMap,
            suppressMarkers: false,
            polylineOptions: {
                strokeOpacity: 0.9,
                strokeWeight: 5
            }
        });

    // If current location is not available,
    // just show the property on the embedded map.
    if (!origin) {

        homeNestMap.setCenter(destination);
        homeNestMap.setZoom(16);

        if (homeNestPropertyMarker) {
            homeNestPropertyMarker.setMap(null);
        }

        homeNestPropertyMarker =
            new google.maps.Marker({
                position: destination,
                map: homeNestMap,
                title: "Selected Property",
                animation: google.maps.Animation.DROP
            });

        showToast("Property location shown on the map.");
        return;
    }

    // Google Maps Directions Service
    if (!homeNestDirectionsService) {
        homeNestDirectionsService =
            new google.maps.DirectionsService();
    }

    homeNestDirectionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        },

        function (result, status) {

            if (status === "OK") {

                homeNestDirectionsRenderer.setDirections(result);

                // Fit map to current location + property
                const bounds =
                    new google.maps.LatLngBounds();

                bounds.extend(origin);
                bounds.extend(destination);

                homeNestMap.fitBounds(bounds);

                showToast(
                    "📍 Route from your current location to the property is shown."
                );

            } else {

                console.error(
                    "Google Maps Directions error:",
                    status
                );

                // Fallback: show both markers
                if (homeNestUserMarker) {
                    homeNestUserMarker.setMap(null);
                }

                if (homeNestPropertyMarker) {
                    homeNestPropertyMarker.setMap(null);
                }

                homeNestUserMarker =
                    new google.maps.Marker({
                        position: origin,
                        map: homeNestMap,
                        title: "Your Current Location"
                    });

                homeNestPropertyMarker =
                    new google.maps.Marker({
                        position: destination,
                        map: homeNestMap,
                        title: "Selected Property"
                    });

                const bounds =
                    new google.maps.LatLngBounds();

                bounds.extend(origin);
                bounds.extend(destination);

                homeNestMap.fitBounds(bounds);

                showToast(
                    "Property and current location shown on the map."
                );
            }
        }
    );
}
/* =========================================================
   CURRENT LOCATION
========================================================= */

window.getCurrentLocation =
    function () {

        if (!navigator.geolocation) {

            showToast(
                "Your browser does not support location."
            );

            return;
        }

        showToast(
            "📍 Getting your current location..."
        );

        navigator.geolocation.getCurrentPosition(

            position => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                userCoords = [
                    latitude,
                    longitude
                ];

                localStorage.setItem(
                    "hnUserCoords",
                    JSON.stringify(
                        userCoords
                    )
                );

                const currentLocation = {
                    lat: latitude,
                    lng: longitude
                };

                if (
                    homeNestMap &&
                    typeof google !== "undefined" &&
                    google.maps
                ) {

                    if (
                        homeNestUserMarker
                    ) {

                        homeNestUserMarker.setMap(
                            null
                        );
                    }

                    homeNestUserMarker =
                        new google.maps.Marker({

                            position:
                                currentLocation,

                            map:
                                homeNestMap,

                            title:
                                "Your Current Location",

                            animation:
                                google.maps.Animation.DROP,

                            icon: {
                                url:
                                    "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                            }
                        });

                    homeNestMap.setCenter(
                        currentLocation
                    );

                    homeNestMap.setZoom(
                        15
                    );

                    if (
                        selectedProperty
                    ) {

                        showPropertyOnGoogleMap(
                            selectedProperty,
                            currentLocation
                        );
                    }
                }

                updateMapDistances();

                showToast(
                    "📍 Current location detected."
                );
            },

            error => {

                console.error(
                    "Location error:",
                    error
                );

                if (
                    error.code === 1
                ) {

                    showToast(
                        "Please allow location permission."
                    );

                } else {

                    showToast(
                        "Unable to get your current location."
                    );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        );
    };


window.openGoogleMapsLocation =
    function () {

        getCurrentLocation();
    };


/* =========================================================
   DISTANCE
========================================================= */

function distanceKm(
    first,
    second
) {

    const R = 6371;

    const dLat =
        (
            second.lat -
            first.lat
        ) *
        Math.PI /
        180;

    const dLng =
        (
            second.lng -
            first.lng
        ) *
        Math.PI /
        180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(
            first.lat *
            Math.PI /
            180
        ) *
        Math.cos(
            second.lat *
            Math.PI /
            180
        ) *
        Math.sin(dLng / 2) ** 2;

    return (
        R *
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        )
    );
}


/* =========================================================
   MAP PROPERTY LIST
========================================================= */

function renderMap() {

    const list =
        document.getElementById(
            "mapPropertyList"
        );

    if (!list) {
        return;
    }

    list.innerHTML = "";

    properties
        .slice(0, 10)
        .forEach(
            (property, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "map-item " +
                    (
                        index === 0
                            ? "active"
                            : ""
                    );

                item.innerHTML = `

                    <strong>
                        🏠
                        ${escapeHTML(
                            property.name
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            property.location
                        )}
                    </small>

                    <div class="distance"
                         id="mapDistance_${property.id}">
                        Distance: —
                    </div>
                `;

                item.onclick =
                    function () {

                        selectMapProperty(
                            property,
                            item
                        );
                    };

                list.appendChild(item);
            }
        );

    if (properties.length) {

        selectMapProperty(
            properties[0],
            list.firstElementChild
        );
    }
}


/* =========================================================
   SELECT MAP PROPERTY
========================================================= */

function selectMapProperty(
    property,
    item
) {

    selectedProperty =
        property;

    selectedMapProperty =
        property;

    document
        .querySelectorAll(
            "#mapPropertyList .map-item"
        )
        .forEach(
            element =>
                element.classList.remove(
                    "active"
                )
        );

    if (item) {

        item.classList.add(
            "active"
        );
    }

    showPropertyOnGoogleMap(
        property
    );

    updateMapDistances();
}


/* =========================================================
   MAP DISTANCES
========================================================= */

function updateMapDistances() {

    if (!userCoords) {
        return;
    }

    const user = {
        lat: userCoords[0],
        lng: userCoords[1]
    };

    properties
        .slice(0, 10)
        .forEach(property => {

            const element =
                document.getElementById(
                    "mapDistance_" +
                    property.id
                );

            if (!element) {
                return;
            }

            const coords =
                getPropertyCoordinates(
                    property
                );

            const distance =
                distanceKm(
                    user,
                    coords
                );

            element.innerText =
                "Distance: " +
                distance.toFixed(1) +
                " km";
        });
}


/* =========================================================
   REQUEST PROPERTY
========================================================= */

function requestProperty(id) {

    selectedProperty =
        properties.find(
            property => property.id == id
        );

    if (!selectedProperty) {
        return;
    }

    if (!currentUser) {

        openLogin();

        showToast(
            "Please login as a user first."
        );

        return;
    }

    createRequest();
}


function requestSelectedProperty() {

    if (!selectedProperty) {

        showToast(
            "Please select a property."
        );

        return;
    }

    closeModal(
        "propertyModal"
    );

    createRequest();
}


function createRequest() {

    if (
        !selectedProperty ||
        !currentUser
    ) {
        return;
    }

    const existing =
        requests.find(
            request =>
                request.propertyId ==
                    selectedProperty.id &&
                request.userEmail ==
                    currentUser.email &&
                request.status !==
                    "rejected"
        );

    if (existing) {

        showToast(
            "You already have a request for this property."
        );

        openUserPortal();

        return;
    }

    const request = {

        id: Date.now(),

        propertyId:
            selectedProperty.id,

        propertyName:
            selectedProperty.name,

        location:
            selectedProperty.location,

        userName:
            currentUser.name ||
            "HomeNest User",

        userEmail:
            currentUser.email,

        status:
            "pending",

        date:
            new Date().toLocaleString()
    };

    requests.push(
        request
    );

    saveRequests();

    notifications.push({

        id: Date.now(),

        userEmail:
            currentUser.email,

        text:
            "Your request for " +
            selectedProperty.name +
            " has been sent to the administrator.",

        type:
            "pending",

        date:
            new Date().toLocaleString()
    });

    saveNotifications();

    updateAdmin();
    updateUserPortal();

    showToast(
        "Request sent successfully."
    );

    openUserPortal();
}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function login() {

    const role =
        document.getElementById(
            "loginRole"
        )?.value;

    const email =
        document.getElementById(
            "loginEmail"
        )?.value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById(
            "loginPassword"
        )?.value || "";

    if (role === "admin") {

        if (
            email ===
                "pratikshapirangi0332@gmail.com" &&
            password ===
                "pratiksha@214"
        ) {

            localStorage.setItem(
                "hnAdminLoggedIn",
                "true"
            );

            localStorage.setItem(
                "hnAdminEmail",
                email
            );

            closeModal(
                "loginModal"
            );

            document
                .getElementById(
                    "adminPortal"
                )
                ?.classList.add(
                    "active"
                );

            updateAdmin();

            showToast(
                "Administrator portal opened."
            );

        } else {

            showToast(
                "Invalid administrator credentials."
            );
        }

        return;
    }

    if (!email || !password) {

        showToast(
            "Please enter your email and password."
        );

        return;
    }

    if (password.length < 5) {

        showToast(
            "Password must contain at least 5 characters."
        );

        return;
    }

    currentUser = {

        name:
            email.split("@")[0],

        email:
            email
    };

    localStorage.setItem(
        "hnUser",
        JSON.stringify(
            currentUser
        )
    );

    closeModal(
        "loginModal"
    );

    showToast(
        "Welcome to HomeNest, " +
        currentUser.name +
        "!"
    );

    updateUserPortal();
}


/* =========================================================
   ADMIN AUTH CHECK
========================================================= */

function isAdminLoggedIn() {

    return (
        localStorage.getItem(
            "hnAdminLoggedIn"
        ) === "true"
    );
}


/* =========================================================
   OPEN ADD PROPERTY
========================================================= */

window.openAddProperty =
    function () {

        if (!isAdminLoggedIn()) {

            showToast(
                "Administrator login required."
            );

            return;
        }

        const modal =
            document.getElementById(
                "addPropertyModal"
            );

        if (!modal) {

            showToast(
                "Add Property form not found."
            );

            return;
        }

        modal.classList.add(
            "active"
        );
    };


/* =========================================================
   ADD PROPERTY
========================================================= */

function addNewProperty() {

    if (!isAdminLoggedIn()) {

        showToast(
            "Please login as administrator."
        );

        return;
    }

    const get =
        id =>
            document.getElementById(
                id
            );

    const name =
        get("newName")?.value.trim();

    const location =
        get("newLocation")?.value.trim();

    const type =
        get("newType")?.value;

    const priceText =
        get("newPrice")?.value.trim();

    const bedrooms =
        Number(
            get("newBedrooms")?.value
        ) || 0;

    const bathrooms =
        Number(
            get("newBathrooms")?.value
        ) || 0;

    const area =
        get("newArea")?.value.trim();

    const parking =
        get("newParking")?.value.trim();

    const furnishing =
        get("newFurnishing")?.value;

    const facing =
        get("newFacing")?.value;

    const image =
        get("newImage")?.value.trim();

    const amenities =
        get("newAmenities")?.value.trim();

    const description =
        get("newDescription")?.value.trim();

    if (
        !name ||
        !location ||
        !priceText
    ) {

        showToast(
            "Property name, location and price are required."
        );

        return;
    }

    let price =
        parseFloat(
            priceText
                .replace(/[₹,\s]/g, "")
                .replace(/crore/gi, "")
                .replace(/cr/gi, "")
        );

    if (
        /cr|crore/i.test(
            priceText
        )
    ) {

        price *= 100;
    }

    if (!Number.isFinite(price)) {
        price = 999;
    }

    const city =
        location
            .split(",")[0]
            .trim();

    const coords =
        CITY_COORDS[city] ||
        CITY_COORDS.Bengaluru;

    const newProperty = {

        id:
            Date.now(),

        name:
            name,

        location:
            location,

        city:
            city,

        type:
            type,

        price:
            price,

        priceText:
            priceText,

        bedrooms:
            bedrooms,

        bathrooms:
            bathrooms,

        area:
            area ||
            "Not specified",

        parking:
            parking ||
            "Not specified",

        furnishing:
            furnishing,

        facing:
            facing,

        image:
            image ||
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",

        amenities:
            amenities ||
            "Security • Parking",

        description:
            description ||
            "Newly added verified property.",

        rating:
            5,

        reviews:
            0,

        distance:
            "—",

        lat:
            coords[0],

        lng:
            coords[1]
    };

    properties.unshift(
        newProperty
    );

    saveProperties();

    closeAddPropertyModal();

    renderProperties();
    renderMap();
    updateAdmin();

    showToast(
        "🏠 New property published successfully."
    );
}


/* =========================================================
   CLOSE ADD PROPERTY MODAL
========================================================= */

window.closeAddPropertyModal =
    function () {

        const modal =
            document.getElementById(
                "addPropertyModal"
            );

        if (modal) {

            modal.classList.remove(
                "active"
            );
        }
    };


/* =========================================================
   ADMIN PROPERTY MANAGEMENT
========================================================= */

function renderAdminProperties() {

    const table =
        document.getElementById(
            "adminPropertiesTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML =
        properties
            .map(
                property => `

                <tr>

                    <td>
                        ${escapeHTML(
                            property.name
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            property.location
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            property.type
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            property.priceText
                        )}
                    </td>

                    <td>
                        ${property.bedrooms}
                    </td>

                    <td>
                        ${property.bathrooms}
                    </td>

                    <td>

                        <button
                            class="table-btn confirm"
                            onclick="editProperty(${property.id})">
                            Edit
                        </button>

                        <button
                            class="table-btn reject"
                            onclick="deleteProperty(${property.id})">
                            Delete
                        </button>

                    </td>

                </tr>
            `
            )
            .join("");
}


/* =========================================================
   EDIT PROPERTY
========================================================= */

function editProperty(id) {

    const property =
        properties.find(
            p => p.id == id
        );

    if (!property) {
        return;
    }

    const name =
        prompt(
            "Property name:",
            property.name
        );

    if (name === null) {
        return;
    }

    const location =
        prompt(
            "Location:",
            property.location
        );

    if (location === null) {
        return;
    }

    const price =
        prompt(
            "Price:",
            property.priceText
        );

    if (price === null) {
        return;
    }

    property.name =
        name.trim() ||
        property.name;

    property.location =
        location.trim() ||
        property.location;

    property.city =
        property.location
            .split(",")[0]
            .trim();

    property.priceText =
        price.trim() ||
        property.priceText;

    saveProperties();

    renderProperties();
    renderAdminProperties();
    renderMap();

    showToast(
        "Property updated successfully."
    );
}


/* =========================================================
   DELETE PROPERTY
========================================================= */

function deleteProperty(id) {

    if (
        !confirm(
            "Delete this property?"
        )
    ) {
        return;
    }

    properties =
        properties.filter(
            property =>
                property.id != id
        );

    saveProperties();

    renderProperties();
    renderAdminProperties();
    renderMap();
    updateAdmin();

    showToast(
        "Property deleted."
    );
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function updateAdmin() {

    const set =
        (id, value) => {

            const element =
                document.getElementById(id);

            if (element) {
                element.innerText =
                    value;
            }
        };

    set(
        "adminRequestCount",
        requests.length
    );

    set(
        "adminPendingCount",
        requests.filter(
            r =>
                r.status ===
                "pending"
        ).length
    );

    set(
        "adminConfirmedCount",
        requests.filter(
            r =>
                r.status ===
                "confirmed"
        ).length
    );

    set(
        "adminRejectedCount",
        requests.filter(
            r =>
                r.status ===
                "rejected"
        ).length
    );

    set(
        "adminPropertyCount",
        properties.length
    );

    renderAdminRequests();
    renderAdminProperties();
    renderAdminUsers();
}


function renderAdminRequests() {

    const table =
        document.getElementById(
            "adminRequestsTable"
        );

    if (!table) {
        return;
    }

    if (!requests.length) {

        table.innerHTML =
            `<tr>
                <td colspan="6">
                    No buyer requests yet.
                </td>
            </tr>`;

        return;
    }

    table.innerHTML =
        requests
            .slice()
            .reverse()
            .map(
                request => `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(
                                request.userName
                            )}
                        </strong>
                        <br>
                        <small>
                            ${escapeHTML(
                                request.userEmail
                            )}
                        </small>
                    </td>

                    <td>
                        ${escapeHTML(
                            request.propertyName
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            request.location
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            request.date
                        )}
                    </td>

                    <td>
                        <span class="status ${request.status}">
                            ${request.status}
                        </span>
                    </td>

                    <td>

                        ${
                            request.status ===
                            "pending"

                            ?

                            `
                            <button
                                class="table-btn confirm"
                                onclick="changeRequestStatus(${request.id},'confirmed')">
                                ✓ Confirm
                            </button>

                            <button
                                class="table-btn reject"
                                onclick="changeRequestStatus(${request.id},'rejected')">
                                ✕ Reject
                            </button>
                            `

                            :

                            `<small>Processed</small>`
                        }

                    </td>

                </tr>
            `
            )
            .join("");
}

// ============================================================
// ADMIN REQUEST STATUS + EMAIL NOTIFICATION
// ============================================================

async function changeRequestStatus(id, status) {

    const request =
        requests.find(r => r.id === id);

    if (!request) {
        showToast("Request not found.");
        return;
    }

    request.status = status;

    localStorage.setItem(
        "hnRequests",
        JSON.stringify(requests)
    );

    let text = "";

    if (status === "confirmed") {

        text =
            "🎉 Thank you for choosing HomeNest! " +
            "Your request for " +
            request.propertyName +
            " has been confirmed by the administrator. " +
            "You may now continue with the property purchase process.";

    } else {

        text =
            "Your request for " +
            request.propertyName +
            " has been rejected by the administrator. " +
            "You may explore other verified properties on HomeNest.";
    }

    notifications.push({

        id: Date.now(),

        userEmail:
            request.userEmail,

        text: text,

        type: status,

        date:
            new Date().toLocaleString()
    });

    localStorage.setItem(
        "hnNotifications",
        JSON.stringify(notifications)
    );

    // ========================================================
    // SEND EMAIL ONLY AFTER CONFIRMATION
    // ========================================================

    if (
        status === "confirmed" &&
        request.userEmail
    ) {

        try {

            const response =
                await fetch(
                    "/api/email/property-confirmed",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            userEmail:
                                request.userEmail,

                            userName:
                                request.userName ||
                                "HomeNest User",

                            propertyName:
                                request.propertyName,

                            location:
                                request.location || ""

                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                console.error(
                    "Email sending failed:",
                    data
                );

                showToast(
                    "Property confirmed, but email could not be sent."
                );

            } else {

                showToast(
                    "Property confirmed and email sent successfully. 📧"
                );
            }

        } catch (error) {

            console.error(
                "Email notification error:",
                error
            );

            showToast(
                "Property confirmed. Email service is unavailable."
            );
        }

    } else {

        showToast(
            status === "confirmed"
                ? "Property request confirmed."
                : "Property request rejected."
        );
    }

    updateAdmin();
    updateUserPortal();
}

/* =========================================================
   ADMIN SECTIONS
========================================================= */

function showAdminSection(
    section
) {

    const requestsSection =
        document.getElementById(
            "adminRequestsSection"
        );

    const propertiesSection =
        document.getElementById(
            "adminPropertiesSection"
        );

    const usersSection =
        document.getElementById(
            "adminUsersSection"
        );

    if (requestsSection) {

        requestsSection.style.display =
            section ===
            "requests"
                ? "block"
                : "none";
    }

    if (propertiesSection) {

        propertiesSection.style.display =
            section ===
            "properties"
                ? "block"
                : "none";
    }

    if (usersSection) {

        usersSection.style.display =
            section ===
            "users"
                ? "block"
                : "none";
    }
}


function refreshAdmin() {

    updateAdmin();

    showToast(
        "Admin dashboard refreshed."
    );
}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

window.logoutAdmin =
    function () {

        localStorage.removeItem(
            "hnAdminLoggedIn"
        );

        localStorage.removeItem(
            "hnAdminEmail"
        );

        localStorage.removeItem(
            "adminLoggedIn"
        );

        sessionStorage.removeItem(
            "hnAdminLoggedIn"
        );

        document
            .getElementById(
                "adminPortal"
            )
            ?.classList.remove(
                "active"
            );

        closeAddPropertyModal();

        showToast(
            "Administrator logged out successfully."
        );

        updateAdmin();
        renderProperties();
    };


/* =========================================================
   USER PORTAL
========================================================= */

function openUserPortal() {

    if (!currentUser) {

        openLogin();

        return;
    }

    updateUserPortal();

    document
        .getElementById(
            "userPortal"
        )
        ?.classList.add(
            "active"
        );
}


function closeUserPortal() {

    document
        .getElementById(
            "userPortal"
        )
        ?.classList.remove(
            "active"
        );
}


function updateUserPortal() {

    if (!currentUser) {
        return;
    }

    const userRequests =
        requests.filter(
            request =>
                request.userEmail ===
                currentUser.email
        );

    const pending =
        userRequests.filter(
            request =>
                request.status ===
                "pending"
        ).length;

    const confirmed =
        userRequests.filter(
            request =>
                request.status ===
                "confirmed"
        ).length;

    setText(
        "userRequestCount",
        userRequests.length
    );

    setText(
        "userPendingCount",
        pending
    );

    setText(
        "userConfirmedCount",
        confirmed
    );

    setText(
        "userWishlistCount",
        wishlist.length
    );

    const requestBox =
        document.getElementById(
            "userRequests"
        );

    if (requestBox) {

        if (!userRequests.length) {

            requestBox.innerHTML =
                `<div class="notice">
                    You haven't sent any property requests yet.
                </div>`;

        } else {

            requestBox.innerHTML =
                userRequests
                    .slice()
                    .reverse()
                    .map(
                        request => `

                        <div class="request-card">

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        request.propertyName
                                    )}
                                </strong>

                                <div style="font-size:11px;color:#777;margin-top:5px">
                                    📍
                                    ${escapeHTML(
                                        request.location
                                    )}
                                </div>

                                <div style="font-size:10px;color:#999;margin-top:4px">
                                    Requested:
                                    ${escapeHTML(
                                        request.date
                                    )}
                                </div>

                            </div>

                            <div style="text-align:right">

                                <span class="status ${request.status}">
                                    ${request.status.toUpperCase()}
                                </span>

                                ${
                                    request.status ===
                                    "confirmed"

                                    ?

                                    `
                                    <button
                                        class="table-btn confirm"
                                        style="display:block;margin-top:7px"
                                        onclick="openReview(${request.propertyId})">
                                        ⭐ Review Property
                                    </button>
                                    `

                                    :

                                    ""
                                }

                            </div>

                        </div>
                    `
                    )
                    .join("");
        }
    }

    const notificationBox =
        document.getElementById(
            "userNotifications"
        );

    if (notificationBox) {

        const notes =
            notifications.filter(
                notification =>
                    notification.userEmail ===
                    currentUser.email
            );

        if (!notes.length) {

            notificationBox.innerHTML =
                `<div class="notice">
                    No new messages from the administrator.
                </div>`;

        } else {

            notificationBox.innerHTML =
                notes
                    .slice()
                    .reverse()
                    .map(
                        note => `

                        <div class="notice">

                            <strong>
                                ${
                                    note.type ===
                                    "confirmed"

                                        ? "✅ Property Confirmed"

                                        : note.type ===
                                          "rejected"

                                        ? "❌ Request Rejected"

                                        : "⏳ Request Pending"
                                }
                            </strong>

                            <div style="margin-top:5px">
                                ${escapeHTML(
                                    note.text
                                )}
                            </div>

                            <small style="color:#888">
                                ${escapeHTML(
                                    note.date
                                )}
                            </small>

                        </div>
                    `
                    )
                    .join("");
        }
    }
}


/* =========================================================
   WHATSAPP AGENT
========================================================= */

function contactAgent(propertyId) {

    const property =
        properties.find(
            p => p.id == propertyId
        ) ||
        selectedProperty;

    if (!property) {

        showToast(
            "Please select a property first."
        );

        return;
    }

    const phone =
        "919876543210";

    const message =
        "Hello HomeNest Agent, I am interested in " +
        property.name +
        " located at " +
        property.location +
        ".";

    const url =
        "https://wa.me/" +
        phone +
        "?text=" +
        encodeURIComponent(
            message
        );

    window.open(
        url,
        "_blank"
    );
}


/* =========================================================
   CALL AGENT
========================================================= */

function callAgent() {

    window.location.href =
        "tel:+919876543210";
}


/* =========================================================
   AI CHAT
========================================================= */

function toggleChat() {

    document
        .getElementById(
            "chatWindow"
        )
        ?.classList.toggle(
            "open"
        );
}


function chatAboutSelectedProperty() {

    if (!selectedProperty) {

        showToast(
            "Please select a property first."
        );

        return;
    }

    closeModal(
        "propertyModal"
    );

    const chat =
        document.getElementById(
            "chatWindow"
        );

    if (chat) {
        chat.classList.add(
            "open"
        );
    }

    addBotMessage(
        "🏠 I am ready to answer questions about " +
        "<strong>" +
        escapeHTML(
            selectedProperty.name
        ) +
        "</strong>."
    );
}


function addBotMessage(
    text
) {

    const box =
        document.getElementById(
            "chatMessages"
        );

    if (!box) {
        return;
    }

    box.innerHTML +=
        `<div class="message bot">
            ${text}
        </div>`;

    box.scrollTop =
        box.scrollHeight;
}


function addUserMessage(
    text
) {

    const box =
        document.getElementById(
            "chatMessages"
        );

    if (!box) {
        return;
    }

    box.innerHTML +=
        `<div class="message user">
            ${escapeHTML(text)}
        </div>`;

    box.scrollTop =
        box.scrollHeight;
}


function sendMessage() {

    const input =
        document.getElementById(
            "chatInput"
        );

    if (!input) {
        return;
    }

    const message =
        input.value.trim();

    if (!message) {
        return;
    }

    addUserMessage(
        message
    );

    input.value = "";

    setTimeout(
        () => {

            addBotMessage(
                generatePropertyAIResponse(
                    message
                )
            );

        },
        400
    );
}


function generatePropertyAIResponse(
    message
) {

    const p =
        selectedProperty;

    if (!p) {

        return (
            "👋 Please select a property first."
        );
    }

    const q =
        message.toLowerCase();

    if (
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("budget")
    ) {

        return `
            💰
            <strong>
                ${escapeHTML(p.name)}
            </strong>
            is listed at
            <strong>
                ${escapeHTML(p.priceText)}
            </strong>.
        `;
    }

    if (
        q.includes("bed") ||
        q.includes("room")
    ) {

        return `
            🛏️ This property has
            <strong>
                ${p.bedrooms} bedrooms
            </strong>.
        `;
    }

    if (
        q.includes("bath")
    ) {

        return `
            🚿 This property has
            <strong>
                ${p.bathrooms} bathrooms
            </strong>.
        `;
    }

    if (
        q.includes("area") ||
        q.includes("size")
    ) {

        return `
            📐 The property has
            <strong>
                ${escapeHTML(p.area)}
            </strong>
            of area.
        `;
    }

    if (
        q.includes("amenit") ||
        q.includes("facility")
    ) {

        return `
            ✨ Amenities:
            <strong>
                ${escapeHTML(p.amenities)}
            </strong>
        `;
    }

    if (
        q.includes("location") ||
        q.includes("where") ||
        q.includes("address")
    ) {

        return `
            📍 The property is located at
            <strong>
                ${escapeHTML(p.location)}
            </strong>.
        `;
    }

    if (
        q.includes("parking")
    ) {

        return `
            🚗 Parking:
            <strong>
                ${escapeHTML(p.parking)}
            </strong>.
        `;
    }

    if (
        q.includes("furnish")
    ) {

        return `
            🛋️ Furnishing:
            <strong>
                ${escapeHTML(p.furnishing)}
            </strong>.
        `;
    }

    if (
        q.includes("buy") ||
        q.includes("purchase")
    ) {

        return `
            🏠 Buying process:
            <br>
            1. Send request
            <br>
            2. Admin reviews request
            <br>
            3. Admin confirms/rejects
            <br>
            4. Contact agent
            <br>
            5. Verify property documents
        `;
    }

    return `
        🤝
        <strong>
            ${escapeHTML(p.name)}
        </strong>
        is a
        ${escapeHTML(p.type)}
        in
        ${escapeHTML(p.location)}.
        <br><br>
        💰 ${escapeHTML(p.priceText)}
        <br>
        🛏 ${p.bedrooms} bedrooms
        <br>
        🚿 ${p.bathrooms} bathrooms
        <br>
        📐 ${escapeHTML(p.area)}
    `;
}


/* =========================================================
   REVIEW
========================================================= */

function openReview(
    propertyId
) {

    if (!currentUser) {
        return;
    }

    const request =
        requests.find(
            r =>
                r.propertyId == propertyId &&
                r.userEmail ===
                    currentUser.email &&
                r.status ===
                    "confirmed"
        );

    if (!request) {

        showToast(
            "Only confirmed buyers can review."
        );

        return;
    }

    const property =
        properties.find(
            p => p.id == propertyId
        );

    if (!property) {
        return;
    }

    const review =
        prompt(
            "Write your review for " +
            property.name
        );

    if (!review) {
        return;
    }

    property.reviews =
        Number(property.reviews || 0) +
        1;

    property.rating =
        Math.min(
            5,
            Number(property.rating || 0) +
                0.01
        );

    saveProperties();

    renderProperties();

    showToast(
        "Thank you for your review! ⭐"
    );
}


/* =========================================================
   MODALS
========================================================= */

function openLogin() {

    document
        .getElementById(
            "loginModal"
        )
        ?.classList.add(
            "active"
        );
}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    const toast =
        document.createElement(
            "div"
        );

    toast.innerHTML =
        message;

    toast.style.position =
        "fixed";

    toast.style.left =
        "50%";

    toast.style.bottom =
        "25px";

    toast.style.transform =
        "translateX(-50%)";

    toast.style.zIndex =
        "99999";

    toast.style.padding =
        "13px 20px";

    toast.style.background =
        "#172033";

    toast.style.color =
        "#fff";

    toast.style.borderRadius =
        "12px";

    toast.style.fontSize =
        "12px";

    toast.style.fontWeight =
        "700";

    toast.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.2)";

    document.body.appendChild(
        toast
    );

    setTimeout(
        () => toast.remove(),
        2800
    );
}


/* =========================================================
   HELPERS
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText =
            value;
    }
}


function saveProperties() {

    localStorage.setItem(
        "hnProperties",
        JSON.stringify(
            properties
        )
    );
}


function saveRequests() {

    localStorage.setItem(
        "hnRequests",
        JSON.stringify(
            requests
        )
    );
}


function saveNotifications() {

    localStorage.setItem(
        "hnNotifications",
        JSON.stringify(
            notifications
        )
    );
}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


/* =========================================================
   SCROLL
========================================================= */

window.addEventListener(
    "scroll",
    () => {

        const nav =
            document.getElementById(
                "navbar"
            );

        if (!nav) {
            return;
        }

        if (
            window.scrollY > 40
        ) {

            nav.classList.add(
                "scrolled"
            );

        } else {

            nav.classList.remove(
                "scrolled"
            );
        }
    }
);


/* =========================================================
   CLOSE MODALS BY OUTSIDE CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "active"
            );
        }
    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        applyLanguage();

        renderProperties();

        renderMap();

        updateUserPortal();

        updateAdmin();

        try {

            const savedCoords =
                JSON.parse(
                    localStorage.getItem(
                        "hnUserCoords"
                    ) || "null"
                );

            if (
                Array.isArray(
                    savedCoords
                )
            ) {

                userCoords =
                    savedCoords;

                updateMapDistances();
            }

        } catch (error) {

            console.error(
                "Location restore error:",
                error
            );
        }

        document
            .querySelectorAll(
                ".modal"
            )
            .forEach(
                modal => {

                    modal.addEventListener(
                        "click",
                        event => {

                            if (
                                event.target ===
                                modal
                            ) {

                                modal.classList.remove(
                                    "active"
                                );
                            }
                        }
                    );
                }
            );
    }
);


/* =========================================================
   GOOGLE MAPS CALLBACK SAFETY
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                if (
                    typeof google !==
                        "undefined" &&
                    google.maps &&
                    !homeNestMap
                ) {

                    window.initGoogleMap();
                }

            },
            1000
        );
    }
);


/* =========================================================
   RESTORE ADMIN PORTAL AFTER REFRESH
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            localStorage.getItem(
                "hnAdminLoggedIn"
            ) === "true"
        ) {

            document
                .getElementById(
                    "adminPortal"
                )
                ?.classList.add(
                    "active"
                );

            updateAdmin();
        }
    }
);


/* =========================================================
   GOOGLE TRANSLATE RESTORE
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                const saved =
                    localStorage.getItem(
                        "hnLanguage"
                    );

                if (
                    saved &&
                    translations[saved]
                ) {

                    currentLanguage =
                        saved;

                    applyLanguage();
                }

            },
            1500
        );
    }
);