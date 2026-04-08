// EduStack — js/data/class9_science.js
// Chemistry and Biology for Class 9 CBSE

window.QB = window.QB || {};

// ── CLASS 9 CHEMISTRY ──────────────────────────────────────
window.QB["9_CBSE_Chemistry"] = {
  subject: "Chemistry",
  class: "9",
  board: "CBSE",
  chapters: [
    {
      id: "9c1",
      name: "Matter in Our Surroundings",
      theory: {
        keyPoints: [
          "Matter is anything that has mass and occupies space.",
          "States of matter: Solid, Liquid, Gas. (Plasma and Bose-Einstein Condensate are other states.)",
          "Solids: definite shape, definite volume, incompressible, rigid.",
          "Liquids: no definite shape, definite volume, can flow.",
          "Gases: no definite shape, no definite volume, highly compressible.",
          "Interconversion of states: melting, freezing, evaporation, condensation, sublimation, deposition.",
          "Melting point: temperature at which solid converts to liquid at 1 atm.",
          "Boiling point: temperature at which liquid converts to vapour at 1 atm.",
          "Latent heat: heat absorbed/released during change of state without temperature change.",
          "Evaporation causes cooling (used in sweating, desert coolers).",
          "Rate of evaporation increases with: higher temperature, larger surface area, lower humidity, higher wind speed."
        ],
        formulae: [
          "None specific — conceptual chapter",
          "Temperature conversion: K = °C + 273",
          "0°C = 273 K (melting point of ice)",
          "100°C = 373 K (boiling point of water)"
        ],
        remember: [
          "Dry ice is solid CO₂ — it sublimates directly.",
          "Latent heat of fusion of ice = 334 J/g",
          "Latent heat of vaporisation of water = 2260 J/g",
          "Boiling point of water = 100°C = 373 K",
          "Melting point of ice = 0°C = 273 K",
          "Naphthalene (camphor) sublimes."
        ]
      },
      questions: [
        { id:"9c1q1", text:"Which state of matter has definite shape and definite volume?", options:["Gas","Liquid","Solid","Plasma"], answer:2, difficulty:"easy", explanation:"Solids have both definite shape and definite volume because their particles are tightly packed and can only vibrate in fixed positions." },
        { id:"9c1q2", text:"The process of conversion of solid directly into gas is called:", options:["Evaporation","Condensation","Sublimation","Melting"], answer:2, difficulty:"easy", explanation:"Sublimation is the direct conversion of solid to gas without passing through the liquid state. Example: camphor, dry ice (CO₂)." },
        { id:"9c1q3", text:"0°C in Kelvin scale is:", options:["0 K","100 K","273 K","373 K"], answer:2, difficulty:"easy", explanation:"K = °C + 273. So 0°C = 0 + 273 = 273 K." },
        { id:"9c1q4", text:"Evaporation causes cooling because:", options:["Liquid loses heat","High energy particles escape taking heat away","Temperature increases","Volume decreases"], answer:1, difficulty:"medium", explanation:"During evaporation, higher energy particles escape the liquid surface, taking away energy (heat) from the remaining liquid, causing it to cool." },
        { id:"9c1q5", text:"Which of the following has the highest rate of diffusion?", options:["Solid","Liquid","Gas","All equal"], answer:2, difficulty:"easy", explanation:"Gases have maximum interparticle space and highest kinetic energy, so they diffuse the fastest among solids, liquids, and gases." },
        { id:"9c1q6", text:"The latent heat of vaporisation is the heat energy required to change:", options:["Solid to liquid","Liquid to gas at boiling point without change in temperature","Gas to liquid","Solid to gas"], answer:1, difficulty:"medium", explanation:"Latent heat of vaporisation is the heat absorbed at constant temperature (boiling point) to convert liquid to vapour." },
        { id:"9c1q7", text:"A desert cooler works on the principle of:", options:["Condensation","Evaporation","Sublimation","Boiling"], answer:1, difficulty:"medium", explanation:"A desert cooler uses evaporation of water to cool the surrounding air. Evaporation absorbs heat from the surroundings, causing cooling." },
        { id:"9c1q8", text:"Compressed natural gas (CNG) is an example of:", options:["Solid at high pressure","Gas compressed into liquid/gas form","Liquid","Plasma"], answer:1, difficulty:"medium", explanation:"CNG is natural gas (methane) compressed to high pressure. Gases are highly compressible — this property is used in CNG cylinders." },
        { id:"9c1q9", text:"Which factor does NOT increase the rate of evaporation?", options:["Increase in temperature","Increase in surface area","Increase in humidity","Increase in wind speed"], answer:2, difficulty:"hard", explanation:"Higher humidity means more water vapour is already in the air, which actually decreases the rate of evaporation. The other factors increase evaporation." },
        { id:"9c1q10", text:"Boiling point of water at high altitude (low pressure) will:", options:["Increase","Decrease","Remain same","First increase then decrease"], answer:1, difficulty:"hard", explanation:"Boiling point decreases at higher altitude because atmospheric pressure decreases. Water boils at less than 100°C on mountains — this is why cooking takes longer at high altitudes." }
      ]
    },
    {
      id: "9c2",
      name: "Is Matter Around Us Pure?",
      theory: {
        keyPoints: [
          "Pure substance: has fixed composition and properties. Examples: gold, water, NaCl.",
          "Mixture: contains two or more substances. Examples: air, seawater, alloys.",
          "Homogeneous mixture: uniform composition throughout. Example: salt solution.",
          "Heterogeneous mixture: non-uniform composition. Example: soil, salad.",
          "Solution: homogeneous mixture of solute and solvent.",
          "Solubility: maximum amount of solute that dissolves in 100g solvent at a given temperature.",
          "Concentration = mass of solute / volume of solution × 100%",
          "Suspension: heterogeneous mixture where particles > 100 nm settle on standing.",
          "Colloid: particles between 1-100 nm, do not settle. Show Tyndall effect.",
          "Tyndall effect: scattering of light by colloid particles.",
          "Elements: cannot be broken down into simpler substances. 118 known elements.",
          "Compounds: formed by chemical combination of two or more elements in fixed ratio.",
          "Separation methods: evaporation, filtration, distillation, fractional distillation, chromatography, sublimation."
        ],
        formulae: [
          "Mass % of solute = (mass of solute / mass of solution) × 100",
          "Concentration (g/L) = mass of solute (g) / volume of solution (L)"
        ],
        remember: [
          "Colloids show Tyndall effect; true solutions do not.",
          "Brass = copper + zinc (alloy)",
          "Bronze = copper + tin (alloy)",
          "Steel = iron + carbon",
          "Mixtures can be separated by physical methods; compounds cannot.",
          "Water (H₂O) is a compound, not an element."
        ]
      },
      questions: [
        { id:"9c2q1", text:"Which of the following is a pure substance?", options:["Air","Sea water","Copper","Smoke"], answer:2, difficulty:"easy", explanation:"Copper is a pure element with fixed composition and properties. Air, seawater, and smoke are mixtures." },
        { id:"9c2q2", text:"The Tyndall effect is observed in:", options:["True solutions","Colloids","Suspensions","Both colloids and suspensions"], answer:1, difficulty:"medium", explanation:"The Tyndall effect (scattering of light) is characteristic of colloids. The colloidal particles scatter the beam of light, making it visible. True solutions don't show this effect." },
        { id:"9c2q3", text:"Brass is an alloy of:", options:["Copper and tin","Iron and carbon","Copper and zinc","Copper and nickel"], answer:2, difficulty:"easy", explanation:"Brass is an alloy of copper and zinc. Bronze is copper + tin. Steel is iron + carbon." },
        { id:"9c2q4", text:"Which separation technique is used to separate two miscible liquids with different boiling points?", options:["Filtration","Distillation","Chromatography","Crystallisation"], answer:1, difficulty:"medium", explanation:"Distillation separates miscible liquids with different boiling points. The one with lower boiling point evaporates first and is collected separately." },
        { id:"9c2q5", text:"A solution contains 5g of salt in 100g of water. The mass percentage of salt is:", options:["5%","4.76%","10%","50%"], answer:1, difficulty:"medium", explanation:"Mass of solution = 5+100 = 105g. Mass % = (5/105)×100 = 4.76%" },
        { id:"9c2q6", text:"Which is NOT a characteristic of compounds?", options:["Fixed composition","Can be separated by physical methods","Properties different from elements","Formed by chemical combination"], answer:1, difficulty:"hard", explanation:"Compounds CANNOT be separated by physical methods — they require chemical methods. Mixtures can be separated by physical methods." },
        { id:"9c2q7", text:"Chromatography is used to separate:", options:["Immiscible liquids","Coloured components of a dye","Filterable solids","Alloys"], answer:1, difficulty:"medium", explanation:"Chromatography separates components of a mixture based on their different rates of movement through an absorbent material. It is commonly used to separate colours in dyes." },
        { id:"9c2q8", text:"The sky appears blue because of:", options:["Reflection of light from sea","Tyndall effect — scattering of light by dust/gas molecules","Refraction","Blue colour of atmosphere"], answer:1, difficulty:"hard", explanation:"The blue colour of the sky is due to the Tyndall effect — small gas molecules and dust particles in the atmosphere scatter shorter wavelengths (blue) more than longer wavelengths (red)." }
      ]
    }
  ]
};

