"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeads } from "../api/leads";
import { LEAD_STATUS } from "../constants";
import LeadFormModal from "./LeadFormModal";
import { FiEdit } from "react-icons/fi";

interface Lead {
    _id: string;
    name: string;
    email: string;
    status: string;
}

export default function LeadList() {
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // 🔹 Pagination State
    const [page, setPage] = useState(1);
    const limit = 5; // Set limit per page

    // 🔹 Fetch data with pagination
    const { data, isPending, error } = useQuery({
        queryKey: ["leads", selectedStatus, page],
        queryFn: () => fetchLeads({
            status: selectedStatus === "ALL" ? "" : selectedStatus,
            skip: (page - 1) * limit,
            limit
        }),
        staleTime: 1000 * 60 * 5,
    });

    // Handle Pagination
    const totalLeads = data?.totalLeads || 0;
    const totalPages = Math.ceil(totalLeads / limit);

    if (isPending) return <p className="text-center text-gray-500">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border">
            {/* 🔹 Filter Status */}
            <div className="flex flex-wrap justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Leads List</h2>
                <select
                    className="border border-gray-200 p-2 rounded-md"
                    value={selectedStatus}
                    onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setPage(1); 
                    }} 
                >
                    <option value="ALL">All</option>
                    {LEAD_STATUS.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* 🔹 List Leads */}
            <ul className="space-y-4">
                {data?.leads?.length ? (
                    data.leads.map((lead:Lead) => (
                        <li key={lead._id} className="p-4 border rounded-md shadow-sm bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                            <div className="w-full">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-lg text-gray-800">{lead.name}</p>
                                    <p className="rounded-full bg-blue-200 text-gray-700 text-xs p-1 px-4">{lead.status}</p>
                                </div>
                                <p className="text-gray-600">{lead.email}</p>
                            </div>

                            <button
                                onClick={() => setSelectedLead(lead)}
                                className="text-orange-500 sm:hover:text-orange-600 cursor-pointer w-full sm:w-auto bg-orange-100 sm:bg-transparent p-2 sm:p-0 rounded-md sm:rounded-none flex justify-center items-center"
                            >
                                <FiEdit className="inline-block" />
                                <span className="sm:hidden ml-2">Edit</span>
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No leads available.</p>
                )}
            </ul>

            {/* 🔹 Pagination Controls */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                    Previous
                </button>
                <p className="text-gray-700">
                    Page {page} of {totalPages}
                </p>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md ${page === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                    Next
                </button>
            </div>

            {/* 🔹 Modal */}
            <LeadFormModal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                lead={selectedLead}
            />
        </div>
    );
}
