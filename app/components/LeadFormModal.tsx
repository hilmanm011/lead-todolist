"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LEAD_STATUS } from "../constants";
import { addLead, updateLead } from "../api/leads";
import Modal from "./Modal";

interface LeadFormProps {
    isOpen: boolean;
    onClose: () => void;
    lead?: { _id: string; name: string; email: string; status: string } | null;
}

export default function LeadFormModal({ isOpen, onClose, lead }: LeadFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!lead;

    const [form, setForm] = useState({ name: "", email: "", status: "New" });

    useEffect(() => {
        if (lead) setForm({ name: lead.name, email: lead.email, status: lead.status });
        else setForm({ name: "", email: "", status: "New" });
    }, [lead]);

    const mutation = useMutation({
        mutationFn: isEditing 
            ? () => updateLead(lead!._id, form) 
            : () => addLead(form),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            toast.success(response.message || "Success!"); 
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Something went wrong!");
        },
    });
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Lead" : "Add New Lead"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="border p-3 w-full rounded-md"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    className="border p-3 w-full rounded-md"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <select
                    className="border p-3 w-full rounded-md"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                    {LEAD_STATUS.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
                <button type="submit" className="cursor-pointer bg-blue-600 text-white w-full py-3 rounded-md hover:bg-blue-700">
                    {mutation.isPending ? "Processing..." : isEditing ? "Update Lead" : "Add Lead"}
                </button>
            </form>
        </Modal>
    );
}
