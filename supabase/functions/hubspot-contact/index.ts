import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRequest {
  name: string;
  email: string;
  company?: string;
  message: string;
  sectionTitle?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, message, sectionTitle } = await req.json() as ContactRequest;

    console.log('Received contact form submission:', { name, email, company, sectionTitle });

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    
    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN not configured');
      throw new Error('HubSpot access token not configured');
    }

    // Create or update contact in HubSpot
    const contactData = {
      properties: {
        email: email,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || '',
        company: company || '',
        message: message,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
      }
    };

    console.log('Sending contact to HubSpot:', contactData);

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
      console.log('Contact already exists, updating...');
      
      // Get the existing contact ID from the error response
      const errorData = await createResponse.json();
      console.log('Conflict response:', errorData);
      
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
      console.log('Search result:', searchData);

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
              company: company || '',
            }
          }),
        });

        hubspotResult = await updateResponse.json();
        console.log('Contact updated:', hubspotResult);
      }
    } else if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.error('HubSpot API error:', errorData);
      throw new Error(`HubSpot API error: ${JSON.stringify(errorData)}`);
    } else {
      hubspotResult = await createResponse.json();
      console.log('Contact created successfully:', hubspotResult);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact sent to HubSpot successfully',
        hubspotId: hubspotResult?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in hubspot-contact function:', errorMessage);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
