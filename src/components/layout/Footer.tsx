import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-[1336px] mx-auto py-12 px-6">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p>© 2025 P</p>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-gray-900">Help</Link>
            <Link href="/about" className="hover:text-gray-900">About</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
