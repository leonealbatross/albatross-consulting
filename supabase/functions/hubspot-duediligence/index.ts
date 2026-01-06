import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

// Input validation
function validateRequest(data: unknown): { valid: boolean; error?: string; data?: DueDiligenceRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }
  
  const request = data as Record<string, unknown>;
  
  // Validate required fields
  if (typeof request.name !== 'string' || request.name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }
  if (request.name.length > 100) {
    return { valid: false, error: 'Name is too long (max 100 characters)' };
  }
  
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
  
  if (typeof request.company !== 'string' || request.company.trim().length === 0) {
    return { valid: false, error: 'Company is required' };
  }
  if (request.company.length > 200) {
    return { valid: false, error: 'Company is too long (max 200 characters)' };
  }
  
  // Validate optional string fields with length limits
  const stringFields = ['phone', 'country', 'taxId', 'transactionType', 'dealStatus', 
    'requesterProfile', 'jobTitle', 'marketSegment', 'revenueModel', 'targetCompany', 
    'targetRevenue', 'concerns', 'service', 'segment', 'source'];
  
  for (const field of stringFields) {
    if (request[field] !== undefined && typeof request[field] !== 'string') {
      return { valid: false, error: `${field} must be a string` };
    }
    if (typeof request[field] === 'string' && request[field].length > 1000) {
      return { valid: false, error: `${field} is too long (max 1000 characters)` };
    }
  }
  
  // Validate arrays
  if (request.objectives !== undefined && !Array.isArray(request.objectives)) {
    return { valid: false, error: 'Objectives must be an array' };
  }
  if (request.availableData !== undefined && !Array.isArray(request.availableData)) {
    return { valid: false, error: 'Available data must be an array' };
  }
  
  return { 
    valid: true, 
    data: request as unknown as DueDiligenceRequest
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
    
    const requestData = validation.data;
    
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
      const errorData = await createResponse.json();
      
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
              message: fullMessage,
              company: company,
              phone: phone || '',
              jobtitle: jobTitleLabel,
              country: countryLabel,
            }
          }),
        });

        hubspotResult = await updateResponse.json();
      }
    } else if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(`HubSpot API error`);
    } else {
      hubspotResult = await createResponse.json();
    }

    // Send email notification using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSent = false;
    
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        
        const emailHtml = `
          <h2 style="color: #1a365d; margin-bottom: 20px;">Nova Solicitação de Due Diligence Comercial</h2>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">📋 Identificação</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
            <p><strong>Empresa:</strong> ${company}</p>
            <p><strong>País:</strong> ${countryLabel}</p>
            <p><strong>${taxIdLabel}:</strong> ${taxId}</p>
          </div>
          
          <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">💼 Transação</h3>
            <p><strong>Tipo:</strong> ${transactionTypeLabel}</p>
            <p><strong>Status:</strong> ${dealStatusLabel}</p>
          </div>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">👤 Perfil do Solicitante</h3>
            <p><strong>Instituição:</strong> ${requesterProfileLabel}</p>
            <p><strong>Cargo:</strong> ${jobTitleLabel}</p>
          </div>
          
          <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">🎯 Empresa-Alvo</h3>
            <p><strong>Segmento:</strong> ${marketSegmentLabel}</p>
            <p><strong>Modelo de Receita:</strong> ${revenueModelLabel}</p>
            <p><strong>Setor/Geografia:</strong> ${targetCompany || 'Não informado'}</p>
            <p><strong>Porte:</strong> ${revenueLabel}</p>
          </div>
          
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">🎯 Objetivos do DD Comercial</h3>
            <ul>
              ${objectivesString ? objectivesString.split('; ').map(o => `<li>${o}</li>`).join('') : '<li>Não especificado</li>'}
            </ul>
          </div>
          
          <div style="background: #edf2f7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-top: 0;">📊 Dados Disponíveis</h3>
            <ul>
              ${availableDataString ? availableDataString.split('; ').map(d => `<li>${d}</li>`).join('') : '<li>Não informado</li>'}
            </ul>
          </div>
          
          <div style="background: #fff5f5; padding: 20px; border-radius: 8px; border-left: 4px solid #c53030;">
            <h3 style="color: #c53030; margin-top: 0;">⚠️ Riscos/Hipóteses</h3>
            <p>${concerns || 'Não informado'}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px;">
            Tags: ${service || 'Commercial Due Diligence (M&A)'} | ${segment || 'Tech / LatAm'} | ${source || 'Website'}
          </p>
        `;

        const emailResponse = await resend.emails.send({
          from: 'Albatross Consulting <onboarding@resend.dev>',
          to: ['leone@albatross.consulting'],
          subject: `[DD Comercial] Nova Solicitação - ${company} (${name})`,
          html: emailHtml,
        });

        emailSent = true;
      } catch (emailError) {
        // Don't fail the whole request if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Due Diligence contact sent to HubSpot successfully',
        hubspotId: hubspotResult?.id,
        emailSent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
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
