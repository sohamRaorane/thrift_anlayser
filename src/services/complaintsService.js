import { supabase } from '../lib/supabase';

export const complaintsService = {

    // 1. Fetch Tickets (with optional filters)
    getTickets: async () => {
        // In a real app we'd add filters for status/search as params
        // For now, fetch all and join with vendors to get store name
        const { data, error } = await supabase
            .from('complaint_tickets')
            .select(`
                *,
                vendors (business_name, store_name)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }

        // Map to simpler format for UI
        return data.map(t => ({
            id: t.ticket_code, // e.g. T-9920
            raw_id: t.id, // UUID for updates
            vendor: t.vendors?.business_name || t.vendors?.store_name || 'Unknown Vendor',
            buyer: t.buyer_name,
            issue: t.issue_summary,
            full_text: t.complaint_text,
            status: t.status,
            notes: t.admin_notes || '',
            evidence: [] // Fetched separately or can join if needed
        }));
    },

    // 2. Fetch Evidence for a Ticket
    getEvidence: async (ticketCode) => {
        // Need to resolve ticketCode (T-xxxx) to UUID first? 
        // Or simpler: UI passes the UUID (raw_id).
        // Let's assume UI passes valid UUID or we query by ticket_code.
        // For efficiency, we'll try to do it via UUID if available.

        // Actually, let's just query by ticket_code if that's what we have, or pass UUID.
        // Let's implement getting by UUID.
        return [];
    },

    getEvidenceByUUID: async (ticketUuid) => {
        const { data, error } = await supabase
            .from('complaint_evidence')
            .select('file_name, file_path')
            .eq('ticket_id', ticketUuid);

        if (error) return [];
        return data.map(f => f.file_name);
    },

    // 3. Update Status
    updateStatus: async (ticketUuid, newStatus) => {
        const { data, error } = await supabase
            .from('complaint_tickets')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', ticketUuid)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 4. Update Notes
    updateNotes: async (ticketUuid, notes) => {
        const { data, error } = await supabase
            .from('complaint_tickets')
            .update({
                admin_notes: notes,
                updated_at: new Date().toISOString()
            })
            .eq('id', ticketUuid)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // 5. Upload Evidence (future proofing)
    uploadEvidence: async (ticketUuid, file) => {
        // 1. Upload to storage
        const filePath = `complaints/${ticketUuid}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('complaint-evidence')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Insert record
        const { error: dbError } = await supabase
            .from('complaint_evidence')
            .insert({
                ticket_id: ticketUuid,
                file_name: file.name,
                file_path: filePath,
                file_type: file.type
            });

        if (dbError) throw dbError;
        return true;
    }
};
