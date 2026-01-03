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
  phone?: string;
  roleInTransaction: string;
  dealStatus: string;
  jobTitle: string;
  targetCompany: string;
  targetRevenue: string;
  objectives: string[];
  availableData?: string[];
  concerns?: string;
  service: string;
  source: string;
  // Legacy fields support
  role?: string;
  transactionType?: string;
  dealStage?: string;
  annualRevenue?: string;
  mainObjective?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json() as DueDiligenceRequest;
    
    const { 
      name, 
      email, 
      company, 
      phone,
      roleInTransaction,
      dealStatus,
      jobTitle,
      targetCompany,
      targetRevenue,
      objectives,
      availableData,
      concerns,
      service,
      source,
      // Legacy fields
      role,
      transactionType,
      dealStage,
      annualRevenue,
      mainObjective,
      message 
    } = requestData;

    console.log('Received Due Diligence form submission:', { 
      name, 
      email, 
      company, 
      roleInTransaction: roleInTransaction || role,
      dealStatus: dealStatus || dealStage,
      service,
      source
    });

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    
    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN not configured');
      throw new Error('HubSpot access token not configured');
    }

    // Map objective values to readable labels
    const objectiveLabels: Record<string, string> = {
      'validate_icp': 'Validar ICP/segmentação e proposta de valor',
      'evaluate_pricing': 'Avaliar pricing/discounting e margem',
      'validate_sales_motions': 'Validar sales motions (SMB/Mid, B2C, Enterprise/KAM, Green Field, SDR)',
      'measure_pipeline': 'Medir saúde de pipeline (Rolling Four Quarters)',
      'test_forecast': 'Testar previsibilidade de forecast (3 anos)',
      'evaluate_sales_ops': 'Avaliar Sales Operations (CRM, métricas, enablement, incentivos)',
    };

    // Map available data values to readable labels
    const dataLabels: Record<string, string> = {
      'crm_export': 'Export do CRM com histórico',
      'quotas': 'Metas/quotas (12 trimestres)',
      'forecast_snapshots': 'Snapshots de forecast (semanal/mensal)',
      'client_list': 'Lista de clientes/contratos/renovações',
      'org_charts': 'Org charts e comp plan',
    };

    // Map role values to readable labels
    const roleLabels: Record<string, string> = {
      'strategic_buyer': 'Comprador estratégico',
      'private_equity': 'Private Equity',
      'seller_management': 'Vendedor/Management',
      'advisor': 'Advisor (IB/M&A)',
      'other': 'Outro',
    };

    // Map deal status values to readable labels
    const dealStatusLabels: Record<string, string> = {
      'pre_loi': 'Pré-LOI',
      'post_loi': 'Pós-LOI',
      'exclusivity': 'Exclusividade',
      'pre_closing': 'Pré-closing',
      'post_closing': 'Pós-closing (plano 100 dias)',
      'other': 'Outro',
    };

    // Map job title values to readable labels
    const jobTitleLabels: Record<string, string> = {
      'partner': 'Sócio/Partner',
      'ceo': 'CEO',
      'cfo': 'CFO',
      'cro_vp_sales': 'CRO/VP Sales',
      'head_ma': 'Head de M&A/Corp Dev',
      'other': 'Outro',
    };

    // Map revenue values to readable labels
    const revenueLabels: Record<string, string> = {
      'under_50m': 'Receita anual <R$50M',
      '50m_200m': 'R$50–200M',
      '200m_500m': 'R$200–500M',
      'above_500m': '>R$500M',
      'unknown': 'Não sei informar',
    };

    // Build objectives string
    const objectivesString = objectives 
      ? objectives.map(o => objectiveLabels[o] || o).join('; ')
      : mainObjective || '';

    // Build available data string
    const availableDataString = availableData 
      ? availableData.map(d => dataLabels[d] || d).join('; ')
      : '';

    // Get readable labels
    const roleLabel = roleInTransaction 
      ? (roleLabels[roleInTransaction] || roleInTransaction)
      : (transactionType || '');
    
    const dealStatusLabel = dealStatus 
      ? (dealStatusLabels[dealStatus] || dealStatus)
      : (dealStage || '');
    
    const jobTitleLabel = jobTitle 
      ? (jobTitleLabels[jobTitle] || jobTitle)
      : (role || '');
    
    const revenueLabel = targetRevenue 
      ? (revenueLabels[targetRevenue] || targetRevenue)
      : (annualRevenue || '');

    // Build detailed message for HubSpot
    const fullMessage = `
=== DUE DILIGENCE COMERCIAL PARA M&A ===

SERVICE: ${service || 'Commercial Due Diligence (M&A)'}
SOURCE: ${source || 'Website / Solicitar avaliação'}

--- DADOS DO SOLICITANTE ---
Nome: ${name}
Email: ${email}
Empresa: ${company}
Telefone: ${phone || 'Não informado'}
Cargo: ${jobTitleLabel}
Papel na transação: ${roleLabel}
Status do deal: ${dealStatusLabel}

--- EMPRESA-ALVO ---
Setor e geografia: ${targetCompany || 'Não informado'}
Porte (receita): ${revenueLabel}

--- ESCOPO DO DD COMERCIAL ---
Objetivos principais:
${objectivesString ? objectivesString.split('; ').map(o => `• ${o}`).join('\n') : '• Não especificado'}

--- DADOS DISPONÍVEIS (5 dias úteis) ---
${availableDataString ? availableDataString.split('; ').map(d => `• ${d}`).join('\n') : '• Não informado'}

--- RISCOS/HIPÓTESES ---
${concerns || message || 'Não informado'}
    `.trim();

    // Create or update contact in HubSpot with custom properties
    const contactData = {
      properties: {
        email: email,
        firstname: name.split(' ')[0],
        lastname: name.split(' ').slice(1).join(' ') || '',
        company: company,
        phone: phone || '',
        jobtitle: jobTitleLabel,
        message: fullMessage,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
      }
    };

    console.log('Sending contact to HubSpot with tags:', { service, source });

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
              phone: phone || '',
              jobtitle: jobTitleLabel,
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
