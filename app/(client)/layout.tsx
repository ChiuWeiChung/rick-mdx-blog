// import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function ClientLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Navbar />
			{children}
			<Footer />
		</>
	);
}
