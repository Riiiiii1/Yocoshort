'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage, setUsersPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchAdminData();
    }, [currentPage, usersPerPage]);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('api_token');
            const res = await fetch(
                `${API_URL}/admin/stats?page=${currentPage}&per_page=${usersPerPage}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (res.status === 403) {
                alert("Acceso denegado: Área restringida");
                router.push('/dashboard');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchAdminData();
            return;
        }

        try {
            const token = localStorage.getItem('api_token');
            const res = await fetch(
                `${API_URL}/admin/users/search?search=${encodeURIComponent(searchTerm)}&per_page=${usersPerPage}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (res.ok) {
                const data = await res.json();
                setStats(prev => ({
                    ...prev,
                    users: data.users,
                    pagination: data.pagination
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8">
                <div className="text-white text-xl">Cargando panel maestro...</div>
            </main>
        );
    }

    if (!stats) return null;

    const { total_users, total_links, users, pagination } = stats;

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
                Panel de Administrador - Vista Maestra
            </p>
            <div className="bg-white/95 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 md:p-8 w-[90%] max-w-[1200px] mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
                            🛡️ Panel de Administrador
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Estadísticas generales del sistema
                        </p>
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Usuarios Totales</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-[#2563eb]">
                                {total_users}
                            </div>
                            <div className="text-4xl">👥</div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">Usuarios registrados en la plataforma</p>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Enlaces Acortados</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl font-bold text-[#16a34a]">
                                {total_links}
                            </div>
                            <div className="text-4xl">🔗</div>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">Enlaces cortos creados en total</p>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar usuarios por nombre o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full py-3 px-4 pl-12 rounded-xl border border-gray-300 text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:shadow-[0_0_0_3px_rgba(21,93,252,0.1)]"
                                />
                                <div className="absolute left-4 top-3.5 text-gray-400">🔍</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={usersPerPage}
                                onChange={(e) => setUsersPerPage(Number(e.target.value))}
                                className="py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-800 outline-none focus:border-[#155dfc]"
                            >
                                <option value="5">5 por página</option>
                                <option value="10">10 por página</option>
                                <option value="20">20 por página</option>
                                <option value="50">50 por página</option>
                            </select>
                            <button
                                onClick={handleSearch}
                                className="bg-[#155dfc] text-white border-none py-3 px-6 rounded-xl font-semibold cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:translate-y-[-2px]"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h3 className="text-xl font-bold text-gray-800">
                            Lista de Usuarios Registrados
                            <span className="text-gray-600 text-sm font-normal ml-2">
                                (Mostrando {pagination?.from || 1} a {pagination?.to || users.length} de {pagination?.total || users.length} usuarios)
                            </span>
                        </h3>
                        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Página {pagination?.current_page || 1} de {pagination?.last_page || 1}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white mb-6">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">ID</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Nombre</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Email</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Fecha de Registro</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-mono">
                                                #{user.id}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800">
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">
                                            {user.email}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(user.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors mr-2"
                                                onClick={() => {
                                                    alert(`Ver detalles del usuario: ${user.name}`);
                                                }}
                                                title="Ver detalles"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                onClick={() => {
                                                    if (confirm(`¿Seguro que quieres eliminar al usuario ${user.name}?`)) {

                                                        alert(`Eliminar usuario: ${user.id}`);
                                                    }
                                                }}
                                                title="Eliminar usuario"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="text-4xl mb-2">👤</div>
                                                <p className="text-lg">No se encontraron usuarios</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Mostrando {pagination.from} a {pagination.to} de {pagination.total} usuarios
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={!pagination.prev_page_url}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                                >
                                    ← Anterior
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.current_page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.current_page >= pagination.last_page - 2) {
                                            pageNum = pagination.last_page - 4 + i;
                                        } else {
                                            pageNum = pagination.current_page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 rounded-lg transition-colors ${pagination.current_page === pageNum
                                                    ? 'bg-[#155dfc] text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={!pagination.next_page_url}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}