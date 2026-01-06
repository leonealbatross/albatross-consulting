import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 6 serviços da Albatross
const SERVICES = [
  'Growth Strategy & Go-to-Market',
  'Governança Corporativa & Advisory Board',
  'Mentoria Executiva',
  'M&A para Empresas de Tecnologia',
  'Due Diligence Comercial',
  'GenAI & Inovação'
];

// Nomes brasileiros fictícios
const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Fernanda', 'Lucas', 'Juliana',
  'Rafael', 'Camila', 'Bruno', 'Patricia', 'Gustavo', 'Larissa', 'Thiago',
  'Beatriz', 'Diego', 'Amanda', 'Felipe', 'Carolina', 'Rodrigo', 'Marcela',
  'André', 'Isabela', 'Leonardo', 'Renata', 'Eduardo', 'Vanessa', 'Marcos', 'Daniela'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
  'Araújo', 'Melo', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso',
  'Ramos', 'Teixeira'
];

const COMPANIES = [
  'TechBrasil Solutions', 'Inovação Digital Ltda', 'StartUp Hub SA',
  'Grupo Nexus Tecnologia', 'DataFlow Analytics', 'CloudPro Services',
  'Fintech Solutions BR', 'AgriTech Innovations', 'HealthTech Brasil',
  'EdTech Learning', 'LogisTech Soluções', 'RetailTech Pro',
  'CyberSecure Brasil', 'IoT Connect SA', 'AI Labs Brasil',
  'Blockchain Solutions', 'SaaS Enterprise', 'Marketplace Plus',
  'PayTech Pagamentos', 'InsurTech Brasil', 'PropTech Imóveis',
  'FoodTech Delivery', 'TravelTech Brasil', 'LegalTech Solutions',
  'HRTech Talentos', 'MarTech Digital', 'SupplyChain Tech',
  'EnergyTech Verde', 'MobilityTech', 'GovTech Solutions'
];

const ROLES = [
  'CEO', 'CRO', 'CFO', 'COO', 'CMO', 'VP de Vendas', 'Diretor Comercial',
  'Head de Growth', 'Fundador', 'Co-fundador', 'Diretor de Operações',
  'Head de M&A', 'Diretor Financeiro', 'VP de Estratégia'
];

// Mensagens por serviço
const SERVICE_MESSAGES: Record<string, string[]> = {
  'Growth Strategy & Go-to-Market': [
    'Estamos expandindo para novos mercados e precisamos estruturar nossa estratégia comercial.',
    'Nosso time de vendas cresceu muito rápido e precisamos de processos mais robustos.',
    'Queremos melhorar nossa taxa de conversão e previsibilidade do pipeline.',
    'Precisamos de ajuda para estruturar OKRs e KPIs comerciais eficazes.',
    'Buscamos profissionalizar nossa área comercial para a próxima rodada de investimento.'
  ],
  'Governança Corporativa & Advisory Board': [
    'Estamos profissionalizando a empresa familiar e precisamos estruturar governança.',
    'Recebemos investimento e precisamos montar um Advisory Board qualificado.',
    'Queremos atrair executivos de alto nível com uma governança mais robusta.',
    'Precisamos de apoio para estruturar nosso conselho consultivo.',
    'Buscamos mentoria estratégica de conselheiros experientes.'
  ],
  'Mentoria Executiva': [
    'Sou CEO e preciso de mentoria para transição de operacional para estratégico.',
    'Assumi a posição de CRO recentemente e busco acelerar meus resultados.',
    'Estou passando por um momento crítico de turnaround e preciso de apoio.',
    'Quero desenvolver minhas competências de liderança executiva.',
    'Busco mentoria para melhorar minha tomada de decisão sob pressão.'
  ],
  'M&A para Empresas de Tecnologia': [
    'Estamos considerando vender a empresa e precisamos de assessoria completa.',
    'Buscamos fazer aquisições estratégicas para crescimento inorgânico.',
    'Somos Private Equity e precisamos de suporte em add-ons do portfólio.',
    'Acabamos de fechar uma aquisição e precisamos de ajuda na integração.',
    'Queremos preparar a empresa para uma eventual venda nos próximos 2 anos.'
  ],
  'Due Diligence Comercial': [] // Tratado separadamente com dados completos do formulário
  ,
  'GenAI & Inovação': [
    'Queremos implementar IA generativa para automatizar nossos processos.',
    'Buscamos criar um chatbot inteligente para nosso atendimento.',
    'Precisamos de dashboards de Sales Intelligence para melhorar forecast.',
    'Queremos automatizar a geração de propostas comerciais com IA.',
    'Buscamos inovação com IA para ganhar vantagem competitiva.'
  ]
};

