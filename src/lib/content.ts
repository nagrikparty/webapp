export const navItems = [
  { href: "/", en: "Home", hi: "होम" },
  { href: "/manifesto", en: "Manifesto", hi: "घोषणापत्र" },
  { href: "/issues", en: "Issues", hi: "मुद्दे" },
  { href: "/volunteer", en: "Volunteer", hi: "स्वयंसेवक" },
  { href: "/membership", en: "Membership", hi: "सदस्यता" },
  { href: "/president", en: "Party President", hi: "पार्टी अध्यक्ष" },
  { href: "/about", en: "About", hi: "परिचय" },
];

export const delhiAreas = [
  "Narela", "Burari", "Timarpur", "Adarsh Nagar", "Badli", "Rithala", 
  "Bawana", "Mundka", "Kirari", "Sultanpur Majra", "Nangloi Jat", "Mangol Puri", 
  "Rohini", "Shalimar Bagh", "Shakur Basti", "Tri Nagar", "Wazirpur", "Model Town", 
  "Sadar Bazar", "Chandni Chowk", "Matia Mahal", "Ballimaran", "Karol Bagh", "Patel Nagar", 
  "Moti Nagar", "Madipur", "Rajouri Garden", "Hari Nagar", "Tilak Nagar", "Janakpuri", 
  "Vikaspuri", "Uttam Nagar", "Dwarka", "Matiala", "Najafgarh", "Bijwasan", 
  "Palam", "Delhi Cantonment", "Rajinder Nagar", "New Delhi", "Jangpura", "Kasturba Nagar", 
  "Malviya Nagar", "R.K. Puram", "Chhatarpur", "Deoli", "Ambedkar Nagar", "Sangam Vihar", 
  "Greater Kailash", "Kalkaji", "Tughlakabad", "Badarpur", "Okhla", "Trilokpuri", 
  "Kondli", "Patparganj", "Laxmi Nagar", "Vishwas Nagar", "Krishna Nagar", "Gandhi Nagar", 
  "Shahdara", "Seemapuri", "Rohtas Nagar", "Seelampur", "Ghonda", "Babarpur", 
  "Gokalpur", "Mustafabad", "Karawal Nagar"
];

export const legalLinks = [
  { slug: "constitution", en: "Constitution", hi: "संविधान" },
  { slug: "rulebook", en: "Rulebook", hi: "नियमावली" },
  { slug: "ethics", en: "Code of Ethics", hi: "आचार संहिता" },
  { slug: "digital-governance", en: "Digital Governance & Privacy", hi: "डिजिटल शासन और गोपनीयता" },
  { slug: "financial-transparency", en: "Financial Transparency", hi: "वित्तीय पारदर्शिता" },
  { slug: "candidate-selection", en: "Candidate Selection Policy", hi: "उम्मीदवार चयन नीति" },
  { slug: "internal-democracy", en: "Internal Democracy", hi: "आंतरिक लोकतंत्र" },
  { slug: "official-communication", en: "Official Communication", hi: "आधिकारिक संचार" },
  { slug: "privacy", en: "Privacy Notice", hi: "गोपनीयता सूचना" },
];

export const legalPages: Record<
  string,
  { title: string; titleHi: string; summary: string; summaryHi: string; sections: Array<{ h: string; hHi: string; p: string; pHi: string }> }
