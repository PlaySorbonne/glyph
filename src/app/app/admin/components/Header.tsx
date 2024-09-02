import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-gray-800 text-white py-4">
      <nav className="container mx-auto px-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/app/admin" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/app/admin/quest/all" className="hover:text-gray-300">
              Quests
            </Link>
          </li>
          <li>
            <Link href="/app/admin/user/all" className="hover:text-gray-300">
              Users
            </Link>
          </li>
          <li>
            <Link href="/app/admin/code/all" className="hover:text-gray-300">
              Codes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
