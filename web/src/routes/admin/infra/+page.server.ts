import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Infrastructure page removed - redirect to media
  throw redirect(302, '/admin/media');
};
