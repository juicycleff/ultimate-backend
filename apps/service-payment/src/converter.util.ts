import { Plan } from './types';
import { cards, ICard, IList, plans as SPlan, products } from 'stripe';
import { Card, Feature, Price } from '@ultimatebackend/contracts';

export function convertToPlan(plans: IList<SPlan.IPlan>, product: products.IProduct): Plan {

  if (plans === null || product === null) {
    return null;
  }

  const prices: Price[] = [];
  const features: Feature[] = [];

  if (plans.data && plans.data.length > 0) {
    for (const p of plans.data) {
      prices.push({
        price: p.amount / 100,
        currency: p.currency,
        trialDays: p.trial_period_days,
        id: p.id,
        name: p.nickname,
      });
    }
  }

  if (product.metadata) {
    // tslint:disable-next-line:forin
    for (const k in product.metadata) {
      features.push({
        active: true,
        normalizedName: k,
        name: k,
        description: product.metadata[k],
      });
    }
  }

  const lowestPlan = plans.total_count > 0 ? plans.data.reduce(prev => prev.amount <= 0 && prev) : null;

  // @ts-ignore
  return  {
    id: product.id,
    active: product.active,
    name: product.name,
    normalizedName: product.url,
    createdAt: new Date(product.created),
    updatedAt: new Date(product.updated),
    free: lowestPlan === null,
    prices,
    features,
  };
}

export function convertFromToCard(
  card: cards.ICard | Card | Card[] | cards.ICard[],
): Card | ICard {

  if (card === null) {
    return null;
  }

  if (Array.isArray(card)) {
    const result = [];
    for (const c of card) {
      // @ts-ignore
      if (c instanceof Card) {
        const data = {
          address_city: c.address.city,
          address_country: c.address.country,
          address_line1: c.address.line,
          address_line2: c.address.line2,
          address_state: c.address.state,
          address_zip: c.address.postalCode,
          currency: c.currency,
          exp_month: c.expMonth,
          exp_year: c.expYear,
          name: c.name,
          number: c.number,
          default_for_currency: !!c.currency,
          object: 'card',
        } as ICard;
        result.push(data);
      } else {
        const data = {
          address: {
            city: c.address_city,
            postalCode: c.address_zip,
            line: c.address_line1,
            line2: c.address_line2,
            country: c.address_country,
            state: c.address_state,
          },
          name: c.name,
          number: c.number,
          id: c.id,
          currency: c.currency,
          brand: c.brand,
          expMonth: c.exp_month,
          expYear: c.exp_year,
          lastFourDigit: c.last4,
        } as Card;
        result.push(data);
      }
    }

    // @ts-ignore
    return result;
  }

  // @ts-ignore
  if (card instanceof Card) {
    return {
      address_city: card.address.city,
      address_country: card.address.country,
      address_line1: card.address.line,
      address_line2: card.address.line2,
      address_state: card.address.state,
      address_zip: card.address.postalCode,
      currency: card.currency,
      exp_month: card.expMonth,
      exp_year: card.expYear,
      name: card.name,
      number: card.number,
      default_for_currency: !!card.currency,
      object: 'card',
    } as ICard;
  } else if (!Array.isArray(card)) {
    return {
      address: {
        city: card.address_city,
        postalCode: card.address_zip,
        line: card.address_line1,
        line2: card.address_line2,
        country: card.address_country,
        state: card.address_state,
      },
      name: card.name,
      number: card.number,
      id: card.id,
      currency: card.currency,
      brand: card.brand,
      expMonth: card.exp_month,
      expYear: card.exp_year,
      lastFourDigit: card.last4,
    } as Card;
  }

}
