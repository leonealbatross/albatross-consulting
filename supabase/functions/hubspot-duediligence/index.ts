import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DueDiligenceRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  taxId: string;
  transactionType: string;
  dealStatus: string;
  requesterProfile: string;
  jobTitle: string;
  marketSegment: string;
  revenueModel: string;
  targetCompany: string;
  targetRevenue: string;
  objectives: string[];
  availableData: string[];
  concerns: string;
  // Tags
  service: string;
  segment: string;
  source: string;
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
      phone,
      company, 
      country,
      taxId,
      transactionType,
      dealStatus,
      requesterProfile,
      jobTitle,
      marketSegment,
      revenueModel,
      targetCompany,
      targetRevenue,
      objectives,
      availableData,
      concerns,
      service,
      segment,
      source,
    } = requestData;

    console.log('Received Due Diligence form submission:', { 
      name, 
      email, 
      company,
      country,
      transactionType,
      dealStatus,
      service,
      segment,
      source
    });

    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    
    if (!hubspotAccessToken) {
      console.error('HUBSPOT_ACCESS_TOKEN not configured');
      throw new Error('HubSpot access token not configured');
    }

    // Map country codes to readable labels
    const countryLabels: Record<string, string> = {
      'BR': 'Brasil',
      'MX': 'México',
      'AR': 'Argentina',
      'CO': 'Colômbia',
      'CL': 'Chile',
      'PE': 'Peru',
      'EC': 'Equador',
      'UY': 'Uruguai',
      'PY': 'Paraguai',
      'BO': 'Bolívia',
      'VE': 'Venezuela',
      'CR': 'Costa Rica',
      'PA': 'Panamá',
      'OTHER': 'Outro',
    };

    // Map transaction type values to readable labels
    const transactionTypeLabels: Record<string, string> = {
      'buy_side': 'Buy-side (aquisição / investimento)',
      'sell_side': 'Sell-side (vendor DD / preparação para venda)',
      'ma_strategic': 'M&A estratégico / Corp Dev',
      'primary_vc': 'Captação primária (VC / Growth)',
      'secondary': 'Secundária / Liquidez (secondary)',
      'other': 'Outro',
    };

    // Map deal status values to readable labels
    const dealStatusLabels: Record<string, string> = {
      'pre_loi': 'Pré-LOI',
      'post_loi': 'Pós-LOI',
      'exclusivity': 'Exclusividade',
      'pre_closing': 'Pré-closing',
      'post_closing': 'Pós-closing (Plano 100 dias)',
      'exploratory': 'Exploratório / ainda sem datas',
      'other': 'Outro',
    };

    // Map requester profile values to readable labels
    const requesterProfileLabels: Record<string, string> = {
      'strategic_buyer': 'Comprador estratégico (corporate)',
      'private_equity': 'Private Equity (PE)',
      'venture_capital': 'Venture Capital (VC)',
      'growth_equity': 'Growth Equity',
      'cvc': 'Corporate Venture Capital (CVC)',
      'family_office': 'Family Office',
      'search_fund': 'Search Fund',
      'seller_management': 'Vendedor / Management',
      'advisor': 'Advisor (IB / M&A)',
      'other': 'Outro',
    };

    // Map job title values to readable labels
    const jobTitleLabels: Record<string, string> = {
      'partner': 'Sócio/Partner',
      'principal': 'Principal / Diretor',
      'ceo': 'CEO',
      'cfo': 'CFO',
      'cro_vp_sales': 'CRO / VP Sales',
      'head_ma': 'Head de M&A / Corp Dev',
      'other': 'Outro',
    };

    // Map market segment values to readable labels
    const marketSegmentLabels: Record<string, string> = {
      'fintech': 'Fintech',
      'healthtech': 'Healthtech',
      'retail_commerce': 'Retail/Commerce (e-commerce/marketplace)',
      'logistics': 'Logística/Supply Chain',
      'martech': 'Martech/Adtech',
      'erp_backoffice': 'ERP/Backoffice',
      'cybersecurity': 'Cybersecurity',
      'data_ai': 'Data/AI/Analytics',
      'edtech': 'Edtech',
      'saas_horizontal': 'SaaS horizontal (cross-industry)',
      'other': 'Outro',
    };

    // Map revenue model values to readable labels
    const revenueModelLabels: Record<string, string> = {
      'saas': 'SaaS (assinatura/ARR)',
      'usage_based': 'Usage-based / consumo',
      'marketplace': 'Marketplace (take rate)',
      'transactional': 'Transactional / pagamento por transação',
      'services': 'Serviços / projetos',
      'hardware_software': 'Hardware + software',
      'other': 'Outro / híbrido',
    };

    // Map target revenue values to readable labels
    const revenueLabels: Record<string, string> = {
      'startup': 'Startup (pré-escala / Seed–Series B)',
      'under_50m': 'Receita anual <R$50M',
      '50m_200m': 'R$50–200M',
      '200m_500m': 'R$200–500M',
      'above_500m': '>R$500M',
      'unknown': 'Não sei informar',
    };

    // Map objective values to readable labels
    const objectiveLabels: Record<string, string> = {
      'validate_icp': 'Validar ICP/segmentação e proposta de valor',
      'evaluate_pricing': 'Avaliar pricing/discounting e margem',
      'validate_sales_motions': 'Validar sales motions (SMB/Mid, Enterprise/KAM, PLG, SDR inbound/outbound)',
      'measure_pipeline': 'Medir saúde de pipeline (Rolling Four Quarters)',
      'test_forecast': 'Testar previsibilidade de forecast (3 anos)',
      'evaluate_sales_ops': 'Avaliar Sales Operations (CRM, métricas, enablement, incentivos)',
      'vendor_dd': 'Preparar vendor DD (sell-side) e data room comercial',
    };

    // Map available data values to readable labels
    const dataLabels: Record<string, string> = {
      'crm_export': 'Export do CRM com histórico',
      'quotas': 'Metas/quotas (12 trimestres)',
      'forecast_snapshots': 'Snapshots de forecast (semanal/mensal)',
      'client_list': 'Lista de clientes/contratos/renovações',
      'org_charts': 'Org charts e comp plan',
    };

    // Get readable labels
    const countryLabel = countryLabels[country] || country;
    const transactionTypeLabel = transactionTypeLabels[transactionType] || transactionType;
    const dealStatusLabel = dealStatusLabels[dealStatus] || dealStatus;
    const requesterProfileLabel = requesterProfileLabels[requesterProfile] || requesterProfile;
    const jobTitleLabel = jobTitleLabels[jobTitle] || jobTitle;
    const marketSegmentLabel = marketSegmentLabels[marketSegment] || marketSegment;
    const revenueModelLabel = revenueModelLabels[revenueModel] || revenueModel;
    const revenueLabel = revenueLabels[targetRevenue] || targetRevenue;

    // Build objectives string
    const objectivesString = objectives 
      ? objectives.map(o => objectiveLabels[o] || o).join('; ')
      : '';

    // Build available data string
    const availableDataString = availableData 
      ? availableData.map(d => dataLabels[d] || d).join('; ')
      : '';

    // Get Tax ID label based on country
    const taxIdLabel = country === 'BR' ? 'CNPJ' : 'Company Tax ID / ID Fiscal';

    // Build detailed message for HubSpot
    const fullMessage = `
=== DUE DILIGENCE COMERCIAL PARA M&A (Tech / LatAm) ===

TAGS:
• Service: ${service || 'Commercial Due Diligence (M&A)'}
• Segment: ${segment || 'Tech / LatAm'}
• Source: ${source || 'Website / Solicitar avaliação'}

--- IDENTIFICAÇÃO ---
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Empresa: ${company}
País: ${countryLabel}
${taxIdLabel}: ${taxId}

--- TRANSAÇÃO ---
Tipo de transação: ${transactionTypeLabel}
Status e janela do deal: ${dealStatusLabel}

--- PERFIL DO SOLICITANTE ---
Instituição: ${requesterProfileLabel}
Cargo: ${jobTitleLabel}

--- EMPRESA-ALVO ---
Segmento de mercado (vertical): ${marketSegmentLabel}
Modelo de receita: ${revenueModelLabel}
Setor e geografia principal: ${targetCompany || 'Não informado'}
Porte aproximado: ${revenueLabel}

--- OBJETIVOS DO DUE DILIGENCE COMERCIAL ---
${objectivesString ? objectivesString.split('; ').map(o => `• ${o}`).join('\n') : '• Não especificado'}

--- DADOS DISPONÍVEIS (até 5 dias úteis) ---
${availableDataString ? availableDataString.split('; ').map(d => `• ${d}`).join('\n') : '• Não informado'}

--- RISCOS/HIPÓTESES QUE PREOCUPAM O COMITÊ ---
${concerns || 'Não informado'}
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
        country: countryLabel,
        message: fullMessage,
        hs_lead_status: 'NEW',
        lifecyclestage: 'lead',
      }
    };

    console.log('Sending contact to HubSpot with tags:', { service, segment, source });

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
              country: countryLabel,
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
