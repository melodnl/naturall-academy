export type Recipe = {
  id: number;
  slug: string;
  number: number;
  category: "facial" | "corporal" | "cabelo" | "maos_pes" | "labios" | "outros";
  difficulty: "facil" | "medio" | "dificil";
  time_minutes: number;
  preservative: string;
  shelf_life_days: number;
  image_emoji: string;
  translations: Record<
    "pt" | "es" | "en",
    {
      title: string;
      description: string;
      ingredients: { name: string; amount: string }[];
      steps: string[];
    }
  >;
};

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    slug: "mascara-argila-verde-detox",
    number: 1,
    category: "facial",
    difficulty: "facil",
    time_minutes: 15,
    preservative: "Cosgard 0,6%",
    shelf_life_days: 60,
    image_emoji: "🧴",
    translations: {
      pt: {
        title: "Máscara de Argila Verde Detox",
        description: "Limpeza profunda para peles oleosas e mistas.",
        ingredients: [
          { name: "Argila verde", amount: "2 colheres de sopa" },
          { name: "Água mineral", amount: "30 ml" },
          { name: "Óleo essencial de melaleuca", amount: "2 gotas" },
        ],
        steps: [
          "Em um bowl de vidro, misture a argila com a água até formar pasta.",
          "Adicione o óleo essencial e mexa com espátula de plástico.",
          "Aplique no rosto evitando contorno dos olhos.",
          "Deixe agir 10 minutos sem deixar secar totalmente.",
          "Remova com água morna e finalize com hidratante.",
        ],
      },
      es: {
        title: "Mascarilla de Arcilla Verde Detox",
        description: "Limpieza profunda para pieles grasas y mixtas.",
        ingredients: [
          { name: "Arcilla verde", amount: "2 cucharadas soperas" },
          { name: "Agua mineral", amount: "30 ml" },
          { name: "Aceite esencial de árbol de té", amount: "2 gotas" },
        ],
        steps: [
          "En un bowl de vidrio, mezcla la arcilla con el agua hasta formar pasta.",
          "Agrega el aceite esencial y mezcla con espátula de plástico.",
          "Aplica en el rostro evitando el contorno de los ojos.",
          "Deja actuar 10 minutos sin dejar secar por completo.",
          "Retira con agua tibia y finaliza con hidratante.",
        ],
      },
      en: {
        title: "Green Clay Detox Mask",
        description: "Deep cleansing for oily and combination skin.",
        ingredients: [
          { name: "Green clay", amount: "2 tablespoons" },
          { name: "Mineral water", amount: "30 ml" },
          { name: "Tea tree essential oil", amount: "2 drops" },
        ],
        steps: [
          "In a glass bowl, mix the clay with the water until it forms a paste.",
          "Add the essential oil and stir with a plastic spatula.",
          "Apply to the face avoiding the eye area.",
          "Let it sit for 10 minutes without letting it dry completely.",
          "Rinse off with warm water and finish with moisturizer.",
        ],
      },
    },
  },
  {
    id: 2,
    slug: "hidratante-corporal-karite-lavanda",
    number: 47,
    category: "corporal",
    difficulty: "medio",
    time_minutes: 30,
    preservative: "Cosgard 0,6%",
    shelf_life_days: 90,
    image_emoji: "🌿",
    translations: {
      pt: {
        title: "Hidratante Corporal de Karité e Lavanda",
        description: "Cremoso, calmante e perfumado para uso diário.",
        ingredients: [
          { name: "Manteiga de karité", amount: "50 g" },
          { name: "Óleo de amêndoas", amount: "30 ml" },
          { name: "Óleo essencial de lavanda", amount: "10 gotas" },
        ],
        steps: [
          "Derreta a manteiga de karité em banho-maria a fogo baixo.",
          "Retire do fogo, adicione o óleo de amêndoas e mexa.",
          "Quando estiver morno, adicione o óleo essencial e o conservante.",
          "Bata na batedeira até virar creme aerado.",
          "Transfira para um pote de vidro esterilizado.",
        ],
      },
      es: {
        title: "Hidratante Corporal de Karité y Lavanda",
        description: "Cremoso, calmante y perfumado para uso diario.",
        ingredients: [
          { name: "Manteca de karité", amount: "50 g" },
          { name: "Aceite de almendras", amount: "30 ml" },
          { name: "Aceite esencial de lavanda", amount: "10 gotas" },
        ],
        steps: [
          "Derrite la manteca de karité a baño maría a fuego bajo.",
          "Retira del fuego, agrega el aceite de almendras y mezcla.",
          "Cuando esté tibio, agrega el aceite esencial y el conservante.",
          "Bate con batidora hasta obtener una crema aireada.",
          "Transfiere a un frasco de vidrio esterilizado.",
        ],
      },
      en: {
        title: "Shea & Lavender Body Moisturizer",
        description: "Creamy, soothing and fragrant for daily use.",
        ingredients: [
          { name: "Shea butter", amount: "50 g" },
          { name: "Almond oil", amount: "30 ml" },
          { name: "Lavender essential oil", amount: "10 drops" },
        ],
        steps: [
          "Melt the shea butter in a double boiler over low heat.",
          "Remove from heat, add the almond oil and stir.",
          "When warm, add the essential oil and preservative.",
          "Whip with a mixer until it becomes an airy cream.",
          "Transfer to a sterilized glass jar.",
        ],
      },
    },
  },
  {
    id: 3,
    slug: "shampoo-solido-camomila-mel",
    number: 122,
    category: "cabelo",
    difficulty: "dificil",
    time_minutes: 60,
    preservative: "Não necessário (sólido)",
    shelf_life_days: 365,
    image_emoji: "🧼",
    translations: {
      pt: {
        title: "Shampoo Sólido de Camomila e Mel",
        description: "Para cabelos claros, brilho natural e sem plástico.",
        ingredients: [
          { name: "SCI (tensoativo)", amount: "60 g" },
          { name: "Decocto de camomila", amount: "20 ml" },
          { name: "Mel", amount: "10 g" },
        ],
        steps: [
          "Em banho-maria, derreta o SCI lentamente.",
          "Adicione o decocto de camomila aos poucos, mexendo.",
          "Acrescente o mel e misture até homogeneizar.",
          "Transfira para forma de silicone e prense.",
          "Deixe secar 48h em local arejado antes de desenformar.",
        ],
      },
      es: {
        title: "Champú Sólido de Manzanilla y Miel",
        description: "Para cabellos claros, brillo natural y sin plástico.",
        ingredients: [
          { name: "SCI (tensoactivo)", amount: "60 g" },
          { name: "Decocción de manzanilla", amount: "20 ml" },
          { name: "Miel", amount: "10 g" },
        ],
        steps: [
          "A baño maría, derrite el SCI lentamente.",
          "Agrega la decocción de manzanilla poco a poco, mezclando.",
          "Añade la miel y mezcla hasta homogeneizar.",
          "Transfiere a molde de silicona y prensa.",
          "Deja secar 48h en lugar ventilado antes de desmoldar.",
        ],
      },
      en: {
        title: "Chamomile & Honey Solid Shampoo",
        description: "For light hair, natural shine and zero plastic.",
        ingredients: [
          { name: "SCI (surfactant)", amount: "60 g" },
          { name: "Chamomile decoction", amount: "20 ml" },
          { name: "Honey", amount: "10 g" },
        ],
        steps: [
          "In a double boiler, slowly melt the SCI.",
          "Gradually add the chamomile decoction, stirring.",
          "Add the honey and mix until homogeneous.",
          "Transfer to a silicone mold and press.",
          "Let dry 48h in a ventilated place before unmolding.",
        ],
      },
    },
  },
  {
    id: 4,
    slug: "creme-maos-aveia",
    number: 201,
    category: "maos_pes",
    difficulty: "facil",
    time_minutes: 20,
    preservative: "Cosgard 0,6%",
    shelf_life_days: 90,
    image_emoji: "🤲",
    translations: {
      pt: {
        title: "Creme de Mãos com Aveia",
        description: "Calmante e reparador para mãos ressecadas.",
        ingredients: [
          { name: "Manteiga de cacau", amount: "20 g" },
          { name: "Aveia em pó", amount: "10 g" },
          { name: "Óleo de coco", amount: "20 ml" },
        ],
        steps: [
          "Derreta a manteiga de cacau e o óleo de coco juntos.",
          "Misture a aveia em pó até ficar uniforme.",
          "Espere esfriar e adicione o conservante.",
          "Envase em pote pequeno de vidro.",
        ],
      },
      es: {
        title: "Crema de Manos con Avena",
        description: "Calmante y reparadora para manos secas.",
        ingredients: [
          { name: "Manteca de cacao", amount: "20 g" },
          { name: "Avena en polvo", amount: "10 g" },
          { name: "Aceite de coco", amount: "20 ml" },
        ],
        steps: [
          "Derrite la manteca de cacao y el aceite de coco juntos.",
          "Mezcla la avena en polvo hasta que quede uniforme.",
          "Espera a que enfríe y agrega el conservante.",
          "Envasa en un frasco pequeño de vidrio.",
        ],
      },
      en: {
        title: "Oat Hand Cream",
        description: "Soothing and repairing for dry hands.",
        ingredients: [
          { name: "Cocoa butter", amount: "20 g" },
          { name: "Powdered oats", amount: "10 g" },
          { name: "Coconut oil", amount: "20 ml" },
        ],
        steps: [
          "Melt the cocoa butter and coconut oil together.",
          "Mix in the powdered oats until uniform.",
          "Wait for it to cool and add the preservative.",
          "Pour into a small glass jar.",
        ],
      },
    },
  },
  {
    id: 5,
    slug: "balm-labial-baunilha",
    number: 280,
    category: "labios",
    difficulty: "facil",
    time_minutes: 15,
    preservative: "Vitamina E",
    shelf_life_days: 180,
    image_emoji: "💋",
    translations: {
      pt: {
        title: "Balm Labial de Baunilha",
        description: "Hidratação intensa com sabor doce e natural.",
        ingredients: [
          { name: "Cera de abelha", amount: "10 g" },
          { name: "Óleo de coco", amount: "15 ml" },
          { name: "Extrato de baunilha", amount: "3 gotas" },
        ],
        steps: [
          "Derreta a cera de abelha em banho-maria.",
          "Acrescente o óleo de coco e mexa.",
          "Retire do fogo, adicione vitamina E e baunilha.",
          "Envase rapidamente em bisnagas ou potinhos.",
        ],
      },
      es: {
        title: "Bálsamo Labial de Vainilla",
        description: "Hidratación intensa con sabor dulce y natural.",
        ingredients: [
          { name: "Cera de abejas", amount: "10 g" },
          { name: "Aceite de coco", amount: "15 ml" },
          { name: "Extracto de vainilla", amount: "3 gotas" },
        ],
        steps: [
          "Derrite la cera de abejas a baño maría.",
          "Agrega el aceite de coco y mezcla.",
          "Retira del fuego, agrega vitamina E y vainilla.",
          "Envasa rápidamente en tubos o frasquitos.",
        ],
      },
      en: {
        title: "Vanilla Lip Balm",
        description: "Deep hydration with a sweet, natural flavor.",
        ingredients: [
          { name: "Beeswax", amount: "10 g" },
          { name: "Coconut oil", amount: "15 ml" },
          { name: "Vanilla extract", amount: "3 drops" },
        ],
        steps: [
          "Melt the beeswax in a double boiler.",
          "Add the coconut oil and stir.",
          "Remove from heat, add vitamin E and vanilla.",
          "Quickly pour into tubes or small jars.",
        ],
      },
    },
  },
  {
    id: 6,
    slug: "perfume-natural-citrus",
    number: 380,
    category: "outros",
    difficulty: "medio",
    time_minutes: 30,
    preservative: "Álcool 70%",
    shelf_life_days: 365,
    image_emoji: "🌸",
    translations: {
      pt: {
        title: "Perfume Natural Citrus Fresh",
        description: "Fragrância cítrica e refrescante para o dia a dia.",
        ingredients: [
          { name: "Álcool de cereais", amount: "80 ml" },
          { name: "Óleo essencial de bergamota", amount: "20 gotas" },
          { name: "Óleo essencial de limão", amount: "15 gotas" },
        ],
        steps: [
          "Em frasco âmbar, adicione os óleos essenciais.",
          "Complete com o álcool de cereais.",
          "Tampe e agite delicadamente.",
          "Deixe maturar 4 semanas em local escuro.",
        ],
      },
      es: {
        title: "Perfume Natural Cítrico Fresco",
        description: "Fragancia cítrica y refrescante para el día a día.",
        ingredients: [
          { name: "Alcohol de cereales", amount: "80 ml" },
          { name: "Aceite esencial de bergamota", amount: "20 gotas" },
          { name: "Aceite esencial de limón", amount: "15 gotas" },
        ],
        steps: [
          "En frasco ámbar, agrega los aceites esenciales.",
          "Completa con el alcohol de cereales.",
          "Tapa y agita suavemente.",
          "Deja madurar 4 semanas en lugar oscuro.",
        ],
      },
      en: {
        title: "Fresh Citrus Natural Perfume",
        description: "Citrusy and refreshing scent for everyday wear.",
        ingredients: [
          { name: "Grain alcohol", amount: "80 ml" },
          { name: "Bergamot essential oil", amount: "20 drops" },
          { name: "Lemon essential oil", amount: "15 drops" },
        ],
        steps: [
          "In an amber bottle, add the essential oils.",
          "Top up with grain alcohol.",
          "Cap and shake gently.",
          "Let it mature for 4 weeks in a dark place.",
        ],
      },
    },
  },
];

export const CATEGORY_META: Record<
  Recipe["category"],
  { count: number; emoji: string; gradient: string }
> = {
  facial: { count: 100, emoji: "✨", gradient: "from-[#1e3a2c] to-[#2d5240]" },
  corporal: { count: 120, emoji: "🌿", gradient: "from-[#2d5240] to-[#1e3a2c]" },
  cabelo: { count: 90, emoji: "💆", gradient: "from-[#b8924f] to-[#d4a96a]" },
  maos_pes: { count: 60, emoji: "🤲", gradient: "from-[#1e3a2c] to-[#b8924f]" },
  labios: { count: 40, emoji: "💋", gradient: "from-[#b8924f] to-[#1e3a2c]" },
  outros: { count: 190, emoji: "🌸", gradient: "from-[#2d5240] to-[#b8924f]" },
};