// ── CLASS 9 BIOLOGY ────────────────────────────────────────
window.QB["9_CBSE_Biology"] = {
  subject: "Biology",
  class: "9",
  board: "CBSE",
  chapters: [
    {
      id: "9b1",
      name: "The Fundamental Unit of Life",
      theory: {
        keyPoints: [
          "Cell is the basic structural and functional unit of life.",
          "Cell theory: All living organisms are made of cells; cell is the basic unit of life; all cells arise from pre-existing cells.",
          "Robert Hooke (1665) discovered cells in dead cork.",
          "Anton von Leeuwenhoek observed living cells.",
          "Prokaryotic cells: no membrane-bound nucleus (bacteria, cyanobacteria).",
          "Eukaryotic cells: membrane-bound nucleus (plants, animals, fungi).",
          "Plant cells have: cell wall, large vacuole, chloroplasts. Animal cells do NOT have these.",
          "Animal cells have: centrioles (absent in most plant cells).",
          "Nucleus: controls all cell activities, contains DNA, bounded by nuclear membrane.",
          "Mitochondria: powerhouse of cell — site of cellular respiration (ATP production).",
          "Chloroplasts: site of photosynthesis (green plastids in plants).",
          "Endoplasmic Reticulum (ER): transport system of cell. Rough ER (ribosomes) makes proteins. Smooth ER makes lipids.",
          "Golgi apparatus: packing and dispatching of materials (post office of cell).",
          "Lysosomes: contain digestive enzymes — suicidal bags of cell.",
          "Vacuoles: storage organelles. Large in plants; small in animals.",
          "Ribosomes: site of protein synthesis.",
          "Osmosis: movement of water through semi-permeable membrane from high to low water concentration.",
          "Plasmolysis: shrinkage of cytoplasm due to loss of water in hypertonic solution."
        ],
        formulae: [],
        remember: [
          "Largest cell: ostrich egg",
          "Smallest cell: Mycoplasma (PPLO)",
          "Longest cell: nerve cell (neuron)",
          "Cell wall is made of cellulose in plants.",
          "Mitochondria and chloroplasts have their own DNA.",
          "Nucleus is called the control centre of the cell."
        ]
      },
      questions: [
        { id:"9b1q1", text:"Who discovered cells?", options:["Robert Brown","Anton von Leeuwenhoek","Robert Hooke","Matthias Schleiden"], answer:2, difficulty:"easy", explanation:"Robert Hooke discovered cells in 1665 when he observed dead cork cells under a microscope and named them 'cells' due to their resemblance to monk's cells." },
        { id:"9b1q2", text:"The powerhouse of the cell is:", options:["Nucleus","Ribosome","Mitochondria","Golgi apparatus"], answer:2, difficulty:"easy", explanation:"Mitochondria produce ATP (energy currency) through cellular respiration, earning them the name 'powerhouse of the cell'." },
        { id:"9b1q3", text:"Which organelle is known as the 'suicidal bag' of the cell?", options:["Mitochondria","Golgi apparatus","Lysosome","Vacuole"], answer:2, difficulty:"easy", explanation:"Lysosomes contain digestive enzymes that can digest the cell itself if it is damaged — hence called 'suicidal bags'. They help in cellular digestion." },
        { id:"9b1q4", text:"Which of the following is ABSENT in animal cells?", options:["Mitochondria","Cell wall","Ribosome","Golgi apparatus"], answer:1, difficulty:"easy", explanation:"Animal cells do not have a cell wall (or chloroplasts or large vacuoles). Cell wall is present in plant cells, bacteria, and fungi." },
        { id:"9b1q5", text:"Osmosis is defined as the movement of water from:", options:["Concentrated to dilute solution","Dilute to concentrated solution through semi-permeable membrane","High to low temperature","Cell to environment"], answer:1, difficulty:"medium", explanation:"Osmosis is the movement of water (solvent) from a region of higher water concentration (dilute solution) to lower water concentration (concentrated solution) through a semi-permeable membrane." },
        { id:"9b1q6", text:"Ribosomes are the site of:", options:["Energy production","Protein synthesis","Lipid synthesis","Photosynthesis"], answer:1, difficulty:"easy", explanation:"Ribosomes are tiny organelles (found in all cells — prokaryotic and eukaryotic) where protein synthesis occurs." },
        { id:"9b1q7", text:"Plasmolysis occurs when a cell is placed in:", options:["Hypotonic solution","Isotonic solution","Hypertonic solution","Distilled water"], answer:2, difficulty:"medium", explanation:"In hypertonic solution (more concentration outside), water moves out of the cell by osmosis, causing the cell membrane to shrink away from cell wall — this is plasmolysis." },
        { id:"9b1q8", text:"The control centre of the cell is:", options:["Mitochondria","Ribosome","Nucleus","Chloroplast"], answer:2, difficulty:"easy", explanation:"The nucleus controls all cell activities as it contains DNA (genetic material) that directs all cellular processes." },
        { id:"9b1q9", text:"Prokaryotic cells differ from eukaryotic cells in that they:", options:["Have no mitochondria only","Lack a membrane-bound nucleus","Have smaller ribosomes only","Both B and C are correct"], answer:3, difficulty:"hard", explanation:"Prokaryotic cells lack a membrane-bound nucleus AND have smaller (70S) ribosomes compared to eukaryotic (80S) ribosomes. They also have no membrane-bound organelles." },
        { id:"9b1q10", text:"Which organelle is responsible for photosynthesis?", options:["Mitochondria","Chloroplast","Nucleus","Vacuole"], answer:1, difficulty:"easy", explanation:"Chloroplasts contain chlorophyll and are the sites of photosynthesis — where sunlight is converted into chemical energy (glucose)." },
        { id:"9b1q11", text:"The cell organelle that acts as the 'post office' of the cell is:", options:["Endoplasmic Reticulum","Lysosome","Golgi apparatus","Ribosome"], answer:2, difficulty:"medium", explanation:"The Golgi apparatus modifies, packages, and dispatches proteins and lipids to their destinations (inside or outside the cell), like a post office." },
        { id:"9b1q12", text:"Which is the largest organelle in a plant cell?", options:["Nucleus","Chloroplast","Central vacuole","Mitochondria"], answer:2, difficulty:"medium", explanation:"The central vacuole in a mature plant cell can occupy up to 90% of the cell volume, making it the largest organelle in most plant cells." }
      ]
    },
    {
      id: "9b2",
      name: "Tissues",
      theory: {
        keyPoints: [
          "Tissue: a group of cells with similar structure and function.",
          "Plant tissues: Meristematic (dividing) and Permanent (non-dividing).",
          "Meristematic tissue: actively dividing cells. Types: apical, lateral, intercalary.",
          "Permanent tissues: Simple (parenchyma, collenchyma, sclerenchyma) and Complex (xylem, phloem).",
          "Parenchyma: living, thin-walled, stores food, fills spaces.",
          "Collenchyma: living, irregularly thickened walls, provides flexibility.",
          "Sclerenchyma: dead, thick walls (lignin), provides mechanical support (fibres, sclereids).",
          "Xylem: transports water and minerals upward (vessels, tracheids, xylem fibres, xylem parenchyma).",
          "Phloem: transports food (sieve tubes, companion cells, phloem fibres, phloem parenchyma).",
          "Animal tissues: Epithelial, Connective, Muscular, Nervous.",
          "Epithelial tissue: covers body surfaces and internal organs.",
          "Connective tissue: connects and supports (blood, bone, cartilage, areolar).",
          "Muscular tissue: striated (voluntary), smooth (involuntary), cardiac (heart).",
          "Nervous tissue: neurons transmit electrical impulses."
        ],
        formulae: [],
        remember: [
          "Xylem conducts water upward; phloem conducts food downward.",
          "Cork (bark) is made of dead cells filled with suberin.",
          "Cartilage has no blood vessels.",
          "Cardiac muscle is involuntary and never fatigues.",
          "Neurons are the longest cells in the body."
        ]
      },
      questions: [
        { id:"9b2q1", text:"Which tissue transports water from roots to leaves?", options:["Phloem","Xylem","Parenchyma","Collenchyma"], answer:1, difficulty:"easy", explanation:"Xylem is responsible for the upward transport of water and dissolved minerals from roots to leaves through a process called transpiration pull." },
        { id:"9b2q2", text:"Which type of muscle tissue is found in the heart?", options:["Striated (voluntary)","Smooth (involuntary)","Cardiac","Both striated and smooth"], answer:2, difficulty:"easy", explanation:"Cardiac muscle is unique to the heart. It is involuntary (we cannot control it) and striated, and it never fatigues under normal conditions." },
        { id:"9b2q3", text:"Meristematic tissue is characterized by:", options:["Dead cells","Actively dividing cells","No nucleus","Thick lignified walls"], answer:1, difficulty:"easy", explanation:"Meristematic tissue consists of actively dividing cells responsible for growth in plants. These cells have a prominent nucleus and dense cytoplasm." },
        { id:"9b2q4", text:"Which of the following is a complex permanent tissue?", options:["Parenchyma","Collenchyma","Sclerenchyma","Phloem"], answer:3, difficulty:"medium", explanation:"Phloem (and xylem) are complex permanent tissues because they are made of more than one type of cell working together. Parenchyma, collenchyma, and sclerenchyma are simple tissues." },
        { id:"9b2q5", text:"The tissue that provides mechanical support and flexibility to plants is:", options:["Parenchyma","Collenchyma","Sclerenchyma","Xylem"], answer:1, difficulty:"medium", explanation:"Collenchyma provides flexibility and mechanical support, especially in young plants. It has irregularly thickened cell walls that allow bending without breaking." },
        { id:"9b2q6", text:"Blood is which type of tissue?", options:["Epithelial","Muscular","Connective","Nervous"], answer:2, difficulty:"medium", explanation:"Blood is a connective tissue (fluid connective tissue). It connects and transports substances throughout the body, linking various organs." },
        { id:"9b2q7", text:"Sclerenchyma differs from collenchyma in that:", options:["Sclerenchyma is living","Sclerenchyma cells are dead with thick lignified walls","Sclerenchyma provides flexibility","Sclerenchyma stores food"], answer:1, difficulty:"hard", explanation:"Sclerenchyma cells are dead at maturity, with heavily lignified thick walls. They provide rigidity and mechanical strength but no flexibility (unlike collenchyma which is living and flexible)." }
      ]
    }
  ]
};
