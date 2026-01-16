// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async () => {
  // Infrastructure page removed - redirect to media
  throw redirect(302, '/admin/media');
};
;null as any as PageServerLoad;