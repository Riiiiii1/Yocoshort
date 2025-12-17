'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (isRegistering && password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setIsLoading(true);

        try {
            const endpoint = isRegistering ? '/register' : '/login';
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    ...(isRegistering && {
                        name: email.split('@')[0],
                        password_confirmation: confirmPassword
                    }),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Ocurrió un error en el servidor');
                setIsLoading(false);
                return;
            }

            if (isRegistering) {
                setNeedsVerification(true);
                setIsLoading(false);
                return;
            }
            if (data.data?.access_token) {
                localStorage.setItem('api_token', data.data.access_token);
                if (data.data.redirect_to) {
                    window.location.href = data.data.redirect_to;
                } else if (data.redirect_to) {
                    window.location.href = data.redirect_to;
                } else {
                    window.location.href = '/dashboard';
                }
            } else if (data.access_token) {
                localStorage.setItem('api_token', data.access_token);
                if (data.redirect_to) {
                    window.location.href = data.redirect_to;
                } else {
                    window.location.href = '/dashboard';
                }
            } else {
                setError('No se recibió un token de autenticación');
                setIsLoading(false);
            }

        } catch (err) {
            setError('Error de conexión. Asegúrate que tu servidor local esté corriendo.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect-web`;
    };

    const handleResendEmail = () => {
        alert("Solicitud de reenvío enviada (Necesitas crear este endpoint en Laravel)");
    };

    const handleChangeEmail = () => {
        setNeedsVerification(false);
        setPassword('');
        setConfirmPassword('');
    };

    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setPassword('');
        setConfirmPassword('');
    };

    if (needsVerification) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8 relative">
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 rounded-full text-white border border-white/50 hover:border-white hover:bg-white/10 transition-all text-sm md:text-base flex items-center gap-2"
                    >
                        ← Volver
                    </button>
                </div>

                <div className="bg-white/95 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-8 md:p-10 w-[90%] max-w-[400px] mx-auto animate-[fadeIn_0.5s_ease-out] text-center">
                    <div className="text-5xl mb-4">✉️</div>

                    <h2 className="text-3xl font-extrabold text-[#155dfc] mb-2 text-center tracking-tight">
                        ¡Verifica tu Correo Electrónico!
                    </h2>

                    <p className="text-base text-gray-600 mb-8 text-center">
                        Hemos enviado un enlace de confirmación a: <br />
                        <strong className="text-[#155dfc]">{email}</strong>
                    </p>

                    <div className="flex flex-col gap-2.5 w-full">
                        <button
                            onClick={handleResendEmail}
                            className="mt-4 bg-[#155dfc] text-white border-none py-3.5 px-6 rounded-2xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(21,93,252,0.2)] active:scale-95"
                        >
                            Reenviar correo
                        </button>

                        <button
                            onClick={handleChangeEmail}
                            className="bg-none border-none text-[#155dfc] font-semibold cursor-pointer p-0 text-sm underline hover:text-[#004ecc] hover:no-underline transition-colors duration-200 mt-2.5"
                        >
                            ¿Te equivocaste? Cambiar email
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#155dfc] to-[#c4d5ff] flex flex-col items-center justify-center p-3 md:p-8 relative">
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-50">
                <button
                    onClick={() => router.push('/')}
                    className="px-4 py-2 rounded-full text-white border border-white/50 hover:border-white hover:bg-white/10 transition-all text-sm md:text-base flex items-center gap-2"
                >
                    ← Volver
                </button>
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
                {isRegistering ? 'Únete a Yocoshort hoy' : 'Bienvenido de nuevo'}
            </p>

            <div className="bg-white/95 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-6 md:p-8 w-[90%] max-w-[400px] mx-auto animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-3xl font-extrabold text-[#155dfc] mb-2 text-center tracking-tight">
                    {isRegistering ? 'Crear cuenta' : 'Entrar a tu cuenta'}
                </h2>
                <p className="text-base text-gray-600 mb-6 text-center">
                    {isRegistering ? 'Comienza a acortar tus enlaces' : 'Accede a tu panel de control'}
                </p>

                {error && (
                    <div className="text-red-600 mb-4 text-sm bg-red-50 p-3 rounded-lg w-full text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="py-3.5 px-5 rounded-2xl border-2 border-[#eef2ff] bg-[#f8fafc] text-base text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,93,252,0.1)]"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-2">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="py-3.5 px-5 rounded-2xl border-2 border-[#eef2ff] bg-[#f8fafc] text-base text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,93,252,0.1)]"
                            required
                            minLength={6}
                        />
                    </div>

                    {isRegistering && (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 ml-2">
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="py-3.5 px-5 rounded-2xl border-2 border-[#eef2ff] bg-[#f8fafc] text-base text-gray-800 transition-all duration-200 outline-none focus:border-[#155dfc] focus:bg-white focus:shadow-[0_0_0_4px_rgba(21,93,252,0.1)]"
                                required={isRegistering}
                                minLength={6}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-2 bg-[#155dfc] text-white border-none py-3.5 px-6 rounded-2xl font-bold text-base cursor-pointer transition-all duration-200 hover:bg-[#004ecc] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(21,93,252,0.2)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none active:scale-95"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Procesando...' : (isRegistering ? 'Registrarse' : 'Entrar')}
                    </button>
                </form>

                {!isRegistering && (
                    <>
                        <div className="flex items-center my-6 w-full text-gray-500 text-sm before:content-[''] before:flex-1 before:border-b before:border-gray-300 before:mr-4 after:content-[''] after:flex-1 after:border-b after:border-gray-300 after:ml-4">
                            o continúa con
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center gap-2.5 bg-white text-gray-800 border border-gray-300 py-3 px-4 rounded-2xl font-semibold text-base cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:translate-y-[-1px] w-full active:scale-95"
                            type="button"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </>
                )}

                <p className="mt-6 text-sm text-gray-600 text-center">
                    {isRegistering ? '¿Tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                    <button
                        onClick={toggleAuthMode}
                        className="bg-none border-none text-[#155dfc] font-semibold cursor-pointer p-0 text-sm underline hover:text-[#004ecc] hover:no-underline transition-colors duration-200"
                    >
                        {isRegistering ? 'Logueate!' : 'Crea una aquí'}
                    </button>
                </p>
            </div>
        </main>
    );
}