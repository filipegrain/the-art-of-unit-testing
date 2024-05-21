// Listing 3.3 verifyPassword with a currentDay parameter
const verifyPassword2 = (input, rules, currentDay) => {
      if ([SATURDAY, SUNDAY].includes(currentDay)) {
            throw Error("It's the weekend!");
      }
      //more code goes here...
      //return list of errors found..
      return [];
};
const SUNDAY = 0, SATURDAY = 6, MONDAY = 1;
describe('verifier2 - dummy object', () => {
      test('on weekends, throws exceptions', () => {
            expect(() => verifyPassword2('anything', [], SUNDAY))
                  .toThrow("It's the weekend!");
      });
});

// Listing 3.4 Dependency injection with a function
const verifyPassword3 = (input, rules, getDayFn) => {
      const dayOfWeek = getDayFn();
      if ([SATURDAY, SUNDAY].includes(dayOfWeek)) {
            throw Error("It's the weekend!");
      }
      //more code goes here...
      //return list of errors found..
      return [];
};
describe('verifier3 - dummy function', () => {
      test('on weekends, throws exceptions', () => {
            const alwaysSunday = () => SUNDAY;
            expect(() => verifyPassword3('anything', [], alwaysSunday)).toThrow("It's the weekend!");
      });
});

// Listing 3.10 Constructor injection design
class PasswordVerifier {
      constructor(rules, dayOfWeekFn) {
            this.rules = rules;
            this.dayOfWeek = dayOfWeekFn;
      }
      verify(input) {
            if ([SATURDAY, SUNDAY].includes(this.dayOfWeek())) {
                  throw new Error("It's the weekend!");
            }
            const errors = [];
            //more code goes here..
            return errors;
      };
}
test('class constructor: on weekends, throws exception', () => {
      const alwaysSunday = () => SUNDAY;
      const verifier = new PasswordVerifier([], alwaysSunday);
      expect(() => verifier.verify('anything'))
            .toThrow("It's the weekend!");
});

// Listing 3.11 Adding a helper factory function to our tests
describe('refactored with constructor', () => {
      const makeVerifier = (rules, dayFn) => {
            return new PasswordVerifier(rules, dayFn);
      };
      test('class constructor: on weekends, throws exceptions', () => {
            const alwaysSunday = () => SUNDAY;
            const verifier = makeVerifier([], alwaysSunday);

            expect(() => verifier.verify('anything'))
                  .toThrow("It's the weekend!");
      });
      test('class constructor: on weekdays, with no rules, passes', () => {
            const alwaysMonday = () => MONDAY;
            const verifier = makeVerifier([], alwaysMonday);

            const result = verifier.verify('anything');
            expect(result.length).toBe(0);
      });
});