// Dados completos do formulário Due Diligence
const DUE_DILIGENCE_DATA = [
  {
    transactionType: 'Buy-side (Aquisição)',
    dealStatus: 'Pós-LOI',
    requesterProfile: 'Private Equity',
    jobTitle: 'Partner',
    marketSegment: 'Fintech',
    revenueModel: 'SaaS (Recorrente)',
    targetCompany: 'PayTech Brasil',
    targetRevenue: 'R$ 50M - R$ 200M',
    objectives: ['Validar ICP e segmentação', 'Avaliar precificação', 'Medir qualidade do pipeline'],
    availableData: ['Export de CRM', 'Quotas e metas', 'Lista de clientes'],
    concerns: 'Preocupação com a concentração de receita em poucos clientes e a sustentabilidade do modelo de precificação atual. Precisamos entender se o crescimento é replicável.'
  },
  {
    transactionType: 'Sell-side (Venda)',
    dealStatus: 'Pré-LOI',
    requesterProfile: 'Management/Seller',
    jobTitle: 'CEO',
    marketSegment: 'Healthtech',
    revenueModel: 'Marketplace',
    targetCompany: 'HealthConnect LATAM',
    targetRevenue: 'R$ 200M - R$ 500M',
    objectives: ['Vendor Due Diligence', 'Validar sales motions', 'Testar acurácia do forecast'],
    availableData: ['Export de CRM', 'Snapshots de forecast', 'Organogramas'],
    concerns: 'Necessidade de demonstrar a qualidade da receita recorrente e a eficiência do time comercial para potenciais compradores. Queremos antecipar objeções de investidores.'
  },
  {
    transactionType: 'M&A Estratégico',
    dealStatus: 'Exclusividade',
    requesterProfile: 'Strategic Buyer',
    jobTitle: 'Head de M&A',
    marketSegment: 'Retail/E-commerce',
    revenueModel: 'Transacional',
    targetCompany: 'RetailTech Pro',
    targetRevenue: 'Abaixo de R$ 50M',
    objectives: ['Avaliar Sales Ops e processos', 'Validar ICP e segmentação', 'Avaliar precificação'],
    availableData: ['Export de CRM', 'Lista de clientes'],
    concerns: 'Avaliar sinergias comerciais e identificar gaps operacionais que precisarão ser endereçados pós-aquisição. Foco em integração de times.'
  },
  {
    transactionType: 'Rodada Primária (VC)',
    dealStatus: 'Exploratório',
    requesterProfile: 'Venture Capital',
    jobTitle: 'Principal',
    marketSegment: 'Data/AI/Analytics',
    revenueModel: 'Usage-based',
    targetCompany: 'AI Labs Brasil',
    targetRevenue: 'Startup/Early-stage',
    objectives: ['Validar sales motions', 'Medir qualidade do pipeline', 'Testar acurácia do forecast'],
    availableData: ['Export de CRM', 'Quotas e metas'],
    concerns: 'Entender a maturidade do GTM e a capacidade de escalar vendas enterprise com o modelo de precificação por uso. Avaliar unit economics do modelo comercial.'
  },
  {
    transactionType: 'Secundária',
    dealStatus: 'Pré-closing',
    requesterProfile: 'Growth Equity',
    jobTitle: 'CFO',
    marketSegment: 'ERP/Backoffice',
    revenueModel: 'SaaS (Recorrente)',
    targetCompany: 'ERP Solutions LATAM',
    targetRevenue: 'Acima de R$ 500M',
    objectives: ['Validar ICP e segmentação', 'Avaliar Sales Ops e processos', 'Vendor Due Diligence'],
    availableData: ['Export de CRM', 'Quotas e metas', 'Snapshots de forecast', 'Lista de clientes', 'Organogramas'],
    concerns: 'Validar a qualidade do ARR reportado e entender riscos de churn em segmentos específicos de clientes. Análise profunda de cohorts e NRR.'
  }
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domain = company.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15) + '.com.br';
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(): string {
  const ddd = ['11', '21', '31', '41', '51', '19', '13', '47', '48', '27'][Math.floor(Math.random() * 10)];
  const number = Math.floor(Math.random() * 900000000) + 100000000;
  return `+55${ddd}9${number.toString().substring(0, 8)}`;
}

