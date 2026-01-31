import { Types } from 'mongoose';

type CategoryMap = Record<string, Types.ObjectId>;

export const FINAL_QUESTIONS = (categoryMap: CategoryMap) => [
    // ======================
    // CULTURA POP
    // ======================
    {
        text: 'Primeiro videoclipe do YouTube a ultrapassar 1 bilhão de visualizações',
        answer: 'Gangnam Style',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Cultura Pop'],
    },
    {
        text: 'Ano de lançamento do primeiro iPhone apresentado por Steve Jobs',
        answer: '2007',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Cultura Pop'],
    },
    {
        text: 'Nome do personagem que mais apareceu nos filmes do Universo Cinematográfico da Marvel até 2023',
        answer: 'Nick Fury',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Cultura Pop'],
    },
    {
        text: 'Quantidade aproximada de episódios do anime One Piece até o fim de 2023',
        answer: '1080',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Cultura Pop'],
    },
    {
        text: 'Empresa responsável pelo console portátil Game Boy',
        answer: 'Nintendo',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Cultura Pop'],
    },
    {
        text: 'Ano em que o Facebook deixou de se chamar oficialmente Facebook Inc.',
        answer: '2021',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Cultura Pop'],
    },

    // ======================
    // FILMES E SÉRIES
    // ======================
    {
        text: 'Diretor que venceu o Oscar de Melhor Direção por O Regresso',
        answer: 'Alejandro González Iñárritu',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Filmes e Séries'],
    },
    {
        text: 'Duração em minutos da versão estendida de O Senhor dos Anéis: A Sociedade do Anel',
        answer: '208',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Filmes e Séries'],
    },
    {
        text: 'Série da HBO inspirada em livros de George R. R. Martin',
        answer: 'Game of Thrones',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Filmes e Séries'],
    },
    {
        text: 'Ano de estreia da série Breaking Bad',
        answer: '2008',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Filmes e Séries'],
    },
    {
        text: 'Nome do planeta onde se passa majoritariamente o filme Avatar',
        answer: 'Pandora',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Filmes e Séries'],
    },
    {
        text: 'Quantidade de temporadas da série The Walking Dead',
        answer: '11',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Filmes e Séries'],
    },

    // ======================
    // ESPORTES
    // ======================
    {
        text: 'Único jogador a vencer a Bola de Ouro em três décadas diferentes',
        answer: 'Lionel Messi',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Esportes'],
    },
    {
        text: 'Ano da primeira Copa do Mundo de Futebol masculino',
        answer: '1930',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Esportes'],
    },
    {
        text: 'País sede dos Jogos Olímpicos de 2008',
        answer: 'China',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Esportes'],
    },
    {
        text: 'Quantidade aproximada de medalhas de ouro olímpicas conquistadas por Michael Phelps',
        answer: '23',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Esportes'],
    },
    {
        text: 'Clube com mais títulos da UEFA Champions League até 2023',
        answer: 'Real Madrid',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Esportes'],
    },
    {
        text: 'Ano da estreia de Ayrton Senna na Fórmula 1',
        answer: '1984',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Esportes'],
    },

    // ======================
    // MÚSICA
    // ======================
    {
        text: 'Banda responsável pelo álbum The Dark Side of the Moon',
        answer: 'Pink Floyd',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Música'],
    },
    {
        text: 'Ano de lançamento do álbum Thriller',
        answer: '1982',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Música'],
    },
    {
        text: 'Nome real do artista conhecido como Freddie Mercury',
        answer: 'Farrokh Bulsara',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Música'],
    },
    {
        text: 'Quantidade aproximada de músicas no catálogo dos Beatles',
        answer: '213',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Música'],
    },
    {
        text: 'Festival onde surgiu a expressão Woodstock',
        answer: 'Woodstock Music & Art Fair',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Música'],
    },
    {
        text: 'Ano da morte de Elvis Presley',
        answer: '1977',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Música'],
    },

    // ======================
    // GEOGRAFIA
    // ======================
    {
        text: 'País com maior número de fusos horários oficiais',
        answer: 'França',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Geografia'],
    },
    {
        text: 'Altitude aproximada do Monte Everest em metros',
        answer: '8848',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Geografia'],
    },
    {
        text: 'Capital mais alta do mundo em altitude',
        answer: 'La Paz',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Geografia'],
    },
    {
        text: 'Extensão aproximada da Muralha da China em quilômetros',
        answer: '21000',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Geografia'],
    },
    {
        text: 'País atravessado pela Linha do Equador e pelo Meridiano de Greenwich',
        answer: 'Nenhum',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Geografia'],
    },
    {
        text: 'Número aproximado de países reconhecidos pela ONU',
        answer: '193',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Geografia'],
    },

    // ======================
    // CIÊNCIAS
    // ======================
    {
        text: 'Quantidade de ossos no corpo humano adulto',
        answer: '206',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Ciências'],
    },
    {
        text: 'Ano da descoberta da estrutura do DNA em dupla hélice',
        answer: '1953',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Ciências'],
    },
    {
        text: 'Nome do cientista que formulou a teoria da relatividade',
        answer: 'Albert Einstein',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Ciências'],
    },
    {
        text: 'Velocidade aproximada da luz no vácuo em km por segundo',
        answer: '300000',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Ciências'],
    },
    {
        text: 'Partícula subatômica com carga negativa',
        answer: 'Elétron',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['Ciências'],
    },
    {
        text: 'Número aproximado de neurônios no cérebro humano',
        answer: '86000000000',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['Ciências'],
    },

    // ======================
    // HISTÓRIA
    // ======================
    {
        text: 'Ano da queda do Muro de Berlim',
        answer: '1989',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['História'],
    },
    {
        text: 'Civilização responsável pela escrita cuneiforme',
        answer: 'Sumérios',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['História'],
    },
    {
        text: 'Ano da assinatura da Magna Carta',
        answer: '1215',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['História'],
    },
    {
        text: 'Nome do líder francês derrotado na Batalha de Waterloo',
        answer: 'Napoleão Bonaparte',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['História'],
    },
    {
        text: 'Ano da Proclamação da República no Brasil',
        answer: '1889',
        level: 6,
        type: 'APPROXIMATION',
        categoryId: categoryMap['História'],
    },
    {
        text: 'Império governado por Júlio César',
        answer: 'Império Romano',
        level: 6,
        type: 'STANDARD',
        categoryId: categoryMap['História'],
    },
];