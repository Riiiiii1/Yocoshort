'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Settings() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [currentDomain, setCurrentDomain] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [domainInput, setDomainInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                };

                const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { headers });
                const userData = await userRes.json();

                if (userRes.ok) {
                    setUser(userData);
                    setNameInput(userData.name);
                }

                const domainRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domain`, { headers });
                if (domainRes.ok) {
                    const domainData = await domainRes.json();
                    setCurrentDomain(domainData.subdomain);
                    setDomainInput(domainData.subdomain);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);
    const apiCall = async (endpoint, method, body = null) => {
        const token = localStorage.getItem('api_token');
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: body ? JSON.stringify(body) : null
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Error en la solicitud');

            return data;

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
            throw error;
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await apiCall('/user', 'PUT', { name: nameInput });
            setMessage({ type: 'success', text: 'Nombre actualizado correctamente' });
            setUser({ ...user, name: nameInput });
        } catch (error) { }
    };

    const handleUpdateDomain = async (e) => {
        e.preventDefault();
        try {
            const data = await apiCall('/domain', 'POST', { subdomain: domainInput });
            setMessage({ type: 'success', text: 'Subdominio configurado correctamente' });
            setCurrentDomain(domainInput);
        } catch (error) { }
    };

    const handleDeleteDomain = async () => {
        if (!confirm('¿Seguro que quieres eliminar tu subdominio? Tus enlaces dejarán de funcionar.')) return;

        try {
            await apiCall('/domain', 'DELETE');
            setCurrentDomain('');
            setDomainInput('');
            setMessage({ type: 'success', text: 'Subdominio eliminado' });
        } catch (error) { }
    };

    const handleDeleteAccount = async () => {
        const confirmText = prompt('Escribe "ELIMINAR" para confirmar el borrado de tu cuenta:');
        if (confirmText !== 'ELIMINAR') return;

        try {
            await apiCall('/user', 'DELETE');
            localStorage.removeItem('api_token');
            router.push('/');
        } catch (error) { }
    };

    const handleLogout = () => {
        localStorage.removeItem('api_token');
        router.push('/');
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8">
                <div className="text-white text-xl">Cargando configuración...</div>
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
                Configuración - Personaliza tu cuenta
            </p>
            <div className="bg-white/95 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-6 md:p-8 w-[90%] max-w-[800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl font-bold text-[#155dfc]">Configuración</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#155dfc] transition-colors duration-200"
                    >
                        ← Volver al Dashboard
                    </button>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 text-center font-medium animate-[slideDown_0.3s_ease-out] ${message.type === 'error'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                        {message.text}
                    </div>
                )}
                <div className="space-y-6">
                    <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">Perfil</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de Usuario</label>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:shadow-[0_0_0_3px_rgba(21,93,252,0.1)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full py-3 px-4 rounded-xl border border-gray-300 text-gray-600 bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-2">El correo no se puede modificar por seguridad.</p>
                            </div>
                            <button
                                type="submit"
                                className="bg-[#155dfc] text-white border-none py-3.5 px-6 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(21,93,252,0.2)]"
                            >
                                Actualizar Perfil
                            </button>
                        </form>
                    </section>
                    <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">Configuración de Marca</h2>
                        <form onSubmit={handleUpdateDomain} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Subdominio Personal</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <div className="flex-1 flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#155dfc] focus-within:shadow-[0_0_0_3px_rgba(21,93,252,0.1)] transition-all duration-200">
                                        <input
                                            type="text"
                                            value={domainInput}
                                            onChange={(e) => setDomainInput(e.target.value)}
                                            className="flex-1 border-none outline-none text-gray-800"
                                            placeholder="mi-marca"
                                        />
                                    </div>
                                    <span className="text-gray-600 font-medium px-3 py-3 text-center sm:text-left">.local.yocoshort.com</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="bg-[#155dfc] text-white border-none py-3.5 px-6 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(21,93,252,0.2)]"
                            >
                                {currentDomain ? 'Cambiar Subdominio' : 'Crear Subdominio'}
                            </button>
                        </form>

                        {currentDomain && (
                            <div className="mt-6 pt-6 border-t border-gray-200 border-dashed">
                                <button
                                    onClick={handleDeleteDomain}
                                    className="text-red-600 hover:text-red-700 text-sm font-semibold underline hover:no-underline transition-colors duration-200"
                                >
                                    Eliminar Subdominio actual
                                </button>
                            </div>
                        )}
                    </section>
                    <section className="bg-gradient-to-br from-red-50/80 to-red-100/50 rounded-2xl p-6 border border-red-200 shadow-sm">
                        <h2 className="text-xl font-bold text-red-700 mb-4">Zona de Peligro</h2>
                        <p className="text-red-600 mb-6">Estas acciones no se pueden deshacer.</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex-1 bg-gray-600 text-white border-none py-3.5 px-6 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:translate-y-[-2px]"
                            >
                                Cerrar Sesión
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 bg-red-500 text-white border-none py-3.5 px-6 rounded-xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-red-600 hover:translate-y-[-2px]"
                            >
                                Eliminar Cuenta
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}