function generateSessionId(): string {
  return `seed_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

    const results: { service: string; name: string; email: string; success: boolean; error?: string }[] = [];

    // Gerar 5 leads para cada um dos 6 serviços
    for (const service of SERVICES) {
      console.log(`\n📊 Gerando leads para: ${service}`);
      
      // Due Diligence Comercial - usa dados especiais do formulário
      if (service === 'Due Diligence Comercial') {
        for (let i = 0; i < 5; i++) {
          const firstName = randomItem(FIRST_NAMES);
          const lastName = randomItem(LAST_NAMES);
          const company = randomItem(COMPANIES);
          const email = generateEmail(firstName, lastName, company);
          const phone = generatePhone();
          const sessionId = generateSessionId();
          const ddData = DUE_DILIGENCE_DATA[i];

          console.log(`  → Lead ${i + 1}: ${firstName} ${lastName} (${company}) - Due Diligence`);

          try {
            // HubSpot - mensagem formatada com dados do formulário
            const fullMessage = `[Due Diligence Comercial]
Tipo de Transação: ${ddData.transactionType}
Status do Deal: ${ddData.dealStatus}
Perfil do Solicitante: ${ddData.requesterProfile}
Cargo: ${ddData.jobTitle}
Empresa Target: ${ddData.targetCompany}
Segmento: ${ddData.marketSegment}
Modelo de Receita: ${ddData.revenueModel}
Faixa de Receita: ${ddData.targetRevenue}
Objetivos: ${ddData.objectives.join(', ')}
Dados Disponíveis: ${ddData.availableData.join(', ')}
Preocupações: ${ddData.concerns}
Fonte: Alba Chatbot Seed Test`;

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
              console.log(`    ⚠️ Contato já existe, atualizando...`);
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
              console.log(`    ✅ HubSpot ID: ${hubspotId}`);
            }

            // Analytics - dados completos do formulário
            const analyticsData = {
              session_id: sessionId,
              event_type: 'lead_submitted',
              lead_submitted: true,
              messages_count: Math.floor(Math.random() * 8) + 3,
              service_interest: service,
              event_data: {
                lead_name: `${firstName} ${lastName}`,
                lead_email: email,
                lead_company: company,
                lead_phone: phone,
                hubspot_id: hubspotId,
                source: 'seed_test',
                message: ddData.concerns,
                // Campos específicos do Due Diligence
                transaction_type: ddData.transactionType,
                deal_status: ddData.dealStatus,
                requester_profile: ddData.requesterProfile,
                job_title: ddData.jobTitle,
                target_company: ddData.targetCompany,
                market_segment: ddData.marketSegment,
                revenue_model: ddData.revenueModel,
                target_revenue: ddData.targetRevenue,
                objectives: ddData.objectives,
                available_data: ddData.availableData
              }
            };

            await supabase.from('alba_analytics').insert(analyticsData);
            console.log(`    ✅ Analytics registrado`);

            // Evento de sessão
            await supabase.from('alba_analytics').insert({
              session_id: sessionId,
              event_type: 'session_start',
              lead_submitted: false,
              messages_count: 0,
              service_interest: service,
              event_data: { source: 'seed_test' }
            });

            results.push({ service, name: `${firstName} ${lastName}`, email, success: hubspotSuccess });
            await new Promise(resolve => setTimeout(resolve, 300));

          } catch (leadError) {
            const errorMsg = leadError instanceof Error ? leadError.message : 'Unknown error';
            console.error(`    ❌ Erro no lead:`, errorMsg);
            results.push({ service, name: `${firstName} ${lastName}`, email, success: false, error: errorMsg });
          }
        }
        continue; // Próximo serviço
      }

      // Outros serviços - lógica original
      for (let i = 0; i < 5; i++) {
        const firstName = randomItem(FIRST_NAMES);
        const lastName = randomItem(LAST_NAMES);
        const company = randomItem(COMPANIES);
        const role = randomItem(ROLES);
        const email = generateEmail(firstName, lastName, company);
        const phone = generatePhone();
        const message = SERVICE_MESSAGES[service][i];
        const sessionId = generateSessionId();

        console.log(`  → Lead ${i + 1}: ${firstName} ${lastName} (${company})`);

        try {
          // 1. Criar contato no HubSpot (usando apenas campos padrão)
          const fullMessage = `[${service}] ${message} | Cargo: ${role} | Fonte: Alba Chatbot Seed Test`;
          const contactData = {
            properties: {
              email: email,
              firstname: firstName,
              lastname: lastName,
              company: company,
              jobtitle: role,
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
            // Contact exists, try to update
            console.log(`    ⚠️ Contato já existe, atualizando...`);
            
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
            if (searchData.results?.length > 0) {
              hubspotId = searchData.results[0].id;
              hubspotSuccess = true;
            }
          } else if (hubspotResponse.ok) {
            const hubspotResult = await hubspotResponse.json();
            hubspotId = hubspotResult.id;
            console.log(`    ✅ HubSpot ID: ${hubspotId}`);
          } else {
            const errorData = await hubspotResponse.json();
            console.error(`    ❌ Erro HubSpot:`, errorData);
          }

          // 2. Registrar na tabela alba_analytics
          const analyticsData = {
            session_id: sessionId,
            event_type: 'lead_submitted',
            lead_submitted: true,
            messages_count: Math.floor(Math.random() * 8) + 3, // 3-10 mensagens
            service_interest: service,
            event_data: {
              lead_name: `${firstName} ${lastName}`,
              lead_email: email,
              lead_company: company,
              lead_role: role,
              lead_phone: phone,
              hubspot_id: hubspotId,
              source: 'seed_test',
              message: message
            }
          };

          const { error: analyticsError } = await supabase
            .from('alba_analytics')
            .insert(analyticsData);

          if (analyticsError) {
            console.error(`    ❌ Erro Analytics:`, analyticsError);
          } else {
            console.log(`    ✅ Analytics registrado`);
          }

          // Também criar eventos de sessão para simular interação
          const sessionStartData = {
            session_id: sessionId,
            event_type: 'session_start',
            lead_submitted: false,
            messages_count: 0,
            service_interest: service,
            event_data: { source: 'seed_test' }
          };

          await supabase.from('alba_analytics').insert(sessionStartData);

          results.push({
            service,
            name: `${firstName} ${lastName}`,
            email,
            success: hubspotSuccess,
          });

          // Pequeno delay para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 300));

        } catch (leadError) {
          const errorMsg = leadError instanceof Error ? leadError.message : 'Unknown error';
          console.error(`    ❌ Erro no lead:`, errorMsg);
          results.push({
            service,
            name: `${firstName} ${lastName}`,
            email,
            success: false,
            error: errorMsg
          });
        }
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`\n🎉 Seed concluído: ${successful} sucesso, ${failed} falhas`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Seed concluído: ${successful} leads criados, ${failed} falhas`,
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
