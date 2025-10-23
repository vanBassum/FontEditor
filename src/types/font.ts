export interface CharacterDef {
    code: number // ASCII code
    bytes: number[] // each column byte
  }
  
  export interface FontDef {
    name: string
    width: number
    height: number
    firstChar: number
    lastChar: number
    characters: CharacterDef[]
  }
  