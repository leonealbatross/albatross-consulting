import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Nomes brasileiros fictícios
const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Lucas', 'Juliana',
  'Rafael', 'Camila', 'Bruno', 'Patricia', 'Gustavo', 'Larissa', 'Thiago'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Araújo'
];

const COMPANIES = [
  'Kaszek Ventures', 'Softbank Latin America', 'General Atlantic Brasil',
  'Valor Capital Group', 'Monashees', 'QED Investors', 'Ribbit Capital',
  'Advent International', 'Warburg Pincus', 'Goldman Sachs Growth'
];

// Dados COMPLETOS do formulário Due Diligence - todos os campos
const DUE_DILIGENCE_LEADS = [
  {
    // Step 1 - Informações pessoais e transação
    country: 'BR',
    taxId: '12.345.678/0001-90',
    transactionType: 'Buy-side (Aquisição)',
    dealStatus: 'Pós-LOI',
    // Step 2 - Perfil do solicitante
    requesterProfile: 'Private Equity',
    jobTitle: 'Partner',
    // Step 2 - Informações do target
    targetCompany: 'PayTech Brasil',
    marketSegment: 'Fintech',
    revenueModel: 'SaaS (Recorrente)',
    targetRevenue: 'R$ 50M - R$ 200M',
    // Step 2 - Objetivos e dados
    objectives: ['Validar ICP e segmentação', 'Avaliar precificação', 'Medir qualidade do pipeline'],
    availableData: ['Export de CRM', 'Quotas e metas', 'Lista de clientes'],
    concerns: 'Preocupação com a concentração de receita em poucos clientes e a sustentabilidade do modelo de precificação atual. Precisamos entender se o crescimento é replicável e se a base de clientes é diversificada o suficiente para mitigar riscos de concentração.'
  },
  {
    country: 'BR',
    taxId: '98.765.432/0001-10',
    transactionType: 'Sell-side (Venda)',
    dealStatus: 'Pré-LOI',
    requesterProfile: 'Management/Seller',
    jobTitle: 'CEO',
    targetCompany: 'HealthConnect LATAM',
    marketSegment: 'Healthtech',
    revenueModel: 'Marketplace',
    targetRevenue: 'R$ 200M - R$ 500M',
    objectives: ['Vendor Due Diligence', 'Validar sales motions', 'Testar acurácia do forecast'],
    availableData: ['Export de CRM', 'Snapshots de forecast', 'Organogramas'],
    concerns: 'Necessidade de demonstrar a qualidade da receita recorrente e a eficiência do time comercial para potenciais compradores. Queremos antecipar objeções de investidores e preparar um data room comercial completo com métricas de vendas auditáveis.'
  },
  {
    country: 'MX',
    taxId: 'RFC-XAXX010101000',
    transactionType: 'M&A Estratégico',
    dealStatus: 'Exclusividade',
    requesterProfile: 'Strategic Buyer',
    jobTitle: 'Head de M&A',
    targetCompany: 'RetailTech México',
    marketSegment: 'Retail/E-commerce',
    revenueModel: 'Transacional',
    targetRevenue: 'Abaixo de R$ 50M',
    objectives: ['Avaliar Sales Ops e processos', 'Validar ICP e segmentação', 'Avaliar precificação'],
    availableData: ['Export de CRM', 'Lista de clientes'],
    concerns: 'Avaliar sinergias comerciais e identificar gaps operacionais que precisarão ser endereçados pós-aquisição. Foco em integração de times de vendas e unificação de processos comerciais entre Brasil e México.'
  },
  {
    country: 'BR',
    taxId: '45.678.901/0001-23',
    transactionType: 'Rodada Primária (VC)',
    dealStatus: 'Exploratório',
    requesterProfile: 'Venture Capital',
    jobTitle: 'Principal',
    targetCompany: 'AI Labs Brasil',
    marketSegment: 'Data/AI/Analytics',
    revenueModel: 'Usage-based',
    targetRevenue: 'Startup/Early-stage',
    objectives: ['Validar sales motions', 'Medir qualidade do pipeline', 'Testar acurácia do forecast'],
    availableData: ['Export de CRM', 'Quotas e metas'],
    concerns: 'Entender a maturidade do GTM e a capacidade de escalar vendas enterprise com o modelo de precificação por uso. Avaliar unit economics do modelo comercial e potencial de expansão de receita em mercados adjacentes.'
  },
  {
    country: 'AR',
    taxId: '30-12345678-9',
    transactionType: 'Secundária',
    dealStatus: 'Pré-closing',
    requesterProfile: 'Growth Equity',
    jobTitle: 'CFO',
    targetCompany: 'ERP Solutions LATAM',
    marketSegment: 'ERP/Backoffice',
    revenueModel: 'SaaS (Recorrente)',
    targetRevenue: 'Acima de R$ 500M',
    objectives: ['Validar ICP e segmentação', 'Avaliar Sales Ops e processos', 'Vendor Due Diligence'],
    availableData: ['Export de CRM', 'Quotas e metas', 'Snapshots de forecast', 'Lista de clientes', 'Organogramas'],
    concerns: 'Validar a qualidade do ARR reportado e entender riscos de churn em segmentos específicos de clientes. Análise profunda de cohorts, NRR e CAC payback por segmento. Precisamos de visibilidade sobre a previsibilidade do pipeline.'
  }
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domain = company.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15) + '.com';
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(country: string): string {
  const codes: Record<string, string> = { BR: '55', MX: '52', AR: '54' };
  const code = codes[country] || '55';
  const ddd = ['11', '21', '31', '41', '51'][Math.floor(Math.random() * 5)];
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `+${code}${ddd}9${number.toString().substring(0, 8)}`;
}