> = {
  constitution: {
    title: "Constitution",
    titleHi: "संविधान",
    summary: "Nagrik Party is under registration and commits to constitutional democracy, secularism, transparency and public accountability.",
    summaryHi: "नागरिक पार्टी पंजीकरण प्रक्रिया में है और संवैधानिक लोकतंत्र, धर्मनिरपेक्षता, पारदर्शिता और सार्वजनिक जवाबदेही के लिए प्रतिबद्ध है।",
    sections: [
      {
        h: "Status",
        hHi: "स्थिति",
        p: "The final registration filing documents will be published only after legal review and founder approval.",
        pHi: "अंतिम पंजीकरण दस्तावेज कानूनी समीक्षा और संस्थापक स्वीकृति के बाद ही प्रकाशित होंगे।",
      },
    ],
  },
  rulebook: {
    title: "Rulebook & Internal Governance",
    titleHi: "नियमावली और आंतरिक शासन",
    summary: "Internal structures, review bodies, membership verification and democratic procedure live here.",
    summaryHi: "आंतरिक संरचनाएं, समीक्षा निकाय, सदस्य सत्यापन और लोकतांत्रिक प्रक्रिया यहां प्रकाशित होगी।",
    sections: [
      {
        h: "Four-year election review",
        hHi: "चार वर्षीय चुनाव समीक्षा",
        p: "The internal election period should be reviewed against current ECI registration expectations before filing.",
        pHi: "दाखिल करने से पहले आंतरिक चुनाव अवधि की वर्तमान ECI अपेक्षाओं के साथ समीक्षा जरूरी है।",
      },
    ],
  },
  ethics: {
    title: "Code of Ethics",
    titleHi: "आचार संहिता",
    summary: "Public conduct, anti-corruption, anti-hate and due-process principles for members and representatives.",
    summaryHi: "सदस्यों और प्रतिनिधियों के लिए सार्वजनिक आचरण, भ्रष्टाचार विरोध, नफरत विरोध और उचित प्रक्रिया के सिद्धांत।",
    sections: [
      {
        h: "Public discipline",
        hHi: "सार्वजनिक अनुशासन",
        p: "Political disagreement must remain constitutional, issue-based and non-violent.",
        pHi: "राजनीतिक असहमति संवैधानिक, मुद्दा-आधारित और अहिंसक रहनी चाहिए।",
      },
    ],
  },
  "digital-governance": {
    title: "Digital Governance & Privacy",
    titleHi: "डिजिटल शासन और गोपनीयता",
    summary: "The platform will collect civic issues while keeping sensitive citizen identity private.",
    summaryHi: "प्लेटफॉर्म नागरिक मुद्दे जमा करेगा, लेकिन संवेदनशील नागरिक पहचान निजी रखेगा।",
    sections: [
      {
        h: "No public names on issue reports",
        hHi: "मुद्दा रिपोर्ट में सार्वजनिक नाम नहीं",
        p: "Issue pages show public work, not complainant identity.",
        pHi: "मुद्दा पेज सार्वजनिक काम दिखाते हैं, शिकायतकर्ता की पहचान नहीं।",
      },
    ],
  },
  "financial-transparency": {
    title: "Financial Transparency",
    titleHi: "वित्तीय पारदर्शिता",
    summary: "Donation acceptance is disabled until party funding channels are legally cleared.",
    summaryHi: "पार्टी फंडिंग चैनल कानूनी रूप से स्पष्ट होने तक दान स्वीकार करना बंद रहेगा।",
    sections: [
      {
        h: "Funding interest only",
        hHi: "अभी केवल समर्थन रुचि",
        p: "Supporters may express interest. The website will not collect party donations until compliance is confirmed.",
        pHi: "समर्थक रुचि दर्ज कर सकते हैं। अनुपालन स्पष्ट होने तक वेबसाइट पार्टी दान नहीं लेगी।",
      },
    ],
  },
  "candidate-selection": {
    title: "Candidate Selection Policy",
    titleHi: "उम्मीदवार चयन नीति",
    summary: "Independent candidates may join the Delhi platform through review, ethics and transparency standards.",
    summaryHi: "स्वतंत्र उम्मीदवार समीक्षा, आचार और पारदर्शिता मानकों के माध्यम से दिल्ली प्लेटफॉर्म से जुड़ सकते हैं।",
    sections: [
      {
        h: "No automatic tickets",
        hHi: "स्वचालित टिकट नहीं",
        p: "Interest in candidacy is not an official nomination before registration and formal selection.",
        pHi: "उम्मीदवारी में रुचि पंजीकरण और औपचारिक चयन से पहले आधिकारिक नामांकन नहीं है।",
      },
    ],
  },
  "internal-democracy": {
    title: "Internal Democracy",
    titleHi: "आंतरिक लोकतंत्र",
    summary: "Consultations, voting and member participation will be auditable and role-based.",
    summaryHi: "परामर्श, मतदान और सदस्य भागीदारी ऑडिट योग्य और भूमिका आधारित होगी।",
    sections: [
      {
        h: "Hybrid democracy",
        hHi: "हाइब्रिड लोकतंत्र",
        p: "Digital participation supports physical meetings and legal organisational procedure.",
        pHi: "डिजिटल भागीदारी भौतिक बैठकों और कानूनी संगठनात्मक प्रक्रिया का समर्थन करती है।",
      },
    ],
  },
  "official-communication": {
    title: "Official Communication",
    titleHi: "आधिकारिक संचार",
    summary: "Only authorised representatives may issue official statements for Nagrik Party.",
    summaryHi: "केवल अधिकृत प्रतिनिधि ही नागरिक पार्टी के लिए आधिकारिक बयान जारी कर सकते हैं।",
    sections: [
      {
        h: "Correction system",
        hHi: "सुधार प्रणाली",
        p: "Public clarifications and corrections will be published where needed.",
        pHi: "जहां जरूरत होगी, सार्वजनिक स्पष्टीकरण और सुधार प्रकाशित किए जाएंगे।",
      },
    ],
  },
  privacy: {
    title: "Privacy Notice",
    titleHi: "गोपनीयता सूचना",
    summary: "This pre-registration platform collects only what is needed for civic participation, volunteer coordination and membership verification.",
    summaryHi: "यह प्री-रजिस्ट्रेशन प्लेटफॉर्म नागरिक भागीदारी, स्वयंसेवक समन्वय और सदस्यता सत्यापन के लिए जरूरी जानकारी ही जमा करता है।",
    sections: [
      {
        h: "Sensitive data",
        hHi: "संवेदनशील डेटा",
        p: "Citizen issue identities, legal member documents and internal compliance data are not shown publicly.",
        pHi: "नागरिक मुद्दा पहचान, कानूनी सदस्य दस्तावेज और आंतरिक अनुपालन डेटा सार्वजनिक नहीं दिखाया जाता।",
      },
    ],
  },
};
