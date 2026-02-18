"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Scissors, Calendar, User, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceSelection from "@/components/booking/ServiceSelection";
import BarberSelection from "@/components/booking/BarberSelection";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import BookingSummary, { CustomerData } from "@/components/booking/BookingSummary"; // Updated import
import BookingSuccess from "@/components/booking/BookingSuccess"; // Updated import
import { Service, Member, Appointment } from "@/lib/types";
import { subscribeToServices } from "@/lib/db/services";
import { subscribeToStaff } from "@/lib/db/staff";
import { createAppointment } from "@/lib/db/appointments";
import { Timestamp } from "firebase/firestore"; // Import Timestamp if needed for manual conversion, but createAppointment expects Date

// Definimos los pasos del wizard
type BookingStep = "service" | "staff" | "datetime" | "summary" | "success";

export default function BookingPage() {
    const [currentStep, setCurrentStep] = useState<BookingStep>("service");

    // Data state
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado para la reserva
    const [bookingData, setBookingData] = useState({
        serviceId: null as string | null,
        staffId: null as string | null,
        date: null as Date | null,
        time: null as string | null,
    });

    // Fetch data
    useEffect(() => {
        const unsubscribeServices = subscribeToServices((data) => {
            setServices(data.filter(s => s.active));
        });

        const unsubscribeStaff = subscribeToStaff((data) => {
            setStaff(data.filter(s => s.active));
            setLoading(false);
        });

        return () => {
            unsubscribeServices();
            unsubscribeStaff();
        };
    }, []);

    const steps = [
        { id: "service", label: "Servicio", icon: Scissors },
        { id: "staff", label: "Profesional", icon: User },
        { id: "datetime", label: "Fecha y Hora", icon: Calendar },
        { id: "summary", label: "Confirmar", icon: Check },
    ];

    // Función para avanzar
    const nextStep = () => {
        if (currentStep === "service" && bookingData.serviceId) setCurrentStep("staff");
        else if (currentStep === "staff" && bookingData.staffId) setCurrentStep("datetime");
        else if (currentStep === "datetime" && bookingData.date && bookingData.time) setCurrentStep("summary");
    };

    // Handlers
    const handleServiceSelect = (serviceId: string) => {
        setBookingData(prev => ({ ...prev, serviceId }));
    };

    const handleStaffSelect = (staffId: string) => {
        setBookingData(prev => ({ ...prev, staffId }));
    };

    const handleDateSelect = (date: Date) => {
        setBookingData(prev => ({ ...prev, date, time: null })); // Reset time when date changes
    };

    const handleTimeSelect = (time: string) => {
        setBookingData(prev => ({ ...prev, time }));
    };

    const getSelectedServiceDuration = () => {
        const service = services.find(s => s.id === bookingData.serviceId);
        return service ? service.duration : 30; // Default 30 min
    };

    const handleConfirmBooking = async (customerData: CustomerData) => {
        if (!bookingData.serviceId || !bookingData.staffId || !bookingData.date || !bookingData.time) return;

        try {
            // Combine date and time into a single Date object
            const [hours, minutes] = bookingData.time.split(':').map(Number);
            const appointmentDate = new Date(bookingData.date);
            appointmentDate.setHours(hours, minutes, 0, 0);

            const newAppointment: Omit<Appointment, "id"> = {
                clientId: "guest", // Or generate/fetch if using auth
                clientName: customerData.name,
                serviceId: bookingData.serviceId,
                barberId: bookingData.staffId,
                date: appointmentDate,
                duration: getSelectedServiceDuration(),
                status: "pending",
                // You might want to save phone/email/notes too.
                // Currently Appointment type doesn't have them, consider adding them to 'notes' or expanding type
                // For now, let's append to a notes field or similar if the type allows, or just log it.
                // Assuming Appointment type might need update, but for now we follow existing type:
                // Let's assume we can put contact info in clientName for now or just trust the admin sees it?
                // Ideally we update the type. For this task I'll stick to the interface provided.
                // Wait, I should probably update the type if I want to save phone/email.
                // Checking types.ts... it has Appointment.
                // Let's create it as is.
            };

            // If we want to save extra data (phone, email, notes) we need to update the Appointment type or save it elsewhere.
            // For this implementation, I will save them in valid fields or a separate collection if strictly following type,
            // BUT usually we want these in the appointment.
            // I'll cheat slightly and cast it to any to save the extra fields if Firestore allows it (it does),
            // OR I will assume the user defined Appointment type might be loose or I can request a type update.
            // Let's check types.ts again. It has clientName.
            // I'll modify the type to include phone/email/notes in next step if needed,
            // for now I will pass them and if Typescript complains I'll cast.

            const appointmentToSave = {
                ...newAppointment,
                clientPhone: customerData.phone,
                clientEmail: customerData.email,
                notes: customerData.notes
            };

            await createAppointment(appointmentToSave);

            setCurrentStep("success");
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("Hubo un error al crear la reserva. Por favor intenta nuevamente.");
        }
    };

    // Render Success Screen
    if (currentStep === "success" && bookingData.date && bookingData.time) {
        return (
            <main className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
                <Navbar />
                <div className="pt-32 pb-20 px-4 container mx-auto max-w-6xl min-h-[80vh] flex items-center justify-center">
                    <BookingSuccess date={bookingData.date} time={bookingData.time} />
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-primary/30">
            <Navbar />

            <div className="pt-32 pb-20 px-4 container mx-auto max-w-6xl min-h-[80vh]">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
                        Reserva tu <span className="text-primary">Turno</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Selecciona el servicio, tu barbero de confianza y el horario que mejor te quede.
                    </p>
                </div>

                {/* Progress Bar (Desktop & Mobile) */}
                <div className="mb-12 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center relative">
                        {/* Linea de fondo */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10" />

                        {/* Pasos */}
                        {steps.map((step, index) => {
                            const isActive = step.id === currentStep;
                            const stepIndex = steps.findIndex(s => s.id === step.id);
                            const currentStepIndex = steps.findIndex(s => s.id === currentStep);
                            const isCompleted = currentStepIndex > stepIndex;
                            const Icon = step.icon;

                            return (
                                <div key={step.id} className="flex flex-col items-center bg-black px-2 md:px-4">
                                    <div
                                        className={cn(
                                            "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2",
                                            isActive || isCompleted
                                                ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(242,185,13,0.3)]"
                                                : "border-zinc-700 bg-zinc-900 text-gray-500"
                                        )}
                                    >
                                        <Icon size={18} className={cn(isActive || isCompleted ? "stroke-[2.5]" : "stroke-[1.5]")} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300",
                                        isActive || isCompleted ? "text-primary" : "text-gray-600"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-10 min-h-[400px]">
                    {currentStep === "service" && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif text-white mb-2">Selecciona un Servicio</h2>
                                <p className="text-gray-400 text-sm">Elige el tratamiento que deseas realizarte hoy.</p>
                            </div>
                            <ServiceSelection
                                services={services}
                                selectedServiceId={bookingData.serviceId}
                                onSelect={handleServiceSelect}
                                onNext={nextStep}
                            />
                        </>
                    )}

                    {currentStep === "staff" && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif text-white mb-2">Selecciona un Profesional</h2>
                                <p className="text-gray-400 text-sm">Elige a tu barbero de preferencia.</p>
                            </div>
                            <BarberSelection
                                staff={staff}
                                selectedStaffId={bookingData.staffId}
                                onSelect={handleStaffSelect}
                                onNext={nextStep}
                                onBack={() => setCurrentStep("service")}
                            />
                        </>
                    )}

                    {currentStep === "datetime" && bookingData.staffId && (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-serif text-white mb-2">Elige Fecha y Hora</h2>
                                <p className="text-gray-400 text-sm">Selecciona el día y horario que más te convenga.</p>
                            </div>
                            <TimeSlotPicker
                                selectedDate={bookingData.date}
                                selectedTime={bookingData.time}
                                onSelectDate={handleDateSelect}
                                onSelectTime={handleTimeSelect}
                                onNext={nextStep}
                                onBack={() => setCurrentStep("staff")}
                                barberId={bookingData.staffId}
                                serviceDuration={getSelectedServiceDuration()}
                            />
                        </>
                    )}

                    {currentStep === "summary" && bookingData.serviceId && bookingData.staffId && bookingData.date && bookingData.time && (
                        <BookingSummary
                            service={services.find(s => s.id === bookingData.serviceId)}
                            barber={staff.find(s => s.id === bookingData.staffId)}
                            date={bookingData.date}
                            time={bookingData.time}
                            onBack={() => setCurrentStep("datetime")}
                            onConfirm={handleConfirmBooking}
                        />
                    )}
                </div>

            </div>
            <Footer />
        </main>
    );
}
