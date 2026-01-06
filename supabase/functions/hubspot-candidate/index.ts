import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CandidateRequest {
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  message: string;
}

// Input validation
function validateRequest(data: unknown): { valid: boolean; error?: string; data?: CandidateRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const request = data as Record<string, unknown>;
  
  // Validate name
  if (typeof request.name !== 'string' || request.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (request.name.length > 100) {
    return { valid: false, error: 'Name is too long (max 100 characters)' };
  }
  
  // Validate email
  if (typeof request.email !== 'string' || request.email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  if (request.email.length > 255) {
    return { valid: false, error: 'Email is too long (max 255 characters)' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Validate message
  if (typeof request.message !== 'string' || request.message.trim().length === 0) {
    return { valid: false, error: 'Message is required' };
  }
  if (request.message.length > 5000) {
    return { valid: false, error: 'Message is too long (max 5000 characters)' };
  }
  
  // Validate optional phone
  if (request.phone !== undefined && typeof request.phone !== 'string') {
    return { valid: false, error: 'Phone must be a string' };
  }
  if (request.phone && request.phone.length > 30) {
    return { valid: false, error: 'Phone is too long (max 30 characters)' };
  }
  
  // Validate optional linkedin
  if (request.linkedin !== undefined && typeof request.linkedin !== 'string') {
    return { valid: false, error: 'LinkedIn must be a string' };
  }
  if (request.linkedin && request.linkedin.length > 500) {
    return { valid: false, error: 'LinkedIn URL is too long (max 500 characters)' };
  }
  
  return { 
    valid: true, 
    data: {
      name: request.name.trim(),
      email: request.email.trim().toLowerCase(),
      phone: typeof request.phone === 'string' ? request.phone.trim() : undefined,
      linkedin: typeof request.linkedin === 'string' ? request.linkedin.trim() : undefined,
      message: request.message.trim(),
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validation = validateRequest(rawData);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ success: false, error: validation.error || 'Invalid request' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { name, email, phone, linkedin, message } = validation.data;

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    
    if (!hubspotAccessToken) {
      throw new Error('HubSpot access token not configured');
    }

    // Create or update contact in HubSpot
    const contactData = {
      properties: {
        email: email,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || '',
        phone: phone || '',
        linkedin_url: linkedin || '',
        message: message,
        hs_lead_status: 'NEW',
        lifecyclestage: 'subscriber',
        jobtitle: 'Candidato',
      }
    };

    // First, try to create the contact
    const createResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    let hubspotResult;
    
    if (createResponse.status === 409) {
      // Contact already exists, update it
      
      // Search for the existing contact
      const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: email,
            }]
          }]
        }),
      });

      const searchData = await searchResponse.json();

      if (searchData.results && searchData.results.length > 0) {
        const contactId = searchData.results[0].id;
        
        // Update the existing contact
        const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${hubspotAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: {
              message: message,
              phone: phone || '',
              linkedin_url: linkedin || '',
              jobtitle: 'Candidato',
            }
          }),
        });

        hubspotResult = await updateResponse.json();
      }
    } else if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`HubSpot API error: ${JSON.stringify(errorData)}`);
    } else {
      hubspotResult = await createResponse.json();
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Candidate sent to HubSpot successfully',
        hubspotId: hubspotResult?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An error occurred processing your request' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
