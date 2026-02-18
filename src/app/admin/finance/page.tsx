"use client";

import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

// Mock data
const data = [
    { name: 'Lun', ingresos: 120000, gastos: 45000 },
    { name: 'Mar', ingresos: 145000, gastos: 38000 },
    { name: 'Mié', ingresos: 98000, gastos: 52000 },
    { name: 'Jue', ingresos: 165000, gastos: 41000 },
    { name: 'Vie', ingresos: 210000, gastos: 60000 },
    { name: 'Sáb', ingresos: 280000, gastos: 75000 },
    { name: 'Dom', ingresos: 0, gastos: 12000 },
];

const serviceData = [
    { name: 'Corte Clásico', value: 45, color: '#bf9b30' },
    { name: 'Barba & Ritual', value: 25, color: '#a38222' },
    { name: 'Combos', value: 20, color: '#dcfce7' },
    { name: 'Productos', value: 10, color: '#ffffff' },
];

const movements = [
    { id: 1, type: "ingreso", concept: "Corte + Barba - Juan Pérez", amount: 18000, date: "Hoy, 10:30" },
    { id: 2, type: "gasto", concept: "Reposición Ceras", amount: 45000, date: "Hoy, 09:15" },
    { id: 3, type: "ingreso", concept: "Corte Clásico - Miguel García", amount: 12000, date: "Ayer, 19:45" },
    { id: 4, type: "ingreso", concept: "Venta Producto", amount: 8500, date: "Ayer, 18:20" },
];

export default function FinancePage() {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-foreground">Finanzas</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Ingresos Mes</p>
                            <h3 className="text-3xl font-bold mt-2">$3.450.000</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                        <TrendingUp size={16} />
                        <span>+12.5% vs mes anterior</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Gastos Operativos</p>
                            <h3 className="text-3xl font-bold mt-2">$850.000</h3>
                        </div>
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-500 font-medium">
                        <TrendingDown size={16} />
                        <span>+5.2% vs mes anterior</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Rentabilidad Neta</p>
                            <h3 className="text-3xl font-bold mt-2 text-primary">$2.600.000</h3>
                        </div>
                        <div className="p-3 bg-primary/20 rounded-full text-primary">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground relative z-10">
                        <span>Margen Neto: 75.3%</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-6">Balance Semanal</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#bf9b30" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#bf9b30" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                                <YAxis stroke="#888" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ededed' }}
                                />
                                <Area type="monotone" dataKey="ingresos" stroke="#bf9b30" strokeWidth={2} fillOpacity={1} fill="url(#colorIngresos)" />
                                <Area type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} fillOpacity={0} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Chart / List */}
                <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
                    <h3 className="text-lg font-bold mb-6">Ingresos por Categoría</h3>
                    <div className="h-[200px] w-full mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-auto border-t border-border pt-6">
                        <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Movimientos Recientes</h4>
                        <div className="space-y-4">
                            {movements.map((mov) => (
                                <div key={mov.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${mov.type === 'ingreso' ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <div className="flex flex-col">
                                            <span className="font-medium">{mov.concept}</span>
                                            <span className="text-xs text-muted-foreground">{mov.date}</span>
                                        </div>
                                    </div>
                                    <span className={`font-mono font-medium ${mov.type === 'ingreso' ? 'text-green-500' : 'text-red-500'}`}>
                                        {mov.type === 'ingreso' ? '+' : '-'}${mov.amount.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
