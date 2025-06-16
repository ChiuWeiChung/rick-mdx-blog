'use server';
// import { auth } from '@/auth';

export const createPostAction = async (request: unknown) => {
	console.log(request);
	// how to validate the user is logged in?
	// const session = await auth();
	// if (!session) {
	// 	throw new Error('Unauthorized');
	// }

	// const title = formData.get('title');
	// const content = formData.get('content');

	// console.log(title, content);
};
