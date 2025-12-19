export interface Article {
    slug: string;
    title: string;
    category: string;
    readTime: string;
    description: string;
    content: {
        intro: string;
        sections: {
            heading: string;
            content: string;
            list?: string[];
        }[];
        summary?: string[];
    };
}

export const articlesData: Article[] = [
    {
        slug: "acoes-b3",
        title: "Ações na B3: o que são, como funcionam e como ganhar dinheiro de verdade",
        category: "Investimentos",
        readTime: "12 min",
        description: "Entenda tudo sobre ações brasileiras e como começar a investir na Bolsa de Valores.",
        content: {
            intro: "Investir em ações pode parecer complicado no início, mas é uma das formas mais eficientes de fazer seu dinheiro crescer no longo prazo. Neste guia completo, você vai aprender exatamente o que são ações, como funciona a B3 (a Bolsa de Valores brasileira) e, principalmente, como ganhar dinheiro de verdade com esse tipo de investimento.",
            sections: [
                {
                    heading: "O que são ações?",
                    content: "Ações são pequenos pedaços de uma empresa. Quando você compra uma ação, você se torna sócio daquela companhia, mesmo que seja com uma participação mínima. Isso significa que você passa a ter direito a uma parte dos lucros e também assume os riscos do negócio. Se a empresa vai bem, suas ações tendem a valorizar. Se vai mal, podem desvalorizar."
                },
                {
                    heading: "Como funciona a B3?",
                    content: "A B3 (Brasil, Bolsa, Balcão) é o ambiente onde as ações são negociadas no Brasil. É como um grande mercado onde compradores e vendedores se encontram para fazer negócios. Tudo acontece de forma eletrônica, através de plataformas das corretoras.",
                    list: ["Pregão regular: 10h às 17h", "After-market: 17h30 às 18h", "Liquidação: D+2"]
                },
                {
                    heading: "Como ganhar dinheiro com ações?",
                    content: "Existem duas formas principais de lucrar com ações: valorização e dividendos. A valorização acontece quando você compra uma ação por um preço e vende por um preço maior. Já os dividendos são parte dos lucros que as empresas distribuem aos acionistas periodicamente.",
                    list: ["Valorização: comprar barato e vender caro", "Dividendos: receber parte dos lucros", "JCP: similar aos dividendos", "Bonificações: receber novas ações"]
                },
                {
                    heading: "Tipos de ações",
                    content: "No Brasil, existem principalmente dois tipos: Ordinárias (ON) terminam com 3 e dão direito a voto. Preferenciais (PN) terminam com 4 e têm preferência em dividendos."
                },
                {
                    heading: "Como começar",
                    content: "Abra conta em uma corretora, transfira dinheiro e comece a comprar ações pelo home broker. É mais simples do que parece!",
                    list: ["1. Escolha uma corretora", "2. Abra sua conta online", "3. Transfira dinheiro", "4. Estude empresas", "5. Faça sua primeira compra"]
                }
            ],
            summary: ["Ações são pedaços de empresas", "Ganhe com valorização e dividendos", "Diversifique sempre", "Invista no longo prazo"]
        }
    },
    {
        slug: "fundos-imobiliarios",
        title: "Fundos Imobiliários (FIIs): o jeito mais fácil de receber aluguel todo mês",
        category: "Investimentos",
        readTime: "10 min",
        description: "Descubra como receber renda passiva mensal investindo em imóveis sem precisar comprar um.",
        content: {
            intro: "Imagine receber aluguel todo mês sem precisar comprar um imóvel, sem se preocupar com inquilino inadimplente ou manutenção. Isso é possível com os Fundos Imobiliários (FIIs). Neste guia, você vai entender como funcionam e como começar a investir.",
            sections: [
                {
                    heading: "O que são FIIs?",
                    content: "Fundos Imobiliários são como 'condomínios de investidores' que juntam dinheiro para investir em imóveis ou títulos do setor imobiliário. Você compra cotas do fundo e recebe mensalmente parte dos aluguéis ou rendimentos gerados."
                },
                {
                    heading: "Tipos de FIIs",
                    content: "Existem três tipos principais: FIIs de tijolo (investem em imóveis físicos como shoppings e lajes corporativas), FIIs de papel (investem em títulos como CRIs e LCIs) e FIIs de fundos (investem em cotas de outros FIIs).",
                    list: ["Tijolo: imóveis físicos", "Papel: títulos imobiliários", "Fundos de fundos: cotas de outros FIIs"]
                },
                {
                    heading: "Como ganhar dinheiro",
                    content: "Você ganha de duas formas: recebendo dividendos mensais (aluguéis distribuídos) e com a valorização das cotas na bolsa. Os dividendos são isentos de IR para pessoa física!",
                    list: ["Dividendos mensais isentos de IR", "Valorização das cotas", "Rendimento médio: 0,5% a 1% ao mês"]
                },
                {
                    heading: "Vantagens dos FIIs",
                    content: "Liquidez (vende na bolsa quando quiser), diversificação (acesso a vários imóveis com pouco dinheiro), gestão profissional e isenção de IR nos dividendos.",
                    list: ["Liquidez na B3", "Diversificação automática", "Gestão profissional", "Dividendos isentos de IR"]
                },
                {
                    heading: "Como escolher bons FIIs",
                    content: "Analise o dividend yield (rendimento mensal), a qualidade dos imóveis, a taxa de vacância, o histórico de pagamentos e a liquidez das cotas. Diversifique entre diferentes tipos e setores."
                }
            ],
            summary: ["FIIs permitem investir em imóveis com pouco dinheiro", "Receba dividendos mensais isentos de IR", "Diversifique entre tijolo, papel e fundos de fundos", "Analise dividend yield e vacância"]
        }
    },
    {
        slug: "tesouro-direto",
        title: "Tesouro Direto: guia completo de todos os títulos",
        category: "Investimentos",
        readTime: "11 min",
        description: "Entenda todos os tipos de títulos públicos e como escolher o melhor para seu objetivo.",
        content: {
            intro: "O Tesouro Direto é uma das formas mais seguras de investir no Brasil. São títulos emitidos pelo governo federal, considerados os investimentos de menor risco do país. Vamos entender cada tipo e quando usar cada um.",
            sections: [
                {
                    heading: "O que é Tesouro Direto?",
                    content: "É um programa do governo que permite pessoas físicas comprarem títulos públicos pela internet. Quando você compra um título, está emprestando dinheiro para o governo, que devolve com juros no futuro."
                },
                {
                    heading: "Tesouro Selic",
                    content: "Acompanha a taxa Selic (taxa básica de juros). É o mais seguro e líquido, ideal para reserva de emergência. Rende cerca de 100% do CDI. Pode resgatar a qualquer momento sem perder dinheiro.",
                    list: ["Melhor para: reserva de emergência", "Liquidez: diária", "Risco: baixíssimo", "Rentabilidade: acompanha a Selic"]
                },
                {
                    heading: "Tesouro Prefixado",
                    content: "Você sabe exatamente quanto vai receber no vencimento. Exemplo: 12% ao ano. Ideal quando você acredita que os juros vão cair. Se vender antes do vencimento, pode ganhar ou perder dinheiro.",
                    list: ["Melhor para: objetivos de médio prazo", "Rentabilidade: taxa fixa definida na compra", "Risco: marcação a mercado se vender antes"]
                },
                {
                    heading: "Tesouro IPCA+",
                    content: "Rende IPCA (inflação) + uma taxa fixa. Exemplo: IPCA + 6% ao ano. Protege seu poder de compra e ainda dá ganho real. Ideal para aposentadoria e objetivos de longo prazo.",
                    list: ["Melhor para: longo prazo e aposentadoria", "Rentabilidade: inflação + taxa fixa", "Proteção: mantém poder de compra"]
                },
                {
                    heading: "Como investir",
                    content: "Abra conta em uma corretora, acesse a área de Tesouro Direto, escolha o título adequado ao seu objetivo e prazo, e compre. O investimento mínimo é cerca de R$ 30.",
                    list: ["Investimento mínimo: ~R$ 30", "Custos: taxa B3 de 0,20% ao ano", "Liquidez: pode vender antes do vencimento"]
                }
            ],
            summary: ["Tesouro Selic: reserva de emergência", "Tesouro Prefixado: quando juros vão cair", "Tesouro IPCA+: longo prazo e aposentadoria", "Investimento mais seguro do Brasil"]
        }
    },
    {
        slug: "cdb-lci-lca",
        title: "CDB, LCI e LCA: diferenças reais e como escolher o que rende mais hoje",
        category: "Investimentos",
        readTime: "9 min",
        description: "Compare os principais investimentos de renda fixa e saiba qual escolher.",
        content: {
            intro: "CDB, LCI e LCA são investimentos de renda fixa muito populares no Brasil. Mas qual a diferença entre eles? Qual rende mais? Neste guia, você vai entender tudo e aprender a escolher o melhor para você.",
            sections: [
                {
                    heading: "O que é CDB?",
                    content: "Certificado de Depósito Bancário. Você empresta dinheiro para o banco e recebe juros. Pode ser prefixado, pós-fixado (% do CDI) ou híbrido (IPCA+). Tem IOF nos primeiros 30 dias e IR regressivo.",
                    list: ["Rentabilidade: geralmente % do CDI", "Tributação: IR regressivo (22,5% a 15%)", "Garantia: FGC até R$ 250 mil por CPF e banco"]
                },
                {
                    heading: "O que é LCI?",
                    content: "Letra de Crédito Imobiliário. Funciona como CDB, mas o banco usa o dinheiro para financiar imóveis. A grande vantagem: é isento de IR! Por isso, mesmo rendendo menos que CDB, pode valer mais a pena.",
                    list: ["Rentabilidade: geralmente 80-90% do CDI", "Tributação: ISENTO de IR", "Garantia: FGC até R$ 250 mil", "Prazo mínimo: geralmente 90 dias"]
                },
                {
                    heading: "O que é LCA?",
                    content: "Letra de Crédito do Agronegócio. Igual à LCI, mas o dinheiro financia o agronegócio. Também é isento de IR. Geralmente tem prazos um pouco maiores que LCI.",
                    list: ["Rentabilidade: 80-95% do CDI", "Tributação: ISENTO de IR", "Garantia: FGC até R$ 250 mil", "Prazo mínimo: geralmente 90 dias"]
                },
                {
                    heading: "Qual escolher?",
                    content: "Compare sempre a rentabilidade líquida (depois do IR). Um CDB de 110% do CDI pode render menos que uma LCI de 90% do CDI por causa do imposto. Use calculadoras online para comparar. Considere também o prazo e a liquidez.",
                    list: ["CDB: melhor quando rende acima de 120% do CDI", "LCI/LCA: melhor pela isenção de IR", "Sempre compare rentabilidade líquida", "Verifique prazo de carência e vencimento"]
                }
            ],
            summary: ["CDB: tem IR mas pode render mais", "LCI/LCA: isentos de IR", "Compare sempre rentabilidade líquida", "Todos têm garantia do FGC"]
        }
    },
    {
        slug: "caixinhas-digitais",
        title: "Caixinhas do Nubank, C6, PicPay e Poupança: vale a pena mesmo em 2025/2026?",
        category: "Investimentos",
        readTime: "8 min",
        description: "Análise honesta sobre caixinhas dos bancos digitais e a tradicional poupança.",
        content: {
            intro: "As 'caixinhas' dos bancos digitais viraram febre. Mas será que realmente valem a pena? Vamos comparar com a poupança tradicional e outros investimentos para você decidir com dados reais.",
            sections: [
                {
                    heading: "Caixinhas do Nubank",
                    content: "O Nubank oferece caixinhas que rendem 100% do CDI (equivalente ao Tesouro Selic). É seguro, tem liquidez diária e rende mais que a poupança. Ótimo para organizar dinheiro por objetivos.",
                    list: ["Rentabilidade: 100% do CDI", "Liquidez: diária", "Segurança: garantia do FGC", "Vantagem: organização por objetivos"]
                },
                {
                    heading: "Caixinhas do C6 Bank",
                    content: "Similar ao Nubank, rende 100% do CDI. Permite criar várias caixinhas com objetivos diferentes. Interface intuitiva e fácil de usar.",
                    list: ["Rentabilidade: 100% do CDI", "Liquidez: diária", "Diferencial: planejamento automático"]
                },
                {
                    heading: "PicPay",
                    content: "O PicPay também oferece rendimento automático do saldo. Rende cerca de 100% do CDI. Prático para quem já usa o app no dia a dia.",
                    list: ["Rentabilidade: ~100% do CDI", "Liquidez: imediata", "Vantagem: integração com cashback"]
                },
                {
                    heading: "Poupança tradicional",
                    content: "A poupança rende 70% da Selic quando a taxa está acima de 8,5% ao ano. Com Selic a 11,75%, rende cerca de 8,2% ao ano. As caixinhas rendem cerca de 11,75% ao ano. Diferença significativa!",
                    list: ["Rentabilidade: 70% da Selic (quando >8,5%)", "Perde para caixinhas em ~3,5% ao ano", "Única vantagem: tradição e simplicidade"]
                },
                {
                    heading: "Veredicto 2025/2026",
                    content: "As caixinhas valem MUITO mais a pena que a poupança. Rendem mais, têm a mesma segurança (FGC) e liquidez. A poupança só faz sentido para quem não consegue usar apps ou para valores muito pequenos.",
                    list: ["✅ Caixinhas: rendem ~40% a mais que poupança", "✅ Mesma segurança (FGC)", "✅ Mesma liquidez", "❌ Poupança: só pela tradição"]
                }
            ],
            summary: ["Caixinhas rendem 100% do CDI", "Poupança rende apenas 70% da Selic", "Diferença: ~40% a mais nas caixinhas", "Use caixinhas para reserva de emergência"]
        }
    },
    {
        slug: "previdencia-privada",
        title: "Previdência Privada: quando PGBL ou VGBL fazem sentido na vida real",
        category: "Investimentos",
        readTime: "10 min",
        description: "Entenda quando a previdência privada vale a pena e qual tipo escolher.",
        content: {
            intro: "Previdência privada é cercada de mitos. Muitos dizem que não vale a pena, outros juram que é essencial. A verdade? Depende do seu perfil. Vamos entender quando faz sentido e qual tipo escolher.",
            sections: [
                {
                    heading: "O que é Previdência Privada?",
                    content: "É um investimento de longo prazo focado em aposentadoria. Você faz aportes regulares ou esporádicos e, no futuro, resgata o dinheiro ou recebe uma renda mensal. Existem dois tipos: PGBL e VGBL."
                },
                {
                    heading: "PGBL - Plano Gerador de Benefício Livre",
                    content: "Permite deduzir até 12% da renda bruta anual no IR. Ideal para quem faz declaração completa do IR. No resgate, o IR incide sobre o valor total (principal + rendimentos).",
                    list: ["Vantagem: deduz até 12% no IR", "Para quem: declara IR completo", "Tributação: sobre valor total no resgate", "Economia: pode ser significativa"]
                },
                {
                    heading: "VGBL - Vida Gerador de Benefício Livre",
                    content: "Não permite dedução no IR, mas no resgate o imposto incide apenas sobre os rendimentos. Ideal para quem faz declaração simplificada ou já deduz 12% com PGBL.",
                    list: ["Vantagem: IR só sobre rendimentos", "Para quem: declaração simplificada", "Tributação: apenas sobre ganhos", "Mais flexível para resgates"]
                },
                {
                    heading: "Quando vale a pena?",
                    content: "Faz sentido se: você declara IR completo e pode deduzir 12% (PGBL), quer disciplina forçada para poupar, precisa de planejamento sucessório facilitado, ou tem renda alta e busca benefícios fiscais.",
                    list: ["✅ Declara IR completo com PGBL", "✅ Precisa de disciplina", "✅ Planejamento sucessório", "❌ Taxas altas", "❌ Baixa liquidez"]
                },
                {
                    heading: "Cuidados importantes",
                    content: "Atenção às taxas! Taxa de administração acima de 1% ao ano já é alta. Evite taxa de carregamento. Prefira tabela regressiva de IR (10% após 10 anos) se for longo prazo. Compare com investir por conta própria.",
                    list: ["Taxa de administração: máximo 1% ao ano", "Evite taxa de carregamento", "Tabela regressiva para longo prazo", "Compare com Tesouro IPCA+"]
                }
            ],
            summary: ["PGBL: para quem declara IR completo", "VGBL: para declaração simplificada", "Atenção às taxas de administração", "Vale a pena com planejamento tributário"]
        }
    },
    {
        slug: "criptomoedas",
        title: "Criptomoedas do básico ao avançado",
        category: "Investimentos",
        readTime: "13 min",
        description: "Guia completo sobre Bitcoin, altcoins e como investir com segurança.",
        content: {
            intro: "Criptomoedas são ativos digitais que usam criptografia para segurança. Bitcoin foi a primeira, mas hoje existem milhares. Vamos do básico ao avançado para você entender esse mercado.",
            sections: [
                {
                    heading: "O que são criptomoedas?",
                    content: "São moedas digitais descentralizadas que funcionam em redes blockchain. Não são controladas por governos ou bancos. As transações são registradas em um livro público e imutável.",
                    list: ["Descentralizadas: sem controle de governos", "Blockchain: registro público de transações", "Criptografia: segurança matemática", "Limitadas: oferta controlada por código"]
                },
                {
                    heading: "Bitcoin (BTC)",
                    content: "A primeira e mais conhecida criptomoeda. Criada em 2009, tem oferta limitada a 21 milhões de unidades. É vista como 'ouro digital' e reserva de valor. Mais consolidada e menos volátil que outras cryptos.",
                    list: ["Oferta máxima: 21 milhões", "Dominância: ~40-50% do mercado", "Uso: reserva de valor", "Volatilidade: alta, mas menor que altcoins"]
                },
                {
                    heading: "Ethereum (ETH) e Altcoins",
                    content: "Ethereum é a segunda maior crypto e permite contratos inteligentes. Altcoins são todas as outras criptomoedas além do Bitcoin. Algumas têm projetos sólidos, outras são especulativas.",
                    list: ["Ethereum: contratos inteligentes e DeFi", "Altcoins: milhares de opções", "Maior risco e potencial de retorno", "Pesquise muito antes de investir"]
                },
                {
                    heading: "Como investir com segurança",
                    content: "Use exchanges regulamentadas no Brasil (Mercado Bitcoin, Binance, Foxbit). Comece com Bitcoin. Invista apenas o que pode perder. Use autenticação de dois fatores. Considere carteiras frias para valores altos.",
                    list: ["Exchanges: use regulamentadas", "Comece com Bitcoin", "Invista max 5% do patrimônio", "Segurança: 2FA e carteiras frias"]
                },
                {
                    heading: "Tributação",
                    content: "Ganhos com crypto são tributados em 15% a 22,5% dependendo do valor. Vendas até R$ 35 mil por mês são isentas. Você deve declarar no IR e pagar mensalmente via DARF quando houver lucro.",
                    list: ["Vendas até R$ 35k/mês: isentas", "Acima: 15% a 22,5% sobre lucro", "Declaração obrigatória no IR", "Pagamento via DARF mensal"]
                },
                {
                    heading: "Estratégias avançadas",
                    content: "DCA (Dollar Cost Averaging): compre regularmente valores fixos. HODL: mantenha no longo prazo. Staking: ganhe rendimentos mantendo cryptos. DeFi: finanças descentralizadas com alto risco e retorno.",
                    list: ["DCA: compras regulares", "HODL: longo prazo", "Staking: rendimento passivo", "DeFi: alto risco/retorno"]
                }
            ],
            summary: ["Bitcoin: mais consolidado e seguro", "Altcoins: maior risco e potencial", "Invista max 5% do patrimônio", "Use exchanges regulamentadas", "Declare no IR e pague impostos"]
        }
    },
    {
        slug: "etfs-bdrs",
        title: "ETFs brasileiros e BDRs: invista no mundo inteiro sem sair do Brasil",
        category: "Investimentos",
        readTime: "10 min",
        description: "Aprenda a diversificar globalmente usando a B3.",
        content: {
            intro: "Você sabia que pode investir em Apple, Tesla e Nvidia pela B3? E que pode ter uma carteira global diversificada com um único ativo? Isso é possível com BDRs e ETFs. Vamos entender como funciona.",
            sections: [
                {
                    heading: "O que são ETFs?",
                    content: "Exchange Traded Funds são fundos de índice negociados na bolsa. Você compra uma cota e automaticamente investe em dezenas ou centenas de ações. É diversificação instantânea com baixo custo.",
                    list: ["Diversificação automática", "Baixo custo (taxa ~0,2% ao ano)", "Liquidez na bolsa", "Transparência total"]
                },
                {
                    heading: "ETFs brasileiros populares",
                    content: "BOVA11 replica o Ibovespa (principais ações brasileiras). SMAL11 replica small caps. IVVB11 replica o S&P 500 (500 maiores empresas dos EUA). HASH11 investe em criptomoedas.",
                    list: ["BOVA11: Ibovespa completo", "SMAL11: small caps brasileiras", "IVVB11: S&P 500 em reais", "HASH11: criptomoedas"]
                },
                {
                    heading: "O que são BDRs?",
                    content: "Brazilian Depositary Receipts são recibos de ações estrangeiras negociados na B3. Você compra em reais, mas está investindo na empresa americana. Exemplo: AAPL34 é a Apple.",
                    list: ["Ações estrangeiras na B3", "Compra e venda em reais", "Código termina em 34 ou 35", "Exposição ao dólar"]
                },
                {
                    heading: "BDRs populares",
                    content: "AAPL34 (Apple), TSLA34 (Tesla), NVDC34 (Nvidia), MSFT34 (Microsoft), GOGL34 (Google), AMZO34 (Amazon). Você investe nas maiores empresas do mundo sem abrir conta no exterior.",
                    list: ["AAPL34: Apple", "TSLA34: Tesla", "NVDC34: Nvidia", "MSFT34: Microsoft", "GOGL34: Google"]
                },
                {
                    heading: "Vantagens e desvantagens",
                    content: "Vantagens: facilidade (tudo em reais na B3), diversificação global, exposição ao dólar. Desvantagens: custos um pouco maiores que investir direto no exterior, não recebe dividendos em dólar.",
                    list: ["✅ Praticidade total", "✅ Diversificação global", "✅ Proteção cambial", "❌ Custos maiores que exterior", "❌ Dividendos em reais"]
                },
                {
                    heading: "Tributação",
                    content: "ETFs e BDRs seguem as mesmas regras de ações: vendas até R$ 20 mil/mês isentas, acima disso 15% de IR sobre o lucro. Dividendos de BDRs têm IR retido na fonte.",
                    list: ["Vendas até R$ 20k/mês: isentas", "Acima: 15% sobre lucro", "Dividendos de BDRs: IR na fonte"]
                }
            ],
            summary: ["ETFs: diversificação instantânea", "BDRs: ações estrangeiras em reais", "Invista no mundo todo pela B3", "Mesma tributação de ações"]
        }
    },
    {
        slug: "fundos-investimento",
        title: "Fundos de investimento: quando usar e quando fugir",
        category: "Investimentos",
        readTime: "9 min",
        description: "Entenda os prós e contras dos fundos de investimento.",
        content: {
            intro: "Fundos de investimento são muito vendidos por bancos, mas será que valem a pena? Quando fazem sentido e quando é melhor investir por conta própria? Vamos analisar com honestidade.",
            sections: [
                {
                    heading: "O que são fundos de investimento?",
                    content: "São 'condomínios de investidores' geridos por profissionais. Você compra cotas e o gestor investe o dinheiro em diversos ativos. Existem fundos de ações, renda fixa, multimercado, imobiliários, etc.",
                    list: ["Gestão profissional", "Diversificação automática", "Vários tipos disponíveis", "Cobrança de taxas"]
                },
                {
                    heading: "Tipos principais",
                    content: "Fundos de Renda Fixa investem em títulos de baixo risco. Fundos de Ações investem na bolsa. Multimercado combinam várias estratégias. Fundos Imobiliários (FIIs) investem em imóveis.",
                    list: ["Renda Fixa: baixo risco", "Ações: alto risco/retorno", "Multimercado: estratégias variadas", "FIIs: imóveis e rendimentos"]
                },
                {
                    heading: "Quando usar fundos",
                    content: "Fazem sentido quando: você não tem tempo ou conhecimento para investir sozinho, quer acesso a estratégias sofisticadas, precisa de gestão profissional ativa, ou busca fundos específicos como FIIs.",
                    list: ["✅ Falta de tempo/conhecimento", "✅ Estratégias sofisticadas", "✅ FIIs para renda passiva", "✅ Multimercado de qualidade"]
                },
                {
                    heading: "Quando fugir",
                    content: "Evite fundos com: taxa de administração acima de 2% ao ano, taxa de performance abusiva, rentabilidade consistentemente abaixo do CDI ou Ibovespa, falta de transparência, ou quando você pode replicar sozinho com ETFs.",
                    list: ["❌ Taxa admin > 2% ao ano", "❌ Rentabilidade ruim", "❌ Falta de transparência", "❌ Pode fazer sozinho com ETF"]
                },
                {
                    heading: "Alternativas melhores",
                    content: "Para renda fixa: Tesouro Direto, CDBs, LCI/LCA diretos. Para ações: ETFs como BOVA11 ou ações individuais. Para diversificação global: ETFs internacionais e BDRs. Custos muito menores!",
                    list: ["Renda fixa: Tesouro e CDBs", "Ações: ETFs ou direto", "Global: ETFs e BDRs", "Economia: até 2% ao ano"]
                }
            ],
            summary: ["Fundos: gestão profissional com custo", "Atenção às taxas de administração", "ETFs são alternativa mais barata", "Use fundos apenas quando agregar valor real"]
        }
    },
    {
        slug: "acoes-americanas",
        title: "Ações americanas de verdade (Apple, Tesla, Nvidia)",
        category: "Investimentos",
        readTime: "11 min",
        description: "Como investir diretamente nas maiores empresas do mundo.",
        content: {
            intro: "Investir em ações americanas não é mais privilégio de grandes investidores. Hoje você pode ter Apple, Tesla e Nvidia na sua carteira. Vamos entender como funciona, custos envolvidos e se vale a pena.",
            sections: [
                {
                    heading: "Por que investir nos EUA?",
                    content: "O mercado americano tem as maiores e mais inovadoras empresas do mundo. Diversificação geográfica protege contra riscos do Brasil. Dólar é proteção cambial. Mercado mais maduro e regulado.",
                    list: ["Maiores empresas do mundo", "Diversificação geográfica", "Proteção cambial (dólar)", "Mercado mais maduro"]
                },
                {
                    heading: "BDRs vs Ações diretas",
                    content: "BDRs são mais fáceis (compra na B3 em reais) mas têm custos maiores. Ações diretas exigem conta no exterior mas têm custos menores e você recebe dividendos em dólar. Para valores acima de R$ 10 mil, ações diretas compensam.",
                    list: ["BDRs: facilidade, custos maiores", "Diretas: custos menores, mais complexo", "Acima de R$ 10k: diretas compensam"]
                },
                {
                    heading: "Como abrir conta no exterior",
                    content: "Corretoras como Avenue, Nomad e Inter oferecem contas internacionais. O processo é online, leva poucos dias, e você pode enviar dinheiro do Brasil. Custos de câmbio variam de 1% a 3%.",
                    list: ["Avenue, Nomad, Inter", "Abertura online em dias", "Envio de dinheiro do Brasil", "Câmbio: 1% a 3%"]
                },
                {
                    heading: "Ações mais populares",
                    content: "Apple (AAPL): tecnologia e inovação. Tesla (TSLA): veículos elétricos. Nvidia (NVDA): chips e IA. Microsoft (MSFT): software e cloud. Amazon (AMZN): e-commerce e cloud. Google (GOOGL): buscas e publicidade.",
                    list: ["AAPL: Apple", "TSLA: Tesla", "NVDA: Nvidia", "MSFT: Microsoft", "AMZN: Amazon", "GOOGL: Google"]
                },
                {
                    heading: "Tributação",
                    content: "Ações no exterior têm tributação diferente. Você paga 15% de IR na fonte sobre dividendos nos EUA. No Brasil, paga 15% sobre lucro na venda (sem isenção de R$ 20 mil). Deve declarar no IR e pagar via DARF mensalmente.",
                    list: ["Dividendos: 15% nos EUA + ajuste no BR", "Vendas: 15% sobre lucro (sem isenção)", "Declaração obrigatória no IR", "DARF mensal quando houver lucro"]
                },
                {
                    heading: "Vale a pena?",
                    content: "Sim, para diversificação e exposição às maiores empresas do mundo. Recomendado ter 20-30% da carteira em ativos internacionais. Comece com BDRs se tiver pouco capital, migre para ações diretas com mais de R$ 10 mil.",
                    list: ["✅ Diversificação essencial", "✅ 20-30% da carteira", "Até R$ 10k: BDRs", "Acima R$ 10k: ações diretas"]
                }
            ],
            summary: ["Invista nas maiores empresas do mundo", "BDRs para começar, diretas para valores maiores", "Diversificação geográfica é essencial", "Tributação diferente de ações BR"]
        }
    }
];
