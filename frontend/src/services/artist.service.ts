import { Artist } from '../types/artist';

/**
 * API base URL
 * - Lấy từ Vite env
 * - Ví dụ: http://localhost:3000
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getArtistBySlug(
  slug: string
): Promise<Artist> {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not defined');
  }

  const res = await fetch(`${API_BASE_URL}/artist/${slug}`);

  if (!res.ok) {
    throw new Error('Artist not found');
  }

  return res.json();
}

//......................................................................


import { ArtistUpdatePayload } from '../types/artist';

export async function updateArtistBySlug(
  slug: string,
  payload: ArtistUpdatePayload
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/artist/${slug}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
}
