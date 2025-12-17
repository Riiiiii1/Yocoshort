'use client';
import { useState, useEffect } from 'react';

export default function Metrics({ link, onClose, myDomain }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            const token = localStorage.getItem('api_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links/${link.id}/metrics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setData(await res.json());
            setLoading(false);
        };
        fetchMetrics();
    }, [link.id]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
            <div className="bg-white/95 rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-[#155dfc]">Métricas de /{link.short_code}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl hover:scale-110 transition-transform duration-200"
                    >
                        &times;
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#155dfc] mb-4"></div>
                        <p className="text-gray-600 font-medium">Analizando registros...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-200 shadow-sm">
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Total de Clicks</p>
                            <p className="text-5xl font-black text-[#155dfc]">{data.total_clicks}</p>
                            <p className="text-sm text-gray-500 mt-2">Accesos totales al enlace</p>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>🌐</span> Navegadores
                            </h4>
                            <div className="space-y-3">
                                {data.browsers.map(b => (
                                    <div key={b.browser} className="flex justify-between items-center bg-white/80 p-3 rounded-xl border border-gray-100">
                                        <span className="font-medium text-gray-700">{b.browser || 'Desconocido'}</span>
                                        <span className="bg-blue-100 text-[#155dfc] font-bold px-3 py-1 rounded-full text-sm">
                                            {b.total} clicks
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 rounded-2xl border border-gray-200 shadow-sm col-span-1 md:col-span-2">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span>📊</span> Últimos Clicks
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {data.recent.map(c => (
                                    <div key={c.id} className="bg-white/80 p-4 rounded-xl border border-gray-100 hover:bg-white transition-colors duration-200">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-gray-100 text-gray-700 p-2 rounded-lg">
                                                    {c.platform === 'Mobile' ? '📱' : '💻'}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-gray-800">{c.ip_address}</p>
                                                    <p className="text-sm text-gray-500">{c.platform}</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                {new Date(c.clicked_at).toLocaleString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="w-full mt-8 bg-gray-100 text-gray-800 border-none py-3.5 px-6 rounded-2xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-gray-200 hover:translate-y-[-2px] active:scale-95"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}