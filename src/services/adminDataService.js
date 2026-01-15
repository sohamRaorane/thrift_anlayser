
// Mock data service for Admin Portal
// Simulating API calls with delays

// --- Mock Data ---

const MOCK_CERTIFICATES = [
    { id: 1, business: "Urban Thrift", status: "Active", certifiedOn: "2023-01-15", expiry: "2024-01-15", rating: 4.8 },
    { id: 2, business: "Retro Vibe", status: "Expiring Soon", certifiedOn: "2023-02-10", expiry: "2024-02-10", rating: 4.5 },
    { id: 3, business: "Vintage Soul", status: "Active", certifiedOn: "2023-06-20", expiry: "2024-06-20", rating: 4.9 },
    { id: 4, business: "Thrift Kulture", status: "Expired", certifiedOn: "2022-11-01", expiry: "2023-11-01", rating: 4.2 },
    { id: 5, business: "Eco Wear", status: "Active", certifiedOn: "2023-03-05", expiry: "2024-03-05", rating: 4.7 },
];

const MOCK_ANALYTICS = {
    salesData: [
        { name: 'Mon', value: 400 },
        { name: 'Tue', value: 300 },
        { name: 'Wed', value: 600 },
        { name: 'Thu', value: 400 },
        { name: 'Fri', value: 500 },
        { name: 'Sat', value: 700 },
        { name: 'Sun', value: 600 },
    ],
    deliveryTimeData: [
        { name: 'Week 1', days: 4.5 },
        { name: 'Week 2', days: 3.8 },
        { name: 'Week 3', days: 3.2 },
        { name: 'Week 4', days: 2.9 },
    ],
    pieData: [
        { name: 'Resolved', value: 400, color: '#0088FE' },
        { name: 'In Progress', value: 300, color: '#00C49F' },
        { name: 'Open', value: 100, color: '#FFBB28' },
    ]
};

const MOCK_SELLERS = [
    { id: 'v1', name: "Urban Thrift" },
    { id: 'v2', name: "Retro Vibe" },
    { id: 'v3', name: "Vintage Soul" }
];

const MOCK_COMPLAINTS = [
    {
        id: "T-9920",
        vendor: "Urban Thrift",
        buyer: "Alice M.",
        status: "Open",
        issue: "Item not as described (faded color).",
        evidence: ["image1.jpg", "screenshot.png"],
        notes: ""
    },
    {
        id: "T-9921",
        vendor: "Retro Vibe",
        buyer: "Bob K.",
        status: "In Review",
        issue: "Late delivery, pending 10 days.",
        evidence: [],
        notes: "Vendor contacted, awaiting reply."
    },
    {
        id: "T-9922",
        vendor: "Vintage Soul",
        buyer: "Charlie D.",
        status: "Resolved",
        issue: "Wrong size received.",
        evidence: ["return_slip.pdf"],
        notes: "Refund processed."
    }
];

// --- Service Functions ---

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const adminDataService = {
    // Certificates
    getCertificates: async () => {
        await delay(500);
        return [...MOCK_CERTIFICATES];
    },

    renewCertificate: async (id) => {
        await delay(600);
        const cert = MOCK_CERTIFICATES.find(c => c.id === id);
        if (cert) {
            cert.status = "Active";
            // Bump year
            const oldDate = new Date(cert.expiry);
            oldDate.setFullYear(oldDate.getFullYear() + 1);
            cert.expiry = oldDate.toISOString().split('T')[0];
        }
        return cert;
    },

    revokeCertificate: async (id) => {
        await delay(600);
        const cert = MOCK_CERTIFICATES.find(c => c.id === id);
        if (cert) {
            cert.status = "Revoked";
        }
        return cert;
    },

    // Analytics
    getSellersList: async () => {
        await delay(300);
        return MOCK_SELLERS;
    },

    getSellerAnalytics: async (sellerId) => {
        await delay(700);
        // Return random variations based on ID to simulate different data
        const multiplier = sellerId === 'v2' ? 0.8 : 1.2;
        return {
            ...MOCK_ANALYTICS,
            salesData: MOCK_ANALYTICS.salesData.map(d => ({ ...d, value: Math.floor(d.value * multiplier) }))
        };
    },

    // Complaints
    getComplaints: async () => {
        await delay(400);
        return [...MOCK_COMPLAINTS];
    },

    updateComplaintStatus: async (id, status, notes) => {
        await delay(500);
        const ticket = MOCK_COMPLAINTS.find(t => t.id === id);
        if (ticket) {
            ticket.status = status;
            if (notes !== undefined) ticket.notes = notes;
        }
        return ticket;
    },

    // Subscriptions
    submitSubscriptionUpdate: async (vendorId, plan, promotions) => {
        await delay(800);
        console.log(`Updated vendor ${vendorId} to plan ${plan} with promotions:`, promotions);
        return { success: true };
    }
};
