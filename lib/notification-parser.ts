export interface ParsedTransaction {
  amount: number;
  merchant: string;
  type: "EXPENSE" | "INCOME";
  date: Date;
}

export function parseNotification(
  title: string,
  message: string,
  packageName: string,
): ParsedTransaction | null {
  const text = `${title} ${message}`;

  // Normalize text to handle inconsistent casing/accents
  const cleanText = text.replace(/\s+/g, " ").trim();

  // 1. NUBANK
  if (
    packageName.includes("nubank") ||
    title.toLowerCase().includes("nubank") ||
    cleanText.includes("NuConta")
  ) {
    return parseNubank(cleanText);
  }

  // 2. INTER
  if (packageName.includes("inter") || title.toLowerCase().includes("inter")) {
    return parseInter(cleanText);
  }

  // 3. ITAÚ
  if (
    packageName.includes("itau") ||
    title.toLowerCase().includes("itaú") ||
    title.toLowerCase().includes("itau")
  ) {
    return parseItau(cleanText);
  }

  // Generic fallback (risky but useful)
  return parseGeneric(cleanText);
}

function parseNubank(text: string): ParsedTransaction | null {
  // Expense: "Compra de R$ 50,00 no iFood"
  // Expense: "Compra aprovada no cartão: R$ 50,00 em iFood"
  const expenseRegex =
    /(?:Compra|Pagamento).+?(?:R\$\s?)([\d.,]+)(?:\s(?:no|na|em)\s)(.+?)(?:\saprovada|$)/i;
  const match = text.match(expenseRegex);

  if (match) {
    return {
      amount: parseAmount(match[1]),
      merchant: cleanMerchant(match[2]),
      type: "EXPENSE",
      date: new Date(),
    };
  }

  // Transfer sent: "Você transferiu R$ 100,00 para João"
  const transferSentRegex =
    /(?:Você transferiu|Transferência realizada).+?(?:R\$\s?)([\d.,]+)(?:\spara\s)(.+)/i;
  const transferMatch = text.match(transferSentRegex);

  if (transferMatch) {
    return {
      amount: parseAmount(transferMatch[1]),
      merchant: cleanMerchant(transferMatch[2]),
      type: "EXPENSE",
      date: new Date(),
    };
  }

  return null;
}

function parseInter(text: string): ParsedTransaction | null {
  // "Compra aprovada no cartão Inter: R$ 50,00 em iFood"
  const expenseRegex =
    /(?:Compra aprovada).+?(?:R\$\s?)([\d.,]+)(?:\sem\s)(.+)/i;
  const match = text.match(expenseRegex);

  if (match) {
    return {
      amount: parseAmount(match[1]),
      merchant: cleanMerchant(match[2]),
      type: "EXPENSE",
      date: new Date(),
    };
  }

  return null;
}

function parseItau(text: string): ParsedTransaction | null {
  // "Compra aprovada no cartão ... valor R$ 50,00 em iFood"
  const expenseRegex =
    /(?:Compra aprovada).+?(?:valor R\$\s?)([\d.,]+)(?:\sem\s)(.+)/i;
  const match = text.match(expenseRegex);

  if (match) {
    return {
      amount: parseAmount(match[1]),
      merchant: cleanMerchant(match[2]),
      type: "EXPENSE",
      date: new Date(),
    };
  }
  return null;
}

function parseGeneric(text: string): ParsedTransaction | null {
  // Try to find "R$ XX,XX" and "em/no/na Merchant"
  const amountRegex = /R\$\s?([\d.,]+)/;
  const merchantRegex = /(?:em|no|na)\s([A-Za-z0-9\s]+)/;

  const amountMatch = text.match(amountRegex);
  const merchantMatch = text.match(merchantRegex);

  if (amountMatch && merchantMatch) {
    return {
      amount: parseAmount(amountMatch[1]),
      merchant: cleanMerchant(merchantMatch[1]),
      type: "EXPENSE",
      date: new Date(),
    };
  }

  return null;
}

function parseAmount(amountStr: string): number {
  // "1.234,56" -> 1234.56
  // Remove dots (thousands separators)
  const noDots = amountStr.replace(/\./g, "");
  // Replace comma with dot
  const withDot = noDots.replace(",", ".");
  return parseFloat(withDot);
}

function cleanMerchant(name: string): string {
  return name.trim().replace(/^o\s|^a\s/, "");
}
