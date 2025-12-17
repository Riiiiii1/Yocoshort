"use client";
import Metrics from '../metrics/page';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditUrl from '../edit_url/page';

export default function Dashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const BASE_DOMAIN = "yocoshort.com";
    const router = useRouter();
    const [editingLink, setEditingLink] = useState(null);
    const [user, setUser] = useState(null);
    const [myDomain, setMyDomain] = useState(null);
    const [links, setLinks] = useState([]);
    const [urlInput, setUrlInput] = useState('');
    const [aliasInput, setAliasInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [viewingMetrics, setViewingMetrics] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
            localStorage.setItem('api_token', urlToken);
            window.history.replaceState({}, document.title, "/dashboard");
        }
        const token = localStorage.getItem('api_token') || urlToken;

        if (!token) {
            router.push('/');
            return;
        }

        const loadDashboardData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                };
                const userRes = await fetch(`${API_URL}/user`, { headers });
                if (!userRes.ok) throw new Error('Token expirado');
                const userData = await userRes.json();
                setUser(userData);

                const domainRes = await fetch(`${API_URL}/domain`, { headers });
                if (domainRes.ok) {
                    const domainData = await domainRes.json();
                    // Lógica dinámica para el dominio según el entorno
                    const domainSuffix = process.env.NODE_ENV === 'production' ? BASE_DOMAIN : 'local.yocoshort.com';
                    setMyDomain(`${domainData.subdomain}.${domainSuffix}`);
                }

                const linksRes = await fetch(`${API_URL}/links`, { headers });
                if (linksRes.ok) {
                    const linksData = await linksRes.json();
                    setLinks(linksData.data || []);
                }

            } catch (error) {
                console.error("Error cargando dashboard:", error);
                localStorage.removeItem('api_token');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [router]);

    const handleShorten = async () => {
        if (!urlInput) return alert("Escribe una URL");
        if (!myDomain) return alert("Primero configura tu dominio en Configuración");

        setCreating(true);
        const token = localStorage.getItem('api_token');

        try {
            const res = await fetch(`${API_URL}/links`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    original_url: urlInput,
                    custom_alias: aliasInput || null
                })
            });
            const data = await res.json();
            if (res.ok) {
                setLinks([data.data, ...links]);
                setUrlInput('');
                setAliasInput('');
                alert(`¡Link creado! ${data.short_url}`);
            } else {
                alert(data.message || "Error al crear link");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCreating(false);
        }
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleLogout = () => {
        localStorage.removeItem('api_token');
        router.push('/');
    };

    const onUpdateSuccess = (updatedLink) => {
        const updatedList = links.map(l => l.id === updatedLink.id ? updatedLink : l);
        setLinks(updatedList);
    };

    const onDeleteSuccess = (deletedId) => {
        const filteredList = links.filter(l => l.id !== deletedId);
        setLinks(filteredList);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8">
                <div className="text-white text-xl">Cargando tu espacio...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8 relative">
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
                Panel de Control - Gestiona tus enlaces cortos
            </p>
            <div className="bg-white/95 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 md:p-8 w-[90%] max-w-[1000px] mx-auto flex flex-col gap-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#155dfc]">Hola, {user?.name} 👋</h1>
                        <p className="text-gray-600 mt-1">
                            Tu espacio: <strong className="text-[#155dfc]">{myDomain || 'Sin configurar'}</strong>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSettings}
                            className="flex items-center gap-2 bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 rounded-xl font-semibold hover:bg-gray-200 hover:translate-y-[-2px] transition-all duration-200"
                        >
                            <span>⚙️</span> Configuración
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500 text-white border border-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-600 hover:translate-y-[-2px] transition-all duration-200"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </header>
                <section className="bg-blue-50/80 p-4 md:p-6 rounded-2xl border border-blue-200/50 border-dashed">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">URL Original</label>
                            <input
                                type="url"
                                placeholder="https://ejemplo.com/articulo-muy-largo"
                                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:shadow-[0_0_0_3px_rgba(21,93,252,0.1)]"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Dominio</label>
                            <select
                                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-800 bg-white cursor-not-allowed opacity-70"
                                disabled
                            >
                                <option>{myDomain || 'Configura tu dominio →'}</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Alias (Opcional)</label>
                            <input
                                type="text"
                                placeholder="oferta-verano"
                                className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:shadow-[0_0_0_3px_rgba(21,93,252,0.1)]"
                                value={aliasInput}
                                onChange={(e) => setAliasInput(e.target.value)}
                            />
                        </div>

                        <div>
                            <button
                                className="bg-[#155dfc] text-white border-none py-3.5 px-8 rounded-2xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap min-w-[120px]"
                                onClick={handleShorten}
                                disabled={creating}
                            >
                                {creating ? 'Creando...' : 'Acortar ✨'}
                            </button>
                        </div>
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tus Enlaces Recientes</h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">URL Corta</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">URL Original</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Clicks</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.length > 0 ? links.map((link) => (
                                    <tr key={link.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <a
                                                href={`http://${myDomain}/${link.short_code}`}
                                                target="_blank"
                                                className="text-[#155dfc] font-semibold hover:underline truncate block max-w-[200px]"
                                                rel="noreferrer"
                                            >
                                                {myDomain}/{link.short_code}
                                            </a>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 max-w-[300px] truncate" title={link.original_url}>
                                            {link.original_url}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                                                🔥 {link.clicks}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    onClick={() => navigator.clipboard.writeText(`http://${myDomain}/${link.short_code}`)}
                                                    title="Copiar"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                    title="Editar / Borrar"
                                                    onClick={() => setEditingLink(link)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                    title="Ver métricas"
                                                    onClick={() => setViewingMetrics(link)}
                                                >
                                                    📊
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 px-4 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="text-4xl mb-2">🔗</div>
                                                <p className="text-lg">Aún no tienes enlaces cortos</p>
                                                <p className="text-sm mt-1">¡Crea tu primer enlace usando el formulario de arriba!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            {editingLink && (
                <EditUrl
                    link={editingLink}
                    onClose={() => setEditingLink(null)}
                    onUpdate={onUpdateSuccess}
                    onDelete={onDeleteSuccess}
                />
            )}
            {viewingMetrics && (
                <Metrics
                    link={viewingMetrics}
                    onClose={() => setViewingMetrics(null)}
                    myDomain={myDomain}
                />
            )}
        </main>
    );
}