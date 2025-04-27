// Greatest common divisor, using euclidian algorithm
export const gcd = (a, b) => (!b ? a : gcd(b, a % b));

// Lowest Common Multiple, given any number of integers
export const lcm = (...nums) => nums.reduce((a, b) => (a * b) / gcd(a, b), 1);
