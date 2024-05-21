class PasswordVerifier1 {
      constructor() {
            this.rules = []
      }
      addRule(rule) {
            this.rules.push(rule)
      }
      verify(input) {
            if (this.rules.length === 0) {
                  throw new Error('There are no rules configured');
            }
            const errors = []
            this.rules.forEach(rule => {
                  const result = rule(input)
                  if (result.passed === false) {
                        errors.push(result.reason)
                  }
            })
            return errors
      }
}

const makeVerifier = () => new PasswordVerifier1();
const passingRule = (input) => ({ passed: true, reason: '' });

const makeVerifierWithPassingRule = () => {
      const verifier = makeVerifier();
      verifier.addRule(passingRule);
      return verifier;
};

const makeVerifierWithFailedRule = (reason) => {
      const verifier = makeVerifier();
      const fakeRule = input => ({ passed: false, reason: reason });
      verifier.addRule(fakeRule);
      return verifier;
};

describe('PasswordVerifier', () => {
      describe('with a failing rule', () => {
            test('has an error message based on the rule.reason', () => {
                  const verifier = makeVerifierWithFailedRule('fake reason');
                  const errors = verifier.verify('any input');
                  expect(errors[0]).toContain('fake reason');
            });
            it('has exactly one error', () => {
                  const verifier = makeVerifierWithFailedRule('fake reason');
                  const errors = verifier.verify('any input');
                  expect(errors.length).toBe(1);
            });
      });
      describe('with a passing rule', () => {
            it('has no errors', () => {
                  const verifier = makeVerifierWithPassingRule();
                  const errors = verifier.verify('any input');
                  expect(errors.length).toBe(0);
            });
      });
      describe('with a failing and a passing rule', () => {
            it('has one error', () => {
                  const verifier = makeVerifierWithFailedRule('fake reason');
                  verifier.addRule(passingRule);
                  const errors = verifier.verify('any input');
                  expect(errors.length).toBe(1);
            });
            it('error text belongs to failed rule', () => {
                  const verifier = makeVerifierWithFailedRule('fake reason');
                  verifier.addRule(passingRule);
                  const errors = verifier.verify('any input');
                  expect(errors[0]).toContain('fake reason');
            });
      });
});

// Listing 2.21 Using test.each
const oneUpperCaseRule = (input) => {
      return {
            passed: (input.toLowerCase() !== input),
            reason: 'at least one upper case needed'
      };
};
describe('one uppercase rule', () => {
      test.each([
            ['Abc', true],
            ['aBc', true],
            ['abc', false],
      ])
            ('given %s, %s ', (input, expected) => {
                  const result = oneUpperCaseRule(input);
                  expect(result.passed).toEqual(expected);
            });
});

// Listing 2.26 Using expect().toThrowError()
test('verify, with no rules, throws exception', () => {
      const verifier = makeVerifier();
      expect(() => verifier.verify('any input')).toThrowError(/no rules configured/);
});