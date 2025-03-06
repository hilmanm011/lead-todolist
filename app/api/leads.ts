const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get All Leads
export const fetchLeads = async ({ status = "", skip = 0, limit = 5 }) => {
    const queryParams = new URLSearchParams({
        status,
        skip: skip.toString(),
        limit: limit.toString(),
    }).toString();

    const response = await fetch(`${API_URL}/leads?${queryParams}`);
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message || "Failed to fetch leads");
    return responseData.data
};

// Add New Lead
export const addLead = async (leadData: { name: string; email: string; status: string }) => {
    const response = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
    });
    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message || "Failed to add lead");
    return responseData;
};

// Update Lead
export const updateLead = async (id: string, leadData: { name: string; email: string; status: string }) => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
    });

    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.message || "Failed to update lead");
    return responseData;
};