function generateSessionId(): string {
  return `seed_dd_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hubspotAccessToken = Deno.env.get('HUBSPOT_ACCESS_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!hubspotAccessToken) {
      throw new Error('HUBSPOT_ACCESS_TOKEN not configured');
    }

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: { name: string; email: string; success: boolean; error?: string }[] = [];

    console.log('📊 Gerando 5 leads de Due Diligence Comercial com dados completos...\n');

    for (let i = 0; i < DUE_DILIGENCE_LEADS.length; i++) {
      const ddData = DUE_DILIGENCE_LEADS[i];
      const firstName = randomItem(FIRST_NAMES);
      const lastName = randomItem(LAST_NAMES);
      const company = randomItem(COMPANIES);
      const email = generateEmail(firstName, lastName, company);
      const phone = generatePhone(ddData.country);
      const sessionId = generateSessionId();

      console.log(`→ Lead ${i + 1}: ${firstName} ${lastName}`);
      console.log(`  Empresa: ${company}`);
      console.log(`  Target: ${ddData.targetCompany}`);
      console.log(`  Transação: ${ddData.transactionType}`);

      try {
        // HubSpot - mensagem formatada com TODOS os dados do formulário
        const fullMessage = `[Due Diligence Comercial - Formulário Completo]

=== STEP 1: DADOS DA TRANSAÇÃO ===
País: ${ddData.country}
CNPJ/Tax ID: ${ddData.taxId}
Tipo de Transação: ${ddData.transactionType}
Status do Deal: ${ddData.dealStatus}

=== STEP 2: PERFIL DO SOLICITANTE ===
Perfil: ${ddData.requesterProfile}
Cargo: ${ddData.jobTitle}

=== STEP 2: EMPRESA TARGET ===
Nome da Empresa: ${ddData.targetCompany}
Segmento de Mercado: ${ddData.marketSegment}
Modelo de Receita: ${ddData.revenueModel}
Faixa de Receita: ${ddData.targetRevenue}

=== STEP 2: OBJETIVOS E ESCOPO ===
Objetivos da DD: ${ddData.objectives.join(', ')}
Dados Disponíveis: ${ddData.availableData.join(', ')}

=== PREOCUPAÇÕES E CONTEXTO ===
${ddData.concerns}

Fonte: Alba Chatbot - Seed Test (Due Diligence)`;

        const contactData = {
          properties: {
            email: email,
            firstname: firstName,
            lastname: lastName,
            company: company,
            jobtitle: ddData.jobTitle,
            phone: phone,
            message: fullMessage,
            hs_lead_status: 'NEW',
            lifecyclestage: 'lead',
          }
        };

        const hubspotResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${hubspotAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        let hubspotSuccess = hubspotResponse.ok;
        let hubspotId = null;

        if (hubspotResponse.status === 409) {
          console.log(`  ⚠️ Contato já existe, buscando ID...`);
          const searchResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${hubspotAccessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filterGroups: [{
                filters: [{ propertyName: 'email', operator: 'EQ', value: email }]
              }]
            }),
          });
          const searchData = await searchResponse.json();
          if (searchData.results?.length > 0) {
            hubspotId = searchData.results[0].id;
            hubspotSuccess = true;
          }
        } else if (hubspotResponse.ok) {
          const hubspotResult = await hubspotResponse.json();
          hubspotId = hubspotResult.id;
          console.log(`  ✅ HubSpot ID: ${hubspotId}`);
        } else {
          const errorData = await hubspotResponse.json();
          console.error(`  ❌ Erro HubSpot:`, errorData);
        }

        // Analytics - TODOS os campos do formulário
        const analyticsData = {
          session_id: sessionId,
          event_type: 'lead_submitted',
          lead_submitted: true,
          messages_count: Math.floor(Math.random() * 8) + 3,
          service_interest: 'Due Diligence Comercial',
          event_data: {
            // Dados do contato
            lead_name: `${firstName} ${lastName}`,
            lead_email: email,
            lead_company: company,
            lead_phone: phone,
            hubspot_id: hubspotId,
            source: 'seed_test',
            // Step 1 - Dados da transação
            country: ddData.country,
            tax_id: ddData.taxId,
            transaction_type: ddData.transactionType,
            deal_status: ddData.dealStatus,
            // Step 2 - Perfil do solicitante
            requester_profile: ddData.requesterProfile,
            job_title: ddData.jobTitle,
            // Step 2 - Empresa target
            target_company: ddData.targetCompany,
            market_segment: ddData.marketSegment,
            revenue_model: ddData.revenueModel,
            target_revenue: ddData.targetRevenue,
            // Step 2 - Objetivos e dados
            objectives: ddData.objectives,
            available_data: ddData.availableData,
            // Preocupações/Mensagem
            message: ddData.concerns
          }
        };

        const { error: analyticsError } = await supabase
          .from('alba_analytics')
          .insert(analyticsData);

        if (analyticsError) {
          console.error(`  ❌ Erro Analytics:`, analyticsError);
        } else {
          console.log(`  ✅ Analytics registrado com todos os campos`);
        }

        // Evento de sessão
        await supabase.from('alba_analytics').insert({
          session_id: sessionId,
          event_type: 'session_start',
          lead_submitted: false,
          messages_count: 0,
          service_interest: 'Due Diligence Comercial',
          event_data: { source: 'seed_test' }
        });

        results.push({ name: `${firstName} ${lastName}`, email, success: hubspotSuccess });
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (leadError) {
        const errorMsg = leadError instanceof Error ? leadError.message : 'Unknown error';
        console.error(`  ❌ Erro no lead:`, errorMsg);
        results.push({ name: `${firstName} ${lastName}`, email, success: false, error: errorMsg });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n🎉 Seed Due Diligence concluído: ${successful} sucesso, ${failed} falhas`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Due Diligence seed concluído: ${successful} leads criados, ${failed} falhas`,
        total: results.length,
        successful,
        failed,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Erro no seed:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
