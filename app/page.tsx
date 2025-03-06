"use client";
import { useState } from "react";
import LeadList from "./components/LeadList";
import LeadFormModal from "./components/LeadFormModal";
import { FaPlus } from "react-icons/fa6";

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-2xl w-full space-y-6 bg-white shadow-lg rounded-2xl p-6">
                <h1 className="text-3xl font-extrabold text-center text-blue-700">Lead Manager</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white w-full py-3 rounded-md font-medium hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
                >
                    <FaPlus /> Add New Lead
                </button>
                <LeadList />
                <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </div>
    );
}
