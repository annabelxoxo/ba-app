// Huisstijlkleuren Busleyden Atheneum 

export const BRAND = {
  green: '#86BC25',   // primair groen
  black: '#000000',   // primair zwart 
  white: '#FFFFFF',
};

// Key = de slug zoals die in je Webflow CMS staat.
// LET OP: check deze slugs tegen je eigen CMS, pas aan waar nodig.
export const CAMPUS_ACCENT = {
  'ondernemen-en-it': '#E63323',                // Zandpoort
  'werken-leren': '#DEDC00',                    // Nekkerspoel
  'buiten-gewoon-leren': '#00AFCB',             // De Beemden
  'intergaal-en-creatief': '#1961AC',           // Caputsteen
  'kennis-en-onderzoek': '#A7358B',             // Pitzemburg
  'mens-en-welzijn': '#F7A600',                 // Stassart
  'gezondheid-wetenschap': '#EA5297',           // Botaniek
  'word-verpleegkundige-in-drie-jaar': '#86BC25', // graduaat → groen
};


export const getCampusAccent = (slug) => CAMPUS_ACCENT[slug] ?? BRAND.green;