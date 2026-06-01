const TOKEN = process.env.EXPO_PUBLIC_WEBFLOW_TOKEN;
const BASE = 'https://api.webflow.com/v2';

const COLLECTIONS = {
  products: '6a170386fd6b6da721f6e83a', 
  news: '6a161a5696779fb41c9f8c83',     
  campuses: '6a1594003aee4ffb0357ccb3', 
};


async function fetchCollection(collectionId) {
  const res = await fetch(`${BASE}/collections/${collectionId}/items`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'accept-version': '1.0.0',
    },
  });

  if (!res.ok) {
    throw new Error(`Webflow API error: ${res.status}`);
  }

  const data = await res.json();
  return data.items ?? [];
}


function parsePrice(value) {
  if (value == null) return 0;
  const cleaned = String(value)
    .replace(/[^\d,.-]/g, '') 
    .replace(',', '.');       
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}


export async function getProducts() {
  const items = await fetchCollection(COLLECTIONS.products);
  return items.map((item) => {
    const f = item.fieldData ?? {};
    return {
      id: item.id,
      name: f.name ?? '',
      price: parsePrice(f.prijs),
      image: f.img?.url ?? null,
      category: f.categorie ?? '', 
      slug: f.slug ?? '',

      uitleg1: f['uitleg-check-1'] ?? '',
      uitleg2: f['uitleg-check-2'] ?? '',
      uitleg3: f['uitleg-check-3'] ?? '',
    };
  });
}


export async function getNews() {
  const items = await fetchCollection(COLLECTIONS.news);
  return items.map((item) => {
    const f = item.fieldData ?? {};
    return {
      id: item.id,
      title: f.name ?? '',
      intro: f.intro ?? '',
      content: f.tekst ?? '',
      date: f.datum ?? '',
      image: f.img?.url ?? null,
      category: f.categorie ?? '',
      slug: f.slug ?? '',
    };
  });
}


export async function getCampuses() {
  const items = await fetchCollection(COLLECTIONS.campuses);
  return items.map((item) => {
    const f = item.fieldData ?? {};
    const slug = f.slug ?? '';
    const richting = slug
      .split('-')
      .join(' ')
      .replace(/^./, (c) => c.toUpperCase());
    return {
      id: item.id,
      name: f.name ?? '',
      color: f.kleur ?? null,
      text: f.tekst ?? '',
      image: f.img?.url ?? null,
      richting: richting,
      address: f.adres ?? '',
      tel: f.tel ?? '',
      email: f.email ?? '',
      openingsuren: f.openingsuren ?? '',
      category: richting, 
      slug: slug,
    };
  });
}