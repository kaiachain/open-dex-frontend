import { TokenSymbol } from '@/core/kaikas'

export default class Currency {
  public readonly decimals: number
  public readonly symbol?: TokenSymbol
  public readonly name?: string

  protected constructor(decimals: number, symbol?: TokenSymbol, name?: string) {
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  public isEqualTo(other: Currency) {
    return other.symbol === this.symbol
  }
}
