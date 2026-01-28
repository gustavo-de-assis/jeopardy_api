import { Types } from 'mongoose';

type CategoryMap = Record<string, Types.ObjectId>;

export const buildQuestions = (categoryMap: CategoryMap) => [
    // Nível 1
    { text: 'Ano da chegada de Pedro Álvares Cabral ao Brasil', answer: '1500', level: 1, categoryId: categoryMap['História'] },
    { text: 'Civilização responsável pelas pirâmides do Egito', answer: 'Egípcia', level: 1, categoryId: categoryMap['História'] },
    { text: 'País onde surgiu a democracia', answer: 'Grécia', level: 1, categoryId: categoryMap['História'] },
    { text: 'Nome do primeiro imperador do Brasil', answer: 'Dom Pedro I', level: 1, categoryId: categoryMap['História'] },
    { text: 'Evento que marcou o fim da Idade Média', answer: 'Queda de Constantinopla', level: 1, categoryId: categoryMap['História'] },

    // Nível 2
    { text: 'Ano do início da Segunda Guerra Mundial', answer: '1939', level: 2, categoryId: categoryMap['História'] },
    { text: 'Ano da Proclamação da República no Brasil', answer: '1889', level: 2, categoryId: categoryMap['História'] },
    { text: 'Império governado por Júlio César', answer: 'Romano', level: 2, categoryId: categoryMap['História'] },
    { text: 'Tratado que encerrou a Primeira Guerra Mundial', answer: 'Tratado de Versalhes', level: 2, categoryId: categoryMap['História'] },
    { text: 'Explorador que chegou à América em 1492', answer: 'Cristóvão Colombo', level: 2, categoryId: categoryMap['História'] },

    // Nível 3
    { text: 'Dinastia que governou a França durante a Revolução Francesa', answer: 'Bourbon', level: 3, categoryId: categoryMap['História'] },
    { text: 'Ano da Revolução Francesa', answer: '1789', level: 3, categoryId: categoryMap['História'] },
    { text: 'Nome do líder sul-africano contra o apartheid', answer: 'Nelson Mandela', level: 3, categoryId: categoryMap['História'] },
    { text: 'Império que construiu a Muralha da China', answer: 'Chinês', level: 3, categoryId: categoryMap['História'] },
    { text: 'Guerra travada entre Norte e Sul dos Estados Unidos', answer: 'Guerra Civil Americana', level: 3, categoryId: categoryMap['História'] },

    // Nível 4
    { text: 'Nome do plano econômico europeu pós-Segunda Guerra', answer: 'Plano Marshall', level: 4, categoryId: categoryMap['História'] },
    { text: 'Ano da queda do Muro de Berlim', answer: '1989', level: 4, categoryId: categoryMap['História'] },
    { text: 'Civilização pré-colombiana que habitava Machu Picchu', answer: 'Inca', level: 4, categoryId: categoryMap['História'] },
    { text: 'Conflito entre Atenas e Esparta', answer: 'Guerra do Peloponeso', level: 4, categoryId: categoryMap['História'] },
    { text: 'Ano do golpe militar no Brasil', answer: '1964', level: 4, categoryId: categoryMap['História'] },

    // Nível 5
    { text: 'Tratado que dividiu o Novo Mundo entre Portugal e Espanha', answer: 'Tratado de Tordesilhas', level: 5, categoryId: categoryMap['História'] },
    { text: 'Ano da Revolução Russa', answer: '1917', level: 5, categoryId: categoryMap['História'] },
    { text: 'Imperador romano durante o incêndio de Roma', answer: 'Nero', level: 5, categoryId: categoryMap['História'] },
    { text: 'Conferência que definiu fronteiras europeias após a Segunda Guerra', answer: 'Conferência de Yalta', level: 5, categoryId: categoryMap['História'] },
    { text: 'Documento que aboliu oficialmente a escravidão no Brasil', answer: 'Lei Áurea', level: 5, categoryId: categoryMap['História'] },

    // Nível 1
    { text: 'Super-herói conhecido como Homem de Ferro', answer: 'Tony Stark', level: 1, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Personagem da Disney que vive no fundo do mar', answer: 'Ariel', level: 1, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Empresa criadora do Mickey Mouse', answer: 'Disney', level: 1, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Herói conhecido como Homem-Aranha', answer: 'Peter Parker', level: 1, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Vilão principal da saga Star Wars', answer: 'Darth Vader', level: 1, categoryId: categoryMap['Cultura Pop'] },

    // Nível 2
    { text: 'Equipe de heróis formada por Homem de Ferro e Capitão América', answer: 'Vingadores', level: 2, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Cidade fictícia protegida pelo Batman', answer: 'Gotham', level: 2, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Martelo usado por Thor', answer: 'Mjolnir', level: 2, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Personagem verde conhecido por sua força', answer: 'Hulk', level: 2, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Herói da DC conhecido como Homem de Aço', answer: 'Superman', level: 2, categoryId: categoryMap['Cultura Pop'] },

    // Nível 3
    { text: 'Nome do criador do personagem Batman', answer: 'Bob Kane', level: 3, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Universo compartilhado da Marvel nos cinemas', answer: 'MCU', level: 3, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Primeiro filme do universo cinematográfico da Marvel', answer: 'Homem de Ferro', level: 3, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Editora responsável pelos quadrinhos do Superman', answer: 'DC Comics', level: 3, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Personagem da Marvel conhecido como Mercenário Tagarela', answer: 'Deadpool', level: 3, categoryId: categoryMap['Cultura Pop'] },

    // Nível 4
    { text: 'Ano de estreia do primeiro filme dos Vingadores', answer: '2012', level: 4, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Ator que interpretou o Coringa em O Cavaleiro das Trevas', answer: 'Heath Ledger', level: 4, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Personagem da Marvel que controla o tempo', answer: 'Doutor Estranho', level: 4, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Equipe rival dos X-Men liderada por Magneto', answer: 'Irmandade de Mutantes', level: 4, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Primeiro super-herói criado pela Marvel', answer: 'Tocha Humana', level: 4, categoryId: categoryMap['Cultura Pop'] },

    // Nível 5
    { text: 'Nome verdadeiro do Pantera Negra', answer: 'TChalla', level: 5, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Planeta natal do Superman', answer: 'Krypton', level: 5, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Vilão que eliminou metade do universo no MCU', answer: 'Thanos', level: 5, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Saga de quadrinhos que popularizou o multiverso na Marvel', answer: 'Guerras Secretas', level: 5, categoryId: categoryMap['Cultura Pop'] },
    { text: 'Primeira heroína da Marvel', answer: 'Miss Marvel', level: 5, categoryId: categoryMap['Cultura Pop'] },

    // Nível 1
    { text: 'Filme sobre um navio que afundou após colidir com um iceberg', answer: 'Titanic', level: 1, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Série ambientada em um mundo pós-apocalíptico com zumbis', answer: 'The Walking Dead', level: 1, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme com dinossauros criado por Steven Spielberg', answer: 'Jurassic Park', level: 1, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Bruxo protagonista da saga criada por J K Rowling', answer: 'Harry Potter', level: 1, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme da Pixar sobre emoções humanas', answer: 'Divertida Mente', level: 1, categoryId: categoryMap['Filmes e Séries'] },

    // Nível 2
    { text: 'Diretor do filme Avatar', answer: 'James Cameron', level: 2, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Série sobre fabricação de drogas estrelada por Walter White', answer: 'Breaking Bad', level: 2, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme em que um arqueólogo procura a Arca da Aliança', answer: 'Indiana Jones', level: 2, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Saga espacial criada por George Lucas', answer: 'Star Wars', level: 2, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme em que um robô coleta lixo na Terra', answer: 'WALL-E', level: 2, categoryId: categoryMap['Filmes e Séries'] },

    // Nível 3
    { text: 'Série ambientada na cidade fictícia de Hawkins', answer: 'Stranger Things', level: 3, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Ator que interpretou o Coringa em 2019', answer: 'Joaquin Phoenix', level: 3, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme vencedor do Oscar de Melhor Filme em 1994', answer: 'Forrest Gump', level: 3, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Série medieval com dragões e casas nobres', answer: 'Game of Thrones', level: 3, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Diretor do filme Pulp Fiction', answer: 'Quentin Tarantino', level: 3, categoryId: categoryMap['Filmes e Séries'] },

    // Nível 4
    { text: 'Ano de lançamento do primeiro filme Matrix', answer: '1999', level: 4, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme que venceu o Oscar em 2020', answer: 'Parasita', level: 4, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Ator que interpretou Forrest Gump', answer: 'Tom Hanks', level: 4, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Série baseada nos livros de George R R Martin', answer: 'Game of Thrones', level: 4, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme que retrata sonhos dentro de sonhos', answer: 'A Origem', level: 4, categoryId: categoryMap['Filmes e Séries'] },

    // Nível 5
    { text: 'Diretor do filme O Iluminado', answer: 'Stanley Kubrick', level: 5, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Primeiro longa-metragem da Pixar', answer: 'Toy Story', level: 5, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme que popularizou o termo blockbuster', answer: 'Tubarão', level: 5, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Série que se passa na cidade de Albuquerque', answer: 'Breaking Bad', level: 5, categoryId: categoryMap['Filmes e Séries'] },
    { text: 'Filme que venceu o Oscar de Melhor Filme em 1972', answer: 'O Poderoso Chefão', level: 5, categoryId: categoryMap['Filmes e Séries'] },

    // Nível 1
    { text: 'País vencedor da Copa do Mundo de 2002', answer: 'Brasil', level: 1, categoryId: categoryMap['Esportes'] },
    { text: 'Esporte praticado por Pelé', answer: 'Futebol', level: 1, categoryId: categoryMap['Esportes'] },
    { text: 'Atleta conhecido como Rei do Futebol', answer: 'Pelé', level: 1, categoryId: categoryMap['Esportes'] },
    { text: 'Modalidade esportiva com cesta e bola', answer: 'Basquete', level: 1, categoryId: categoryMap['Esportes'] },
    { text: 'Esporte praticado com raquete e bola amarela', answer: 'Tênis', level: 1, categoryId: categoryMap['Esportes'] },

    // Nível 2
    { text: 'Jogador argentino conhecido como La Pulga', answer: 'Lionel Messi', level: 2, categoryId: categoryMap['Esportes'] },
    { text: 'País sede das Olimpíadas de 2016', answer: 'Brasil', level: 2, categoryId: categoryMap['Esportes'] },
    { text: 'Clube brasileiro com mascote Porco', answer: 'Palmeiras', level: 2, categoryId: categoryMap['Esportes'] },
    { text: 'Número de jogadores em campo por time no futebol', answer: '11', level: 2, categoryId: categoryMap['Esportes'] },
    { text: 'Atleta com mais medalhas olímpicas da história', answer: 'Michael Phelps', level: 2, categoryId: categoryMap['Esportes'] },

    // Nível 3
    { text: 'País de origem do judô', answer: 'Japão', level: 3, categoryId: categoryMap['Esportes'] },
    { text: 'Estádio conhecido como Maracanã', answer: 'Jornalista Mário Filho', level: 3, categoryId: categoryMap['Esportes'] },
    { text: 'Piloto brasileiro tricampeão da Fórmula 1', answer: 'Ayrton Senna', level: 3, categoryId: categoryMap['Esportes'] },
    { text: 'Evento esportivo realizado a cada quatro anos', answer: 'Olimpíadas', level: 3, categoryId: categoryMap['Esportes'] },
    { text: 'Clube europeu com mais títulos da Champions League', answer: 'Real Madrid', level: 3, categoryId: categoryMap['Esportes'] },

    // Nível 4
    { text: 'Ano da primeira Copa do Mundo de Futebol', answer: '1930', level: 4, categoryId: categoryMap['Esportes'] },
    { text: 'Jogador que marcou o gol do título do Brasil em 2002', answer: 'Ronaldo', level: 4, categoryId: categoryMap['Esportes'] },
    { text: 'País de origem da Fórmula 1', answer: 'Reino Unido', level: 4, categoryId: categoryMap['Esportes'] },
    { text: 'Seleção vencedora da Copa de 2014', answer: 'Alemanha', level: 4, categoryId: categoryMap['Esportes'] },
    { text: 'Jogador brasileiro conhecido como Bruxo', answer: 'Ronaldinho Gaúcho', level: 4, categoryId: categoryMap['Esportes'] },

    // Nível 5
    { text: 'Clube com mais títulos do Campeonato Brasileiro', answer: 'Palmeiras', level: 5, categoryId: categoryMap['Esportes'] },
    { text: 'Ano do primeiro título mundial do Brasil', answer: '1958', level: 5, categoryId: categoryMap['Esportes'] },
    { text: 'Tenista com mais títulos de Grand Slam na história', answer: 'Novak Djokovic', level: 5, categoryId: categoryMap['Esportes'] },
    { text: 'Cidade sede dos Jogos Olímpicos de 2008', answer: 'Pequim', level: 5, categoryId: categoryMap['Esportes'] },
    { text: 'País com mais medalhas de ouro olímpicas', answer: 'Estados Unidos', level: 5, categoryId: categoryMap['Esportes'] },

    // Nível 1
    { text: 'Banda britânica que lançou Abbey Road', answer: 'The Beatles', level: 1, categoryId: categoryMap['Música'] },
    { text: 'Cantor conhecido como Rei do Pop', answer: 'Michael Jackson', level: 1, categoryId: categoryMap['Música'] },
    { text: 'Gênero musical originado no Brasil', answer: 'Samba', level: 1, categoryId: categoryMap['Música'] },
    { text: 'Cantora de Bad Romance', answer: 'Lady Gaga', level: 1, categoryId: categoryMap['Música'] },
    { text: 'Instrumento com teclas pretas e brancas', answer: 'Piano', level: 1, categoryId: categoryMap['Música'] },

    // Nível 2
    { text: 'Cantor brasileiro conhecido como Rei', answer: 'Roberto Carlos', level: 2, categoryId: categoryMap['Música'] },
    { text: 'Estilo musical associado a Bob Marley', answer: 'Reggae', level: 2, categoryId: categoryMap['Música'] },
    { text: 'Grupo de rock liderado por Freddie Mercury', answer: 'Queen', level: 2, categoryId: categoryMap['Música'] },
    { text: 'Cantora do álbum 21', answer: 'Adele', level: 2, categoryId: categoryMap['Música'] },
    { text: 'Instrumento de sopro com palheta', answer: 'Saxofone', level: 2, categoryId: categoryMap['Música'] },

    // Nível 3
    { text: 'Movimento musical brasileiro dos anos 60', answer: 'Tropicália', level: 3, categoryId: categoryMap['Música'] },
    { text: 'Compositor da Nona Sinfonia', answer: 'Beethoven', level: 3, categoryId: categoryMap['Música'] },
    { text: 'Gênero musical popularizado nos anos 80', answer: 'Pop', level: 3, categoryId: categoryMap['Música'] },
    { text: 'Cantora brasileira conhecida como Rainha do Rock', answer: 'Rita Lee', level: 3, categoryId: categoryMap['Música'] },
    { text: 'Álbum mais vendido da história', answer: 'Thriller', level: 3, categoryId: categoryMap['Música'] },

    // Nível 4
    { text: 'Ano da morte de Elvis Presley', answer: '1977', level: 4, categoryId: categoryMap['Música'] },
    { text: 'Banda brasileira que lançou o álbum Dois', answer: 'Legião Urbana', level: 4, categoryId: categoryMap['Música'] },
    { text: 'Instrumento principal de Jimi Hendrix', answer: 'Guitarra', level: 4, categoryId: categoryMap['Música'] },
    { text: 'Estilo musical com batidas eletrônicas', answer: 'Eletrônica', level: 4, categoryId: categoryMap['Música'] },
    { text: 'Cantor conhecido como Príncipe do Pop', answer: 'Justin Timberlake', level: 4, categoryId: categoryMap['Música'] },

    // Nível 5
    { text: 'Compositor da ópera A Flauta Mágica', answer: 'Mozart', level: 5, categoryId: categoryMap['Música'] },
    { text: 'Primeiro álbum dos Beatles', answer: 'Please Please Me', level: 5, categoryId: categoryMap['Música'] },
    { text: 'Cantora brasileira vencedora de múltiplos Grammys', answer: 'Elis Regina', level: 5, categoryId: categoryMap['Música'] },
    { text: 'Estilo musical surgido em Chicago nos anos 80', answer: 'House', level: 5, categoryId: categoryMap['Música'] },
    { text: 'Festival musical realizado no deserto da Califórnia', answer: 'Coachella', level: 5, categoryId: categoryMap['Música'] },

    // Nível 1
    { text: 'Capital do Brasil', answer: 'Brasília', level: 1, categoryId: categoryMap['Geografia'] },
    { text: 'Maior oceano do planeta', answer: 'Pacífico', level: 1, categoryId: categoryMap['Geografia'] },
    { text: 'Continente onde fica o Egito', answer: 'África', level: 1, categoryId: categoryMap['Geografia'] },
    { text: 'País com formato de bota', answer: 'Itália', level: 1, categoryId: categoryMap['Geografia'] },
    { text: 'Maior país do mundo em extensão territorial', answer: 'Rússia', level: 1, categoryId: categoryMap['Geografia'] },

    // Nível 2
    { text: 'Capital da França', answer: 'Paris', level: 2, categoryId: categoryMap['Geografia'] },
    { text: 'Deserto localizado no norte da África', answer: 'Saara', level: 2, categoryId: categoryMap['Geografia'] },
    { text: 'Rio mais extenso do mundo', answer: 'Amazonas', level: 2, categoryId: categoryMap['Geografia'] },
    { text: 'País mais populoso do mundo', answer: 'China', level: 2, categoryId: categoryMap['Geografia'] },
    { text: 'Capital da Argentina', answer: 'Buenos Aires', level: 2, categoryId: categoryMap['Geografia'] },

    // Nível 3
    { text: 'Cordilheira que atravessa a América do Sul', answer: 'Andes', level: 3, categoryId: categoryMap['Geografia'] },
    { text: 'País onde se localiza Machu Picchu', answer: 'Peru', level: 3, categoryId: categoryMap['Geografia'] },
    { text: 'Capital da Austrália', answer: 'Canberra', level: 3, categoryId: categoryMap['Geografia'] },
    { text: 'Mar entre a Europa e a África', answer: 'Mediterrâneo', level: 3, categoryId: categoryMap['Geografia'] },
    { text: 'País europeu fora da União Europeia', answer: 'Noruega', level: 3, categoryId: categoryMap['Geografia'] },

    // Nível 4
    { text: 'Montanha mais alta do mundo', answer: 'Everest', level: 4, categoryId: categoryMap['Geografia'] },
    { text: 'País com maior número de ilhas', answer: 'Suécia', level: 4, categoryId: categoryMap['Geografia'] },
    { text: 'Capital do Canadá', answer: 'Ottawa', level: 4, categoryId: categoryMap['Geografia'] },
    { text: 'Linha imaginária que divide a Terra em hemisférios', answer: 'Linha do Equador', level: 4, categoryId: categoryMap['Geografia'] },
    { text: 'País onde nasce o rio Nilo', answer: 'Uganda', level: 4, categoryId: categoryMap['Geografia'] },

    // Nível 5
    { text: 'Mar interior localizado na Ásia Central', answer: 'Mar Cáspio', level: 5, categoryId: categoryMap['Geografia'] },
    { text: 'País com maior litoral do mundo', answer: 'Canadá', level: 5, categoryId: categoryMap['Geografia'] },
    { text: 'Capital da Islândia', answer: 'Reykjavík', level: 5, categoryId: categoryMap['Geografia'] },
    { text: 'País africano com três capitais oficiais', answer: 'África do Sul', level: 5, categoryId: categoryMap['Geografia'] },
    { text: 'Ponto mais profundo dos oceanos', answer: 'Fossa das Marianas', level: 5, categoryId: categoryMap['Geografia'] },

    // Nível 1
    { text: 'Planeta conhecido como Planeta Vermelho', answer: 'Marte', level: 1, categoryId: categoryMap['Ciências'] },
    { text: 'Estado físico da água em temperatura ambiente', answer: 'Líquido', level: 1, categoryId: categoryMap['Ciências'] },
    { text: 'Órgão responsável pela respiração', answer: 'Pulmões', level: 1, categoryId: categoryMap['Ciências'] },
    { text: 'Estrela no centro do sistema solar', answer: 'Sol', level: 1, categoryId: categoryMap['Ciências'] },
    { text: 'Ser vivo que produz seu próprio alimento', answer: 'Planta', level: 1, categoryId: categoryMap['Ciências'] },

    // Nível 2
    { text: 'Elemento químico representado por H', answer: 'Hidrogênio', level: 2, categoryId: categoryMap['Ciências'] },
    { text: 'Força que atrai corpos para o centro da Terra', answer: 'Gravidade', level: 2, categoryId: categoryMap['Ciências'] },
    { text: 'Órgão responsável por bombear o sangue', answer: 'Coração', level: 2, categoryId: categoryMap['Ciências'] },
    { text: 'Camada da Terra onde vivemos', answer: 'Crosta', level: 2, categoryId: categoryMap['Ciências'] },
    { text: 'Partícula com carga negativa', answer: 'Elétron', level: 2, categoryId: categoryMap['Ciências'] },

    // Nível 3
    { text: 'Cientista que formulou a teoria da relatividade', answer: 'Albert Einstein', level: 3, categoryId: categoryMap['Ciências'] },
    { text: 'Processo pelo qual plantas produzem energia', answer: 'Fotossíntese', level: 3, categoryId: categoryMap['Ciências'] },
    { text: 'Unidade de medida da corrente elétrica', answer: 'Ampere', level: 3, categoryId: categoryMap['Ciências'] },
    { text: 'Gás mais abundante na atmosfera terrestre', answer: 'Nitrogênio', level: 3, categoryId: categoryMap['Ciências'] },
    { text: 'Sistema responsável pela defesa do organismo', answer: 'Sistema imunológico', level: 3, categoryId: categoryMap['Ciências'] },

    // Nível 4
    { text: 'Estrutura que armazena o material genético', answer: 'DNA', level: 4, categoryId: categoryMap['Ciências'] },
    { text: 'Camada da atmosfera que contém o ozônio', answer: 'Estratosfera', level: 4, categoryId: categoryMap['Ciências'] },
    { text: 'Partícula encontrada no núcleo do átomo sem carga', answer: 'Nêutron', level: 4, categoryId: categoryMap['Ciências'] },
    { text: 'Velocidade aproximada da luz em km por segundo', answer: '300000', level: 4, categoryId: categoryMap['Ciências'] },
    { text: 'Sistema responsável pela digestão', answer: 'Sistema digestório', level: 4, categoryId: categoryMap['Ciências'] },

    // Nível 5
    { text: 'Lei que relaciona força e aceleração', answer: 'Segunda Lei de Newton', level: 5, categoryId: categoryMap['Ciências'] },
    { text: 'Cientista que propôs a seleção natural', answer: 'Charles Darwin', level: 5, categoryId: categoryMap['Ciências'] },
    { text: 'Unidade básica da vida', answer: 'Célula', level: 5, categoryId: categoryMap['Ciências'] },
    { text: 'Fenômeno responsável pelo desvio da luz por gravidade', answer: 'Lente gravitacional', level: 5, categoryId: categoryMap['Ciências'] },
    { text: 'Partícula subatômica com carga positiva', answer: 'Próton', level: 5, categoryId: categoryMap['Ciências'] }
]
