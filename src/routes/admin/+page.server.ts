import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Placeholder for logo data - will be replaced with R2 storage
interface Logo {
	id: string;
	name: string;
	url: string;
	type: 'infra' | 'techstack';
}

// In-memory storage for now - will be replaced with R2
const logos: Logo[] = [];

export const load: PageServerLoad = async () => {
	return {
		logos: [...logos]
	};
};

export const actions: Actions = {
	uploadLogo: async ({ request, platform }) => {
		const formData = await request.formData();
		const file = formData.get('logo') as File | null;
		const type = formData.get('type') as 'infra' | 'techstack';

		if (!file || file.size === 0) {
			return fail(400, { error: 'No file selected' });
		}

		// Validate file type
		const validTypes = ['image/svg+xml', 'image/png'];
		if (!validTypes.includes(file.type)) {
			return fail(400, { error: 'Invalid file type. Only SVG and PNG are allowed.' });
		}

		// Validate file size (1MB max)
		if (file.size > 1024 * 1024) {
			return fail(400, { error: 'File too large. Maximum size is 1MB.' });
		}

		// TODO: Upload to R2
		// For now, just create a placeholder entry
		const id = crypto.randomUUID();
		const name = file.name.replace(/\.(svg|png)$/i, '');

		// In production, this would upload to R2 and return a real URL
		logos.push({
			id,
			name,
			url: `/logos/${name}.${file.type === 'image/svg+xml' ? 'svg' : 'png'}`,
			type
		});

		return { success: true, message: `Logo "${name}" uploaded successfully!` };
	},

	deleteLogo: async ({ request }) => {
		const formData = await request.formData();
		const logoId = formData.get('logoId') as string;

		const index = logos.findIndex((l) => l.id === logoId);
		if (index === -1) {
			return fail(404, { error: 'Logo not found' });
		}

		const logo = logos[index];
		logos.splice(index, 1);

		// TODO: Delete from R2

		return { success: true, message: `Logo "${logo.name}" deleted.` };
	}
};
