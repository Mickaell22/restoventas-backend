import { computeSaleTotals } from './sale-totals';

describe('computeSaleTotals', () => {
  const prices = new Map([
    ['a', 10],
    ['b', 2.5],
  ]);

  it('calcula subtotales y total con los precios reales', () => {
    const { lines, total } = computeSaleTotals(
      [
        { productId: 'a', qty: 2 },
        { productId: 'b', qty: 3 },
      ],
      prices,
    );
    expect(lines[0]).toEqual({
      productId: 'a',
      qty: 2,
      unitPrice: 10,
      subtotal: 20,
    });
    expect(lines[1].subtotal).toBe(7.5);
    expect(total).toBe(27.5);
  });

  it('redondea a 2 decimales sin arrastre de floats', () => {
    const { total } = computeSaleTotals(
      [{ productId: 'b', qty: 3 }],
      new Map([['b', 0.1]]),
    );
    // 0.1 * 3 = 0.30000000000000004 en float; debe quedar 0.3
    expect(total).toBe(0.3);
  });

  it('falla si un producto no tiene precio conocido', () => {
    expect(() =>
      computeSaleTotals([{ productId: 'x', qty: 1 }], prices),
    ).toThrow();
  });
});
