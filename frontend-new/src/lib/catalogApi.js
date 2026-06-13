import { fallbackCatalog } from '../data/catalog';

const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const isLocalBrowser =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_URL = configuredApiUrl || (isLocalBrowser ? 'http://localhost:5000/api/arts' : '');

function normalizeProduct(product) {
  return {
    ...product,
    id: Number(product.id),
    price: Number(product.price),
    special_edition: Boolean(product.special_edition),
  };
}

function filterFallback(filters = {}) {
  return fallbackCatalog.filter((product) =>
    Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'special_edition') return product.special_edition === (value === 'true');
      return product[key] === value;
    })
  );
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch arts: ${response.status}`);
  return response.json();
}

export async function getArts(filters = {}) {
  if (!API_URL) return filterFallback(filters).map(normalizeProduct);

  try {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const json = await fetchJson(`${API_URL}?${query.toString()}`);
    return json.data.map(normalizeProduct);
  } catch (error) {
    console.warn('Using fallback catalogue:', error);
    return filterFallback(filters).map(normalizeProduct);
  }
}

export async function getArtById(id) {
  if (!API_URL) {
    return fallbackCatalog.find((product) => String(product.id) === String(id)) || null;
  }

  try {
    const json = await fetchJson(`${API_URL}/${id}`);
    return normalizeProduct(json.data);
  } catch (error) {
    console.warn('Using fallback product:', error);
    return fallbackCatalog.find((product) => String(product.id) === String(id)) || null;
  }
}
