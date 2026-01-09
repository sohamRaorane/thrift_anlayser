import { supabase } from '../lib/supabase'

// Fetch all vendors
export async function fetchVendors() {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching vendors:', error)
        return []
    }

    return data
}

// Fetch single vendor by ID
export async function fetchVendorById(id) {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching vendor:', error)
        return null
    }

    return data
}

// Fetch reviews for a vendor
export async function fetchVendorReviews(vendorId) {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching reviews:', error)
        return []
    }

    return data
}

// Submit a new review
export async function submitReview(reviewData) {
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()

    if (error) {
        console.error('Error submitting review:', error)
        throw error
    }

    return data[0]
}

// Fetch vendor transparency data
export async function fetchVendorTransparency(vendorId) {
    const { data, error } = await supabase
        .from('vendor_transparency')
        .select('*')
        .eq('vendor_id', vendorId)
        .single()

    if (error) {
        console.error('Error fetching transparency:', error)
        return null
    }

    return data
}

// Fetch red flags for a vendor
export async function fetchVendorRedFlags(vendorId) {
    const { data, error } = await supabase
        .from('red_flags')
        .select('*')
        .eq('vendor_id', vendorId)

    if (error) {
        console.error('Error fetching red flags:', error)
        return []
    }

    return data
}

// Fetch complaints for a vendor
export async function fetchVendorComplaints(vendorId) {
    const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching complaints:', error)
        return []
    }

    return data
}

// Resolve a complaint
export async function resolveComplaint(complaintId, resolutionText) {
    const { data, error } = await supabase
        .from('complaints')
        .update({
            status: 'resolved',
            public_response: resolutionText,
            resolved_at: new Date().toISOString()
        })
        .eq('id', complaintId)
        .select()

    if (error) {
        console.error('Error resolving complaint:', error)
        throw error
    }

    return data[0]
}
