// EduStack — js/data/class9_maths.js
window.QB = window.QB || {};

window.QB["9_CBSE_Maths"] = {
  subject: "Maths",
  class: "9",
  board: "CBSE",
  chapters: [
    {
      id: "9m1",
      name: "Number Systems",
      theory: {
        keyPoints: [
          "Natural numbers (N): 1, 2, 3, ... (counting numbers)",
          "Whole numbers (W): 0, 1, 2, 3, ...",
          "Integers (Z): ..., -2, -1, 0, 1, 2, ...",
          "Rational numbers (Q): p/q form where p,q are integers and q≠0. Terminating or recurring decimals.",
          "Irrational numbers: cannot be expressed as p/q. Non-terminating, non-recurring decimals. Examples: √2, √3, π.",
          "Real numbers (R): all rational and irrational numbers.",
          "√2 = 1.41421356... (irrational)",
          "π = 3.14159265... (irrational)",
          "Laws of exponents: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ/aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ",
          "Rationalisation: eliminating irrational numbers from denominator."
        ],
        formulae: [
          "a⁰ = 1 (a ≠ 0)",
          "a⁻ⁿ = 1/aⁿ",
          "aᵐ × aⁿ = aᵐ⁺ⁿ",
          "aᵐ / aⁿ = aᵐ⁻ⁿ",
          "(aᵐ)ⁿ = aᵐⁿ",
          "a^(1/n) = ⁿ√a",
          "(√a + √b)(√a - √b) = a - b"
        ],
        remember: [
          "Every rational number is a real number but not vice versa.",
          "There are infinitely many rational and irrational numbers between any two numbers.",
          "√p is irrational when p is a prime number.",
          "The decimal expansion of a rational number is either terminating or non-terminating repeating.",
          "Irrational numbers are non-terminating non-repeating decimals."
        ]
      },
      questions: [
        { id:"9m1q1", text:"Which of the following is an irrational number?", options:["√4","√9","√2","√16"], answer:2, difficulty:"easy", explanation:"√4=2, √9=3, √16=4 are all rational (perfect squares). √2 = 1.41421... is non-terminating, non-recurring — it's irrational." },
        { id:"9m1q2", text:"The decimal expansion of 1/3 is:", options:["0.33","0.3","0.333...","0.3333 (terminating)"], answer:2, difficulty:"easy", explanation:"1/3 = 0.3333... = 0.3̄ (non-terminating, recurring decimal). This makes it a rational number." },
        { id:"9m1q3", text:"Which number is both rational and irrational?", options:["0","1","√2","No number is both"], answer:3, difficulty:"medium", explanation:"A number cannot be both rational and irrational — they are mutually exclusive sets. No number belongs to both categories." },
        { id:"9m1q4", text:"What is 2³ × 2⁴?", options:["2⁷","2¹²","4⁷","2⁸"], answer:0, difficulty:"easy", explanation:"Using aᵐ × aⁿ = aᵐ⁺ⁿ: 2³ × 2⁴ = 2^(3+4) = 2⁷ = 128" },
        { id:"9m1q5", text:"The rationalising factor of (1/√5) is:", options:["√5","1/√5","5","√25"], answer:0, difficulty:"medium", explanation:"To rationalise 1/√5, multiply numerator and denominator by √5: (1×√5)/(√5×√5) = √5/5. The rationalising factor is √5." },
        { id:"9m1q6", text:"Which of the following is a rational number between 1 and 2?", options:["√2","√3","3/2","√5"], answer:2, difficulty:"easy", explanation:"3/2 = 1.5, which is between 1 and 2. √2≈1.414 is irrational. A rational number must be in p/q form — 3/2 qualifies." },
        { id:"9m1q7", text:"9^(1/2) is equal to:", options:["3","4.5","81","1/9"], answer:0, difficulty:"easy", explanation:"9^(1/2) = √9 = 3. In general, a^(1/n) = nth root of a." },
        { id:"9m1q8", text:"Which set contains only irrational numbers?", options:["π, √2, 1","√2, √3, √5","√4, √9, √16","1/2, √2, 2"], answer:1, difficulty:"medium", explanation:"√2, √3, and √5 are all square roots of non-perfect squares — all irrational. √4=2 (rational), √9=3 (rational), √16=4 (rational)." },
        { id:"9m1q9", text:"Simplify: (4/9)^(1/2)", options:["2/3","4/3","16/81","2/9"], answer:0, difficulty:"medium", explanation:"(4/9)^(1/2) = √(4/9) = √4/√9 = 2/3" },
        { id:"9m1q10", text:"If x = 2+√3, then x + 1/x =", options:["4","2√3","4+2√3","2+√3"], answer:0, difficulty:"hard", explanation:"1/x = 1/(2+√3). Rationalise: 1/x = (2-√3)/((2+√3)(2-√3)) = (2-√3)/(4-3) = 2-√3. So x + 1/x = (2+√3) + (2-√3) = 4." }
      ]
    },
    {
      id: "9m2",
      name: "Polynomials",
      theory: {
        keyPoints: [
          "Polynomial: algebraic expression with non-negative integer powers of variable.",
          "Degree of polynomial: highest power of the variable.",
          "Types: Monomial (1 term), Binomial (2 terms), Trinomial (3 terms).",
          "Linear polynomial: degree 1 (ax + b)",
          "Quadratic polynomial: degree 2 (ax² + bx + c)",
          "Cubic polynomial: degree 3 (ax³ + bx² + cx + d)",
          "Zero of a polynomial p(x): value of x for which p(x) = 0.",
          "Remainder Theorem: When p(x) is divided by (x-a), remainder = p(a).",
          "Factor Theorem: (x-a) is a factor of p(x) if p(a) = 0.",
          "Algebraic Identities are crucial for factorisation."
        ],
        formulae: [
          "(a+b)² = a² + 2ab + b²",
          "(a-b)² = a² - 2ab + b²",
          "(a+b)(a-b) = a² - b²",
          "(x+a)(x+b) = x² + (a+b)x + ab",
          "(a+b+c)² = a² + b² + c² + 2ab + 2bc + 2ca",
          "(a+b)³ = a³ + 3a²b + 3ab² + b³",
          "(a-b)³ = a³ - 3a²b + 3ab² - b³",
          "a³ + b³ = (a+b)(a² - ab + b²)",
          "a³ - b³ = (a-b)(a² + ab + b²)",
          "a³ + b³ + c³ - 3abc = (a+b+c)(a²+b²+c²-ab-bc-ca)"
        ],
        remember: [
          "Degree of zero polynomial is not defined.",
          "Constant polynomial has degree 0.",
          "A polynomial of degree n has at most n zeroes.",
          "Linear polynomial has exactly 1 zero.",
          "If a³+b³+c³ = 3abc then either a+b+c=0 or a=b=c."
        ]
      },
      questions: [
        { id:"9m2q1", text:"The degree of polynomial 3x² - 5x + 2 is:", options:["1","2","3","0"], answer:1, difficulty:"easy", explanation:"The degree of a polynomial is the highest power of the variable. In 3x² - 5x + 2, the highest power is 2." },
        { id:"9m2q2", text:"Zero of the polynomial p(x) = 2x + 6 is:", options:["6","3","-3","-6"], answer:2, difficulty:"easy", explanation:"Set p(x) = 0: 2x + 6 = 0 → 2x = -6 → x = -3. The zero of the polynomial is -3." },
        { id:"9m2q3", text:"Using Remainder Theorem, remainder when x³ - 3x + 1 is divided by (x-1) is:", options:["0","-1","1","3"], answer:1, difficulty:"medium", explanation:"Remainder = p(1) = 1³ - 3(1) + 1 = 1 - 3 + 1 = -1" },
        { id:"9m2q4", text:"Expand (x + 3)² :", options:["x² + 9","x² + 6x + 9","x² + 3x + 9","x² - 6x + 9"], answer:1, difficulty:"easy", explanation:"Using (a+b)² = a² + 2ab + b²: (x+3)² = x² + 2(x)(3) + 3² = x² + 6x + 9" },
        { id:"9m2q5", text:"Factorise: x² - 5x + 6", options:["(x-2)(x-3)","(x+2)(x+3)","(x-1)(x-6)","(x+1)(x-6)"], answer:0, difficulty:"medium", explanation:"We need two numbers that multiply to 6 and add to -5. Those are -2 and -3. So x²-5x+6 = (x-2)(x-3)." },
        { id:"9m2q6", text:"If (x-2) is a factor of p(x) = x² - kx + 4, the value of k is:", options:["2","4","1","0"], answer:1, difficulty:"medium", explanation:"By Factor Theorem, p(2) = 0: 4 - 2k + 4 = 0 → 8 = 2k → k = 4." },
        { id:"9m2q7", text:"The value of (98)² using algebraic identities:", options:["9604","9402","9204","9702"], answer:0, difficulty:"medium", explanation:"98² = (100-2)² = 100² - 2×100×2 + 2² = 10000 - 400 + 4 = 9604" },
        { id:"9m2q8", text:"Factorise: 27x³ + 64y³", options:["(3x+4y)(9x²+12xy+16y²)","(3x-4y)(9x²+12xy+16y²)","(3x+4y)(9x²-12xy+16y²)","(3x+4y)³"], answer:2, difficulty:"hard", explanation:"Using a³+b³=(a+b)(a²-ab+b²): 27x³+64y³ = (3x)³+(4y)³ = (3x+4y)((3x)²-(3x)(4y)+(4y)²) = (3x+4y)(9x²-12xy+16y²)" },
        { id:"9m2q9", text:"If a + b + c = 0, then a³ + b³ + c³ =", options:["0","3abc","abc","3(a+b+c)"], answer:1, difficulty:"hard", explanation:"Using identity: a³+b³+c³-3abc = (a+b+c)(a²+b²+c²-ab-bc-ca). If a+b+c=0, then a³+b³+c³-3abc=0, so a³+b³+c³=3abc." }
      ]
    },
    {
      id: "9m3",
      name: "Triangles",
      theory: {
        keyPoints: [
          "Two figures are congruent if they have same shape and size.",
          "Congruence of triangles: SAS, ASA, AAS, SSS, RHS criteria.",
          "SAS: two sides and included angle are equal.",
          "ASA: two angles and included side are equal.",
          "AAS: two angles and non-included side are equal.",
          "SSS: all three sides are equal.",
          "RHS: right angle, hypotenuse, and one side are equal.",
          "Theorem: Angles opposite to equal sides are equal (isosceles triangle).",
          "Theorem: Triangle inequalities — sum of any two sides > third side.",
          "Theorem: In a triangle, greater side has greater angle opposite to it."
        ],
        formulae: [
          "Angle sum property: ∠A + ∠B + ∠C = 180°",
          "Exterior angle = sum of two non-adjacent interior angles",
          "Perimeter of equilateral triangle = 3a",
          "Area of equilateral triangle = (√3/4)a²"
        ],
        remember: [
          "CPCT: Corresponding Parts of Congruent Triangles are equal.",
          "SSA and AAA are NOT valid congruence criteria.",
          "Equilateral triangle: all sides equal, all angles = 60°.",
          "Isosceles triangle: two equal sides, two equal base angles.",
          "The longest side is opposite the largest angle."
        ]
      },
      questions: [
        { id:"9m3q1", text:"In ΔABC, if AB = AC, then:", options:["∠A = ∠B","∠B = ∠C","∠A = ∠C","∠A = ∠B = ∠C"], answer:1, difficulty:"easy", explanation:"In an isosceles triangle, angles opposite to equal sides are equal. AB = AC means side opposite ∠C = side opposite ∠B, so ∠B = ∠C." },
        { id:"9m3q2", text:"Which is NOT a valid congruence criterion?", options:["SAS","SSA","ASA","RHS"], answer:1, difficulty:"medium", explanation:"SSA (two sides and a non-included angle) is NOT a valid congruence criterion as it doesn't uniquely determine a triangle — two different triangles can satisfy SSA." },
        { id:"9m3q3", text:"If ΔABC ≅ ΔPQR by SAS, then which angles are equal?", options:["∠A = ∠R","∠B = ∠Q","∠C = ∠P","∠A = ∠Q"], answer:1, difficulty:"medium", explanation:"CPCT (Corresponding Parts of Congruent Triangles): In ΔABC ≅ ΔPQR, A↔P, B↔Q, C↔R. So ∠B = ∠Q." },
        { id:"9m3q4", text:"The sum of all angles of a triangle is:", options:["90°","180°","270°","360°"], answer:1, difficulty:"easy", explanation:"Angle sum property: The sum of all three interior angles of any triangle is always 180°." },
        { id:"9m3q5", text:"An exterior angle of a triangle is equal to:", options:["Sum of all three angles","Sum of two non-adjacent interior angles","Difference of two interior angles","Half the sum of all angles"], answer:1, difficulty:"medium", explanation:"Exterior Angle Theorem: An exterior angle of a triangle = sum of the two non-adjacent (remote) interior angles." }
      ]
    }
  ]
};
