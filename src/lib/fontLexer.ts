// Minimal C tokenizer for our font parser needs.
// - Skips // and /* */ comments
// - Skips "strings" and 'chars' safely
// - Emits identifiers, numbers (hex/dec), and symbols we care about

export type TokenType =
  | "ident"
  | "number"
  | "lbrace"
  | "rbrace"
  | "lbracket"
  | "rbracket"
  | "lparen"
  | "rparen"
  | "comma"
  | "semicolon"
  | "equal"
  | "dot"
  | "asterisk"
  | "other"

export interface Token {
  type: TokenType
  value: string
  pos: number
}

export function tokenizeC(input: string): Token[] {
  const tokens: Token[] = []
  const len = input.length
  let i = 0

  const isAlpha = (c: string) => /[A-Za-z_]/.test(c)
  const isAlnum = (c: string) => /[A-Za-z0-9_]/.test(c)
  const isDigit = (c: string) => /[0-9]/.test(c)
  const peek = (n = 0) => (i + n < len ? input[i + n] : "")
  const next = () => input[i++]

  const skipLine = () => {
    while (i < len && input[i] !== "\n") i++
  }
  const skipBlock = () => {
    i += 2 // skip '/*'
    while (i < len && !(input[i] === "*" && input[i + 1] === "/")) i++
    i += 2 // skip '*/'
  }
  const skipString = (quote: string) => {
    // supports "..." and '...' with escapes
    const q = quote
    let escaped = false
    next() // consume opening quote
    while (i < len) {
      const c = next()
      if (escaped) {
        escaped = false
        continue
      }
      if (c === "\\") {
        escaped = true
        continue
      }
      if (c === q) break
    }
  }

  while (i < len) {
    const c = peek()

    // whitespace
    if (/\s/.test(c)) {
      i++
      continue
    }

    // comments
    if (c === "/" && peek(1) === "/") {
      i += 2
      skipLine()
      continue
    }
    if (c === "/" && peek(1) === "*") {
      skipBlock()
      continue
    }

    // strings / chars
    if (c === '"' || c === "'") {
      skipString(c)
      continue
    }

    // identifiers
    if (isAlpha(c)) {
      let start = i
      next()
      while (isAlnum(peek())) next()
      tokens.push({ type: "ident", value: input.slice(start, i), pos: start })
      continue
    }

    // numbers: hex (0x...) or decimal
    if (isDigit(c)) {
      let start = i
      if (c === "0" && (peek(1) === "x" || peek(1) === "X")) {
        // hex
        next()
        next()
        while (/[0-9A-Fa-f]/.test(peek())) next()
        tokens.push({ type: "number", value: input.slice(start, i), pos: start })
      } else {
        // decimal
        next()
        while (isDigit(peek())) next()
        tokens.push({ type: "number", value: input.slice(start, i), pos: start })
      }
      continue
    }

    // symbols
    const symbolMap: Record<string, TokenType> = {
      "{": "lbrace",
      "}": "rbrace",
      "[": "lbracket",
      "]": "rbracket",
      "(": "lparen",
      ")": "rparen",
      ",": "comma",
      ";": "semicolon",
      "=": "equal",
      ".": "dot",
      "*": "asterisk",
    }
    if (symbolMap[c]) {
      tokens.push({ type: symbolMap[c], value: c, pos: i })
      i++
      continue
    }

    // fallback
    tokens.push({ type: "other", value: c, pos: i })
    i++
  }

  return tokens
}
