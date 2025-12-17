'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/long-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ long_url: inputUrl }),
      });

      if (!response.ok) throw new Error('Falló la petición');
      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (error) {
      setError('Ocurrió un error al generar el enlace.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8 relative">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <button
          onClick={() => router.push('/login')}
          className="hidden md:block px-5 py-2.5 rounded-full text-white border border-white/50 hover:border-white hover:bg-white/10 transition-all text-base"
        >
          Inicia tu Sesión
        </button>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 focus:outline-none"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden animate-fadeIn md:hidden origin-top-right">
            <button
              onClick={() => router.push('/login')}
              className="block w-full text-left px-4 py-3 text-[#155dfc] font-medium hover:bg-gray-50 transition-colors"
            >
              Inicia tu Sesión
            </button>
          </div>
        )}
      </div>

      <div className="mb-4 text-white opacity-90">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 md:w-16 md:h-16">
          <path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z" />
          <path d="M17.5 19c0-1.7-1.3-3-3-3" />
          <path d="M11.5 16a6.5 6.5 0 0 1-5.5-9.8" />
          <path d="M12.5 16a5.5 5.5 0 0 0 9-4.8" />
        </svg>
      </div>

      <h1 className="text-3xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight text-center px-2">
        Yocoshort
      </h1>

      <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 lg:mb-12 max-w-xs md:max-w-2xl text-center px-4 leading-relaxed">
        Convierte tus enlaces en yocolinks, ¡enlaces cortos que puedes compartir con tu comunidad!
      </p>

      {/* --- pa el movil --- */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl px-2 sm:px-4">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-0">
          <div className="md:hidden">
            <input
              type="url"
              required
              placeholder="https://www.google.com"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full border-none py-3 px-5 text-base rounded-full outline-none bg-white text-gray-800 placeholder:text-gray-400 shadow-lg"
            />
          </div>
          <div className="hidden md:block">
            <div className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all focus-within:shadow-2xl focus-within:-translate-y-0.5">
              <div className="flex gap-3">
                <input
                  type="url"
                  required
                  placeholder="https://www.google.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 border-none py-3 md:py-4 px-5 md:px-6 text-base md:text-lg rounded-full outline-none bg-transparent text-gray-800 w-full placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={loading || !inputUrl}
                  className="bg-[#155dfc] text-white py-3 md:py-4 px-6 md:px-8 rounded-full font-bold text-base md:text-lg hover:bg-[#004ecc] disabled:opacity-70 disabled:cursor-not-allowed transition-all min-w-[120px] md:min-w-[140px] whitespace-nowrap"
                >
                  {loading ? '...' : 'Convertir'}
                </button>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              type="submit"
              disabled={loading || !inputUrl}
              className="w-full bg-[#155dfc] text-white py-3 px-6 rounded-full font-bold text-base hover:bg-[#004ecc] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
            >
              {loading ? 'Procesando...' : 'Convertir enlace'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <p className="mt-4 text-red-100 bg-red-400/20 px-4 py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base max-w-sm md:max-w-md">
          {error}
        </p>
      )}

      {shortUrl && (
        <div className="mt-6 md:mt-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl px-2 sm:px-4 animate-fadeIn">
          <div className="bg-white/95 rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#155dfc] font-bold text-sm sm:text-base md:text-lg hover:underline truncate w-full text-center sm:text-left"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-semibold transition-all w-full sm:w-auto text-sm sm:text-base ${copied
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-blue-50 text-[#155dfc] border border-blue-200 hover:bg-blue-100'
                }`}
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 md:mt-12 lg:mt-16 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl px-2 sm:px-4 md:px-0">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg text-left">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <span>💡</span> Personaliza tu subdominio
          </h3>
          <p className="text-gray-700 mb-4 leading-relaxed text-xs sm:text-sm md:text-base">
            ¡Ingresa a tu cuenta para personalizar tu propio subdominio gratuito!
            Crea enlaces cortos personalizados como <strong className="text-blue-800">tunegocio.yocoshort.com </strong>
            que reflejen tu marca y sean más fáciles de recordar.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 rounded">
            <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
              ⚠️ <strong className="text-amber-700">Importante:</strong> Las URL creadas sin registrar una cuenta caducan automáticamente en 3 días.
              Regístrate para mantener tus enlaces activos permanentemente y acceder a estadísticas detalladas.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}