import { BRAND } from "@/config/brand";

/** Préfixe des numéros de commande de l'année : « EQ-2026- ». */
export function orderNumberPrefix(year: number): string {
  return `${BRAND.orderPrefix}-${year}-`;
}
