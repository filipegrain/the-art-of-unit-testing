class PasswordVerifier1 {
      constructor () {
            this.rules = []
      }
      addRule(rule) {
            this.rules.push(rule)
      }
      verify(input) {
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

describe('PasswordVerifier', () => {
      let verifier
      beforeEach(() => verifier = new PasswordVerifier1())
      describe('with a failing rule', () => {
            let errors
            beforeEach(() => {
                  verifier.addRule(makeFailingRule('fake reason'))
                  errors = verifier.verify('any value');
            })
            it('has an error message based on the rule.reason', () => {
                  expect(errors[0]).toContain('fake reason')
            })
            it('has exactly one error', () => {
                  expect(errors.length).toBe(1);
            })
      })
      describe('with a passing rule', () => {
            let errors;
            beforeEach(() => {
              verifier.addRule(makePassingRule());
              errors = verifier.verify('any value');
            });
            it('has no errors', () => {
              expect(errors.length).toBe(0);
            });
          });
          describe('with a failing and a passing rule', () => {
            let errors;
            beforeEach(() => {
              verifier.addRule(makePassingRule());
              verifier.addRule(makeFailingRule('fake reason'));
              errors = verifier.verify('any value');
            });
            it('has one error', () => {
              expect(errors.length).toBe(1);
            });
            it('error text belongs to failed rule', () => {
                  expect(errors[0]).toContain('fake reason');
                });
              });
})

const makeFailingRule = (reason) => {
      return (input) => {
        return { passed: false, reason: reason };
      };
    };
    const makePassingRule = () => (input) => {
      return { passed: true, reason: '' };
    };