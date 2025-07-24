const Footer = () => {
	return (
		<footer className="absolute bottom-0 left-0 w-full text-md mt-auto py-6 text-center text-gray-500 shadow-2xl bg-accent dark:text-gray-400">
			<p>© {new Date().getFullYear()} Rick&apos;s DevNotes. All rights reserved.</p>
		</footer>
	);
};

export default Footer;
