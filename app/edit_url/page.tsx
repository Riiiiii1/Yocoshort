'use client';
import { useState } from 'react';

export default function EditUrl({ link, onClose, onUpdate, onDelete }) {
    const [newAlias, setNewAlias] = useState(link.short_code);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const token = localStorage.getItem('api_token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links/${link.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ short_code: newAlias })
            });

            const data = await res.json();
            if (res.ok) {
                onUpdate(data.data);
                onClose();
            } else {
                alert(data.message || 'Error al actualizar');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Seguro que quieres eliminar este enlace? Esta acción no se puede deshacer.')) return;

        setLoading(true);
        const token = localStorage.getItem('api_token');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links/${link.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                onDelete(link.id);
                onClose();
            } else {
                alert('No se pudo eliminar');
            }
        } catch (error) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4">
            <div className="bg-white/95 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-6 w-full max-w-[400px] animate-[fadeIn_0.3s_ease-out]">
                <h3 className="text-xl font-bold text-[#155dfc] mb-2">Editar Enlace</h3>
                <p className="text-sm text-gray-600 mb-4 break-all">
                    {link.original_url}
                </p>

                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nuevo Alias (Slug)</label>
                    <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#155dfc] focus-within:shadow-[0_0_0_3px_rgba(21,93,252,0.1)] transition-all duration-200">
                        <span className="text-gray-500 font-medium">/</span>
                        <input
                            type="text"
                            value={newAlias}
                            onChange={(e) => setNewAlias(e.target.value)}
                            className="flex-1 border-none outline-none ml-2 text-gray-800"
                        />
                    </div>
                </div>

                <div className="flex gap-3 justify-end mb-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-[#155dfc] text-white font-bold rounded-xl hover:bg-[#004ecc] hover:translate-y-[-1px] hover:shadow-[0_4px_12px_rgba(21,93,252,0.2)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleDelete}
                        className="w-full px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 hover:border-red-300 hover:translate-y-[-1px] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        🗑️ Eliminar Enlace Permanentemente
                    </button>
                </div>
            </div>
        </div>
    );
}