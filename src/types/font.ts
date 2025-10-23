export interface CharacterDef {
    code: number
    bytes: number[]
  }
  
  export interface FontDef {
    name: string
    width: number
    height: number
    firstChar: number
    lastChar: number
    characters: CharacterDef[]
  }
  