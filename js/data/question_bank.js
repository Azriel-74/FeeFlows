/* ============================================================
   EDUSTACK — Question Bank
   js/data/question_bank.js

   Structure:
   QB = {
     'Class X': {
       subjects: [
         { id, name, icon, chapters: [
           { id, name, questionCount, theory (HTML string), questions: [
             { q, opts: [A,B,C,D], ans (0-indexed), exp }
           ]}
         ]}
       ]
     }
   }
   Add more classes / subjects / chapters freely below.
============================================================ */
'use strict';

const QB = {

  /* ══════════════════════ CLASS 9 ══════════════════════ */
  'Class 9': {
    subjects: [

      /* ─── PHYSICS ─── */
      {
        id: 'phy9', name: 'Physics', icon: '⚛️',
        chapters: [
          {
            id: 'motion', name: 'Motion', questionCount: 10,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Motion</div>
                <div class="theory-body">
                  <p>Motion is the change in position of an object with respect to its surroundings over time.</p>
                  <p><strong>Distance</strong> — total path length (scalar). <strong>Displacement</strong> — shortest path from start to end (vector).</p>
                  <p><strong>Speed</strong> = Distance / Time (scalar). <strong>Velocity</strong> = Displacement / Time (vector).</p>
                  <p><strong>Acceleration</strong> = Change in Velocity / Time. Uniform acceleration means constant acceleration.</p>
                  <p><strong>Uniform motion</strong>: equal distances in equal time intervals. <strong>Non-uniform motion</strong>: unequal distances.</p>
                </div>
                <ul class="key-points">
                  <li>v = u + at &nbsp;(1st equation of motion)</li>
                  <li>s = ut + ½at² &nbsp;(2nd equation of motion)</li>
                  <li>v² = u² + 2as &nbsp;(3rd equation of motion)</li>
                  <li>Distance on speed-time graph = area under the graph</li>
                  <li>Slope of distance-time graph = speed</li>
                  <li>Slope of speed-time graph = acceleration</li>
                </ul>
              </div>`,
            questions: [
              { q:'A car travels 60 km in 1 hour. What is its speed?', opts:['30 km/h','60 km/h','120 km/h','90 km/h'], ans:1, exp:'Speed = Distance / Time = 60 km / 1 h = 60 km/h.' },
              { q:'Which of the following is a vector quantity?', opts:['Speed','Distance','Displacement','Time'], ans:2, exp:'Displacement has both magnitude and direction, making it a vector. Speed and distance are scalars.' },
              { q:'An object moving with uniform velocity has acceleration equal to:', opts:['1 m/s²','−1 m/s²','Zero','Variable'], ans:2, exp:'Uniform velocity means no change in velocity, so acceleration = 0.' },
              { q:'The slope of a distance-time graph gives:', opts:['Acceleration','Displacement','Speed','Force'], ans:2, exp:'Slope = rise/run = distance/time = speed.' },
              { q:'A ball thrown upward has velocity at the highest point:', opts:['Maximum','Zero','Equal to initial','Negative'], ans:1, exp:'At the highest point the ball momentarily stops — velocity = 0.' },
              { q:'Using v = u + at, if u=0, a=2 m/s², t=5s, find v:', opts:['5 m/s','10 m/s','20 m/s','2 m/s'], ans:1, exp:'v = 0 + 2×5 = 10 m/s.' },
              { q:'The area under a speed-time graph gives:', opts:['Speed','Acceleration','Distance','Force'], ans:2, exp:'Area = speed × time = distance.' },
              { q:'Uniform motion shows what on a distance-time graph?', opts:['Curved line','Straight horizontal line','Straight sloped line','Parabola'], ans:2, exp:'Constant speed → equal distances in equal times → straight sloped line.' },
              { q:'SI unit of acceleration:', opts:['m/s','km/h','m/s²','m²/s'], ans:2, exp:'Acceleration = change in velocity / time = m/s ÷ s = m/s².' },
              { q:'If displacement is zero, what is necessarily true?', opts:['Speed is zero','Distance is zero','Distance may not be zero','Acceleration is zero'], ans:2, exp:'Zero displacement means start = end point, but the object may have travelled a path (distance ≠ 0).' },
            ]
          },
          {
            id: 'force', name: "Force & Newton's Laws", questionCount: 8,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Force & Newton's Laws of Motion</div>
                <div class="theory-body">
                  <p><strong>Force</strong> is a push or pull that changes or tends to change the state of rest or motion of an object (vector, SI unit: Newton).</p>
                  <p><strong>Newton's 1st Law (Inertia)</strong>: An object at rest stays at rest, and an object in motion stays in motion unless acted on by a net external force.</p>
                  <p><strong>Newton's 2nd Law</strong>: F = ma. The net force on an object equals its mass times its acceleration.</p>
                  <p><strong>Newton's 3rd Law</strong>: For every action there is an equal and opposite reaction.</p>
                </div>
                <ul class="key-points">
                  <li>Momentum p = mv (kg·m/s)</li>
                  <li>Impulse = F × t = Δp (change in momentum)</li>
                  <li>Law of conservation of momentum: total momentum before = total momentum after (no external force)</li>
                  <li>1 Newton = force that gives 1 kg mass an acceleration of 1 m/s²</li>
                </ul>
              </div>`,
            questions: [
              { q:"Newton's 1st Law is also called the Law of:", opts:['Gravity','Inertia','Momentum','Friction'], ans:1, exp:"Newton's 1st Law describes inertia — the tendency of objects to resist changes in their state of motion." },
              { q:'F = ma is:', opts:['Law of Inertia','Law of Gravitation',"Newton's 2nd Law","Newton's 3rd Law"], ans:2, exp:"F = ma is Newton's Second Law of Motion." },
              { q:'If mass = 5 kg and acceleration = 3 m/s², force = ?', opts:['8 N','2 N','15 N','1.67 N'], ans:2, exp:'F = ma = 5 × 3 = 15 N.' },
              { q:'SI unit of force:', opts:['kg','Pascal','Newton','Joule'], ans:2, exp:'The SI unit of force is the Newton (N), where 1 N = 1 kg·m/s².' },
              { q:'Momentum is defined as:', opts:['mass × velocity','force × time','mass × acceleration','force × distance'], ans:0, exp:'Momentum p = mv, where m is mass and v is velocity.' },
              { q:'Action and reaction forces act on:', opts:['Same object','Different objects','Same direction','Perpendicular objects'], ans:1, exp:"Newton's 3rd Law: action and reaction are equal, opposite, and act on different objects." },
              { q:'A rocket works on the principle of:', opts:["Newton's 1st Law",'Gravity',"Newton's 3rd Law",'Friction'], ans:2, exp:"Exhaust gases pushed backward (action) propel the rocket forward (reaction) — Newton's 3rd Law." },
              { q:'Which has more inertia: a 2 kg ball or a 5 kg ball?', opts:['2 kg ball','5 kg ball','Both equal','Depends on speed'], ans:1, exp:'Inertia is directly proportional to mass. The 5 kg ball has greater inertia.' },
            ]
          },
          {
            id: 'gravitation', name: 'Gravitation', questionCount: 6,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Gravitation</div>
                <div class="theory-body">
                  <p><strong>Universal Law of Gravitation</strong>: Every object in the universe attracts every other object with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.</p>
                  <p>F = G × m₁ × m₂ / r² &nbsp; where G = 6.674 × 10⁻¹¹ N·m²/kg²</p>
                  <p><strong>Acceleration due to gravity</strong> on Earth's surface: g ≈ 9.8 m/s²</p>
                  <p><strong>Weight</strong> W = mg (force of gravity on an object).</p>
                </div>
                <ul class="key-points">
                  <li>Mass is constant everywhere; weight varies with g</li>
                  <li>g decreases as you go higher above Earth</li>
                  <li>g on Moon ≈ 1/6 of Earth's g</li>
                  <li>Free fall: object falling under gravity alone (no air resistance)</li>
                </ul>
              </div>`,
            questions: [
              { q:"Who formulated the Universal Law of Gravitation?", opts:['Einstein','Newton','Galileo','Kepler'], ans:1, exp:'Isaac Newton formulated the Universal Law of Gravitation.' },
              { q:'Value of g on Earth\'s surface is approximately:', opts:['9.8 m/s','9.8 m/s²','9.8 km/s²','98 m/s²'], ans:1, exp:'g ≈ 9.8 m/s² at Earth\'s surface.' },
              { q:'Weight of an object is:', opts:['mass × g','mass / g','mass × velocity','mass × distance'], ans:0, exp:'Weight W = mg, where m is mass and g is acceleration due to gravity.' },
              { q:'The value of G (gravitational constant) is:', opts:['9.8 N·m²/kg²','6.674×10⁻¹¹ N·m²/kg²','6.674×10¹¹ N·m²/kg²','1 N·m²/kg²'], ans:1, exp:'G = 6.674 × 10⁻¹¹ N·m²/kg² (universal constant).' },
              { q:'As you move away from Earth, g:', opts:['Increases','Decreases','Stays the same','Becomes zero immediately'], ans:1, exp:'g = GM/r². As r increases, g decreases.' },
              { q:'On the Moon your weight compared to Earth:', opts:['Same','6 times more','About 1/6','Zero'], ans:2, exp:"The Moon's gravity is about 1/6 of Earth's, so weight on the Moon ≈ weight on Earth / 6." },
            ]
          },
        ]
      },

      /* ─── MATHEMATICS ─── */
      {
        id: 'maths9', name: 'Mathematics', icon: '📐',
        chapters: [
          {
            id: 'polynomials', name: 'Polynomials', questionCount: 8,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Polynomials</div>
                <div class="theory-body">
                  <p>A <strong>polynomial</strong> is an expression of the form aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀ where coefficients are real numbers and exponents are non-negative integers.</p>
                  <p><strong>Degree</strong>: highest power of the variable. Linear (1), Quadratic (2), Cubic (3).</p>
                  <p><strong>Zero of a polynomial</strong>: value of x where p(x) = 0.</p>
                  <p><strong>Remainder Theorem</strong>: When p(x) is divided by (x−a), remainder = p(a).</p>
                  <p><strong>Factor Theorem</strong>: (x−a) is a factor of p(x) iff p(a) = 0.</p>
                </div>
                <ul class="key-points">
                  <li>(a+b)² = a² + 2ab + b²</li>
                  <li>(a−b)² = a² − 2ab + b²</li>
                  <li>(a+b)(a−b) = a² − b²</li>
                  <li>(a+b)³ = a³ + 3a²b + 3ab² + b³</li>
                  <li>(a−b)³ = a³ − 3a²b + 3ab² − b³</li>
                  <li>a³ + b³ + c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca)</li>
                </ul>
              </div>`,
            questions: [
              { q:'Degree of the polynomial 3x³ − 5x + 2:', opts:['1','2','3','0'], ans:2, exp:'Highest power of x is 3, so degree = 3.' },
              { q:'A zero of p(x) = x − 3 is:', opts:['−3','0','3','1'], ans:2, exp:'x − 3 = 0 gives x = 3.' },
              { q:'(a + b)² equals:', opts:['a² + b²','a² + 2ab + b²','a² − 2ab + b²','2a + 2b'], ans:1, exp:'(a+b)² = a² + 2ab + b².' },
              { q:'Factorisation of x² − 9:', opts:['(x+3)(x+3)','(x−3)(x−3)','(x+3)(x−3)','(x−9)(x+1)'], ans:2, exp:'x² − 9 = x² − 3² = (x+3)(x−3).' },
              { q:'If p(x) = x² − 5x + 6, then p(2) = ?', opts:['0','2','4','6'], ans:0, exp:'p(2) = 4 − 10 + 6 = 0.' },
              { q:'Maximum zeros of a cubic polynomial:', opts:['1','2','3','4'], ans:2, exp:'A polynomial of degree n has at most n zeros.' },
              { q:'Which is NOT a polynomial?', opts:['x² + 1','√x + 1','x³ − 1','2x + 5'], ans:1, exp:'√x = x^(1/2) has a fractional exponent — not a polynomial.' },
              { q:'Remainder when x³ + 1 is divided by (x + 1):', opts:['0','1','2','−1'], ans:0, exp:'p(−1) = (−1)³ + 1 = −1 + 1 = 0.' },
            ]
          },
          {
            id: 'triangles', name: 'Triangles', questionCount: 6,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Triangles</div>
                <div class="theory-body">
                  <p><strong>Congruence</strong>: Two triangles are congruent if they have the same shape and size. Criteria: SSS, SAS, ASA, AAS, RHS.</p>
                  <p><strong>Similarity</strong>: Triangles are similar if corresponding angles are equal and sides are proportional. Criteria: AA, SSS, SAS.</p>
                  <p><strong>Pythagoras Theorem</strong>: In a right triangle, c² = a² + b², where c is the hypotenuse.</p>
                </div>
                <ul class="key-points">
                  <li>Angle sum property: all angles add to 180°</li>
                  <li>Exterior angle = sum of two non-adjacent interior angles</li>
                  <li>Area = ½ × base × height</li>
                  <li>Heron's formula: A = √[s(s−a)(s−b)(s−c)], s = (a+b+c)/2</li>
                  <li>In similar triangles: ratio of areas = square of ratio of sides</li>
                </ul>
              </div>`,
            questions: [
              { q:'Sum of all angles in a triangle:', opts:['90°','180°','270°','360°'], ans:1, exp:'Angle sum property: all three interior angles add to 180°.' },
              { q:'Right triangle with legs 3 and 4 has hypotenuse:', opts:['5','7','6','√7'], ans:0, exp:'c² = 3² + 4² = 9 + 16 = 25 → c = 5.' },
              { q:'SSS congruence means:', opts:['Two sides equal','All three sides equal','Two angles equal','One side and angle'], ans:1, exp:'SSS: all three pairs of corresponding sides are equal.' },
              { q:'An isosceles triangle has:', opts:['All sides equal','Two equal sides','No equal sides','All right angles'], ans:1, exp:'Isosceles triangle has exactly two equal sides.' },
              { q:'Exterior angle of a triangle equals:', opts:['One interior angle','90°','Sum of two non-adjacent interior angles','180°'], ans:2, exp:'Exterior angle theorem: exterior angle = sum of the two remote interior angles.' },
              { q:'Two triangles are similar if:', opts:['Equal area','Corresponding angles equal','Congruent','Equal perimeter'], ans:1, exp:'Similarity: corresponding angles equal AND corresponding sides proportional.' },
            ]
          },
          {
            id: 'coordinate', name: 'Coordinate Geometry', questionCount: 6,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Coordinate Geometry</div>
                <div class="theory-body">
                  <p>The <strong>Cartesian plane</strong> has two perpendicular axes: x-axis (horizontal) and y-axis (vertical). Their intersection is the <strong>origin</strong> O(0,0).</p>
                  <p>A point P is represented as (x, y) where x is the x-coordinate (abscissa) and y is the y-coordinate (ordinate).</p>
                  <p>The axes divide the plane into 4 <strong>quadrants</strong>: Q1(+,+), Q2(−,+), Q3(−,−), Q4(+,−).</p>
                </div>
                <ul class="key-points">
                  <li>Distance = √[(x₂−x₁)² + (y₂−y₁)²]</li>
                  <li>Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)</li>
                  <li>A point on x-axis: y = 0</li>
                  <li>A point on y-axis: x = 0</li>
                </ul>
              </div>`,
            questions: [
              { q:'The point (−3, 4) lies in which quadrant?', opts:['Q1','Q2','Q3','Q4'], ans:1, exp:'Q2 has negative x and positive y: (−,+).' },
              { q:'Coordinates of the origin are:', opts:['(1,1)','(0,1)','(1,0)','(0,0)'], ans:3, exp:'The origin is where both axes cross: (0,0).' },
              { q:'A point on the x-axis has y-coordinate:', opts:['1','−1','0','Any value'], ans:2, exp:'Points on the x-axis have y = 0.' },
              { q:'Distance between (0,0) and (3,4):', opts:['7','5','1','25'], ans:1, exp:'d = √(3² + 4²) = √(9+16) = √25 = 5.' },
              { q:'Midpoint of (2, 4) and (6, 8):', opts:['(4,6)','(8,12)','(3,5)','(2,4)'], ans:0, exp:'Midpoint = ((2+6)/2, (4+8)/2) = (4, 6).' },
              { q:'Point (5, 0) lies on:', opts:['x-axis','y-axis','Origin','Q1'], ans:0, exp:'y = 0 means the point is on the x-axis.' },
            ]
          },
        ]
      },

      /* ─── SCIENCE (Biology) ─── */
      {
        id: 'sci9', name: 'Science', icon: '🔬',
        chapters: [
          {
            id: 'cell', name: 'The Fundamental Unit of Life', questionCount: 7,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 The Cell — Fundamental Unit of Life</div>
                <div class="theory-body">
                  <p>The <strong>cell</strong> is the basic structural and functional unit of all living organisms. Discovered by Robert Hooke (1665).</p>
                  <p><strong>Prokaryotic cells</strong>: no membrane-bound nucleus (e.g. bacteria). <strong>Eukaryotic cells</strong>: membrane-bound nucleus (e.g. plant, animal cells).</p>
                  <p><strong>Plant vs Animal cells</strong>: Plant cells have cell wall, chloroplasts, and large central vacuole. Animal cells have centrioles and no cell wall.</p>
                </div>
                <ul class="key-points">
                  <li>Cell membrane: selectively permeable, controls entry/exit</li>
                  <li>Nucleus: controls all cellular activities, contains DNA</li>
                  <li>Mitochondria: powerhouse of the cell (ATP production)</li>
                  <li>Ribosome: site of protein synthesis</li>
                  <li>Chloroplast (plant only): site of photosynthesis</li>
                  <li>Vacuole: storage; larger in plant cells</li>
                </ul>
              </div>`,
            questions: [
              { q:'Who discovered the cell?', opts:['Darwin','Robert Hooke','Pasteur','Leeuwenhoek'], ans:1, exp:'Robert Hooke discovered cells in 1665 using a primitive microscope, observing cork slices.' },
              { q:'Powerhouse of the cell:', opts:['Nucleus','Ribosome','Mitochondria','Golgi body'], ans:2, exp:'Mitochondria produce ATP (energy) via cellular respiration — called the powerhouse of the cell.' },
              { q:'Prokaryotic cells lack:', opts:['Cell wall','Ribosomes','Membrane-bound nucleus','Cell membrane'], ans:2, exp:'Prokaryotes have no membrane-bound nucleus — their DNA floats freely in the cytoplasm.' },
              { q:'Cell wall is present in:', opts:['Animal cells only','Plant cells only','Both','Neither'], ans:1, exp:'Cell wall (made of cellulose) is found in plant cells, fungi, and bacteria — NOT in animal cells.' },
              { q:'Site of protein synthesis:', opts:['Mitochondria','Nucleus','Ribosome','Vacuole'], ans:2, exp:'Ribosomes are the site of protein synthesis (translation of mRNA).' },
              { q:'Which organelle is involved in photosynthesis?', opts:['Mitochondria','Ribosome','Nucleus','Chloroplast'], ans:3, exp:'Chloroplasts (containing chlorophyll) are the sites of photosynthesis in plant cells.' },
              { q:'Osmosis is movement of water from:', opts:['High solute to low solute','Low solute to high solute','Low water to high water','High pressure to low pressure'], ans:1, exp:'Osmosis: water moves from a region of low solute concentration (high water potential) to high solute concentration through a semi-permeable membrane.' },
            ]
          },
        ]
      },
    ]
  },

  /* ══════════════════════ CLASS 10 ══════════════════════ */
  'Class 10': {
    subjects: [
      {
        id: 'phy10', name: 'Physics', icon: '⚡',
        chapters: [
          {
            id: 'electricity', name: 'Electricity', questionCount: 8,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Electricity</div>
                <div class="theory-body">
                  <p><strong>Electric current</strong> (I) is the rate of flow of electric charge. I = Q/t, unit: Ampere (A).</p>
                  <p><strong>Potential difference</strong> (V) is work done per unit charge. V = W/Q, unit: Volt (V).</p>
                  <p><strong>Ohm's Law</strong>: V = IR, where R is resistance (Ohm, Ω).</p>
                  <p><strong>Resistance</strong> R = ρL/A, where ρ = resistivity, L = length, A = cross-section area.</p>
                </div>
                <ul class="key-points">
                  <li>Series circuit: Rₜ = R₁ + R₂ + R₃; same current through all</li>
                  <li>Parallel circuit: 1/Rₜ = 1/R₁ + 1/R₂; same voltage across all</li>
                  <li>Power P = VI = I²R = V²/R, unit: Watt (W)</li>
                  <li>Energy E = Pt = VIt, unit: Joule (J) or kWh</li>
                  <li>1 kWh = 3.6 × 10⁶ J</li>
                </ul>
              </div>`,
            questions: [
              { q:'SI unit of electric current:', opts:['Volt','Ohm','Ampere','Watt'], ans:2, exp:'Electric current is measured in Amperes (A).' },
              { q:'Ohm\'s Law states:', opts:['V = IR','V = I/R','V = I²R','V = R/I'], ans:0, exp:'Ohm\'s Law: V = IR (Voltage = Current × Resistance).' },
              { q:'In a series circuit, the current through each component is:', opts:['Different','Same','Zero','Maximum'], ans:1, exp:'In series circuits, the same current flows through all components.' },
              { q:'In a parallel circuit, the voltage across each component is:', opts:['Different','Same','Halved','Doubled'], ans:1, exp:'In parallel circuits, all components share the same voltage.' },
              { q:'Power formula:', opts:['P = VR','P = VI','P = V/I','P = I/V'], ans:1, exp:'Power P = VI = I²R = V²/R. The basic form is P = VI.' },
              { q:'A 100W bulb used for 10 hours consumes:', opts:['100 J','1000 J','1 kWh','10 kWh'], ans:2, exp:'Energy = Power × Time = 100W × 10h = 1000 Wh = 1 kWh.' },
              { q:'Resistance of a wire increases when:', opts:['Temperature decreases','Length increases','Cross-section increases','Material changes to copper'], ans:1, exp:'R = ρL/A. As length L increases, resistance R increases (directly proportional).' },
              { q:'Which material is best for electric wires?', opts:['Iron','Copper','Wood','Rubber'], ans:1, exp:'Copper has very low resistivity, making it an excellent conductor for electric wires.' },
            ]
          },
        ]
      },
      {
        id: 'maths10', name: 'Mathematics', icon: '📊',
        chapters: [
          {
            id: 'quadratic', name: 'Quadratic Equations', questionCount: 7,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Quadratic Equations</div>
                <div class="theory-body">
                  <p>A <strong>quadratic equation</strong> is of the form ax² + bx + c = 0, where a ≠ 0.</p>
                  <p><strong>Discriminant</strong>: D = b² − 4ac</p>
                  <p>If D > 0: two distinct real roots. If D = 0: two equal real roots. If D < 0: no real roots.</p>
                  <p><strong>Quadratic formula</strong>: x = (−b ± √D) / 2a</p>
                </div>
                <ul class="key-points">
                  <li>Sum of roots = −b/a</li>
                  <li>Product of roots = c/a</li>
                  <li>Methods: factorisation, completing the square, quadratic formula</li>
                  <li>If roots are α and β: (x−α)(x−β) = 0</li>
                </ul>
              </div>`,
            questions: [
              { q:'General form of a quadratic equation:', opts:['ax + b = 0','ax² + bx + c = 0','ax³ + bx = 0','ax² = 0'], ans:1, exp:'Quadratic equation: ax² + bx + c = 0, where a ≠ 0.' },
              { q:'Discriminant is:', opts:['b² + 4ac','b² − 4ac','√(b² − 4ac)','−b/2a'], ans:1, exp:'D = b² − 4ac. It determines the nature of roots.' },
              { q:'If D = 0, the equation has:', opts:['No real roots','Two distinct roots','Two equal roots','Infinite roots'], ans:2, exp:'D = 0 means both roots are equal (repeated root).' },
              { q:'Roots of x² − 5x + 6 = 0:', opts:['2 and 3','−2 and −3','1 and 6','−1 and −6'], ans:0, exp:'x² − 5x + 6 = (x−2)(x−3) = 0 → x = 2 or x = 3.' },
              { q:'Sum of roots of x² − 7x + 12 = 0:', opts:['12','−7','7','−12'], ans:2, exp:'Sum of roots = −b/a = −(−7)/1 = 7.' },
              { q:'Product of roots of 2x² − 3x + 1 = 0:', opts:['1/2','3/2','−3/2','−1/2'], ans:0, exp:'Product of roots = c/a = 1/2.' },
              { q:'Which method always works for quadratic equations?', opts:['Factorisation','Completing the square','Quadratic formula','Inspection'], ans:2, exp:'The quadratic formula x = (−b ± √(b²−4ac)) / 2a always gives the roots.' },
            ]
          },
          {
            id: 'arithmetic', name: 'Arithmetic Progressions', questionCount: 7,
            theory: `
              <div class="theory-block">
                <div class="theory-title">📖 Arithmetic Progressions (AP)</div>
                <div class="theory-body">
                  <p>An <strong>Arithmetic Progression (AP)</strong> is a sequence where consecutive terms differ by a constant called the <strong>common difference (d)</strong>.</p>
                  <p>General form: a, a+d, a+2d, a+3d, … where a = first term.</p>
                  <p><strong>nth term</strong>: aₙ = a + (n−1)d</p>
                  <p><strong>Sum of n terms</strong>: Sₙ = n/2 × [2a + (n−1)d] = n/2 × (a + l), where l is the last term.</p>
                </div>
                <ul class="key-points">
                  <li>d = aₙ − aₙ₋₁ (any term minus its previous term)</li>
                  <li>If d > 0: increasing AP; d < 0: decreasing AP; d = 0: constant</li>
                  <li>Arithmetic mean between a and b: (a+b)/2</li>
                </ul>
              </div>`,
            questions: [
              { q:'Common difference of 2, 5, 8, 11 …:', opts:['2','3','5','11'], ans:1, exp:'d = 5 − 2 = 3.' },
              { q:'7th term of AP 3, 7, 11, …:', opts:['27','23','25','29'], ans:0, exp:'a = 3, d = 4. a₇ = 3 + 6×4 = 3 + 24 = 27.' },
              { q:'Sum of first 10 natural numbers:', opts:['50','55','45','60'], ans:1, exp:'S₁₀ = 10/2 × (1+10) = 5 × 11 = 55.' },
              { q:'nth term formula:', opts:['a + nd','a + (n−1)d','a(n−1)d','nd − a'], ans:1, exp:'aₙ = a + (n−1)d, where a = first term, d = common difference.' },
              { q:'In AP 1, 4, 7, …, 100, the number of terms is:', opts:['33','34','35','32'], ans:1, exp:'100 = 1 + (n−1)×3 → 99 = 3(n−1) → n−1 = 33 → n = 34.' },
              { q:'Sum of n terms: Sₙ = n/2 × ?', opts:['(a + l)','(a − l)','(2a + d)','(a × l)'], ans:0, exp:'Sₙ = n/2 × (a + l) where a = first term, l = last term.' },
              { q:'If a = 2, d = 3, n = 5, find S₅:', opts:['40','35','30','45'], ans:0, exp:'S₅ = 5/2 × [2(2) + 4(3)] = 5/2 × [4 + 12] = 5/2 × 16 = 40.' },
            ]
          },
        ]
      },
    ]
  },
};
