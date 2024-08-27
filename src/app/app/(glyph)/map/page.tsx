export default function Map() {
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <svg
          className="w-32 h-32 text-gray-400 mb-4 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 1C8.676 1 6 3.676 6 7v3H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v3H8V7c0-2.276 1.724-4 4-4zm6 8v8H6v-8h12z"/>
        </svg>
        <p className="text-xl text-gray-600">
          Faites au moins une mission principale pour débloquer
        </p>
      </div>
    </div>
  );
}