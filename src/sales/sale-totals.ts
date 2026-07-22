export interface SaleLineInput {
  productId: string;
  qty: number;
}

export interface PricedLine {
  productId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleTotals {
  lines: PricedLine[];
  total: number;
}

/** Redondea a 2 decimales evitando el arrastre binario de los floats. */
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula subtotales y total de una venta usando SIEMPRE el precio real del
 * producto (priceByProductId), nunca un precio enviado por el cliente. Devuelve
 * las lineas con unitPrice/subtotal ya calculados listos para persistir.
 */
export function computeSaleTotals(
  items: SaleLineInput[],
  priceByProductId: Map<string, number>,
): SaleTotals {
  const lines = items.map((item) => {
    const unitPrice = priceByProductId.get(item.productId);
    if (unitPrice === undefined) {
      throw new Error(`Sin precio para el producto ${item.productId}`);
    }
    return {
      productId: item.productId,
      qty: item.qty,
      unitPrice,
      subtotal: round2(unitPrice * item.qty),
    };
  });
  const total = round2(lines.reduce((sum, l) => sum + l.subtotal, 0));
  return { lines, total };
}
