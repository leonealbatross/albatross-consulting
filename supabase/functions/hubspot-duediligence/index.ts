import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DueDiligenceRequest {
  name: string;
  email: string;
  company: string;
  role: string;
  transactionType: string;
  dealStage: string;
  annualRevenue: string;
  mainObjective: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      company, 
      role,
      transactionType,
      dealStage,
      annualRevenue,
      mainObjective,
      message 
    } = await req.json() as DueDiligenceRequest;

    console.log('Received Due Diligence form submission:', { 
      name, 
      email, 
      company, 
      role,
      transactionType,
      dealStage,
      annualRevenue,
      mainObjective
    });

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    
    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN not configured');
      throw new Error('HubSpot access token not configured');
    }

    // Build detailed message for HubSpot
    const fullMessage = `
Service Interest: Due Diligence Comercial para M&A
Transaction Type: ${transactionType}
Deal Stage: ${dealStage}
Annual Revenue: ${annualRevenue}
Main Objective: ${mainObjective}
Role: ${role}
Additional Message: ${message || 'Not provided'}
    `.trim();

    // Create or update contact in HubSpot with custom properties
    const contactData = {
      properties: {
        email: email,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || '',
        company: company,
        jobtitle: role,
        message: fullMessage,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
        // Note: For custom properties like service_interest, transaction_type, etc.,
        // they need to be created in HubSpot first before they can be used
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
              message: fullMessage,
              company: company,
              jobtitle: role,
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
        message: 'Due Diligence contact sent to HubSpot successfully',
        hubspotId: hubspotResult?.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in hubspot-duediligence function:', errorMessage);
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
