import getFakerInstanceByLang from '@/faker/core';

import { BANK_LIST } from '.';

export function randomTransactionCode(type: string) {
  const faker = getFakerInstanceByLang();
  switch (type) {
    case 'qr-transfer':
      return '10001' + faker.finance.accountNumber({ length: 27 });
    case 'pay-reward':
      return '10001' + faker.finance.accountNumber({ length: 31 });
    case 'transfer':
      return '10005' + faker.finance.accountNumber({ length: 27 });
    case 'red-packet':
      return '100003' + faker.finance.accountNumber({ length: 30 });
    case 'red-packet-merchant':
      return '100003' + faker.finance.accountNumber({ length: 27 });
    case 'credit-card-repayments':
      return '420000' + faker.finance.accountNumber({ length: 22 });
    case 'credit-card-repayments-merchant':
      return '180000814' + faker.finance.accountNumber({ length: 19 });
    default:
      return '';
  }
}

export function randomCreditCardNumber() {
  const faker = getFakerInstanceByLang();
  return faker.finance.creditCardNumber();
}

export function randomLast4CreditCardNumber() {
  return randomCreditCardNumber().slice(-4);
}

export function randomPaymentMethod({ withCardType = true, withLast4CardNumber = true, cardType = '储蓄卡' } = {}) {
  const faker = getFakerInstanceByLang();
  const bank = faker.helpers.arrayElement(BANK_LIST);
  const last4CardNumber = randomLast4CreditCardNumber();
  return `${bank}${withCardType ? cardType : ''}${withLast4CardNumber ? `(${last4CardNumber})` : ''}`;
}

export function randomCreditCardName() {
  const faker = getFakerInstanceByLang();
  return `${faker.helpers.arrayElement(BANK_LIST)}信用卡`;
}
