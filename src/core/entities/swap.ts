import type { Address, Deadline } from '../types'
import { computeTransactionFee, deadlineFiveMinutesFromNow } from '../utils'
import Wei from './Wei'
import CommonContracts from './CommonContracts'
import { Agent } from './agent'
import { BuiltMethod, IsomorphicOverrides } from './isomorphic-contract'

export interface AddrsPair {
  addressA: Address
  addressB: Address
}

export interface SwapPropsBase extends AddrsPair {
  /**
   * By default it is 5 minutes from now.
   */
  deadline?: Deadline
}

export interface SwapExactAForB<A extends string, B extends string> {
  mode: `exact-${A}-for-${B}`
  amountIn: Wei
  amountOutMin: Wei
}

export interface SwapAForExactB<A extends string, B extends string> {
  mode: `${A}-for-exact-${B}`
  amountOut: Wei
  amountInMax: Wei
}

export type SwapExactForAndForExact<A extends string, B extends string> = SwapAForExactB<A, B> | SwapExactAForB<A, B>

export type SwapProps = SwapPropsBase &
  (
    | SwapExactForAndForExact<'tokens', 'tokens'>
    | SwapExactForAndForExact<'tokens', 'eth'>
    | SwapExactForAndForExact<'eth', 'tokens'>
  )

export interface SwapResult {
  fee: Wei
  send: () => Promise<unknown>
}

interface GetAmountsInProps extends AddrsPair {
  mode: 'in'
  amountOut: Wei
}

interface GetAmountsOutProps extends AddrsPair {
  mode: 'out'
  amountIn: Wei
}

type GetAmountsProps = GetAmountsInProps | GetAmountsOutProps

export class SwapAnon {
  #contracts: CommonContracts

  public constructor(props: { contracts: CommonContracts }) {
    this.#contracts = props.contracts
  }

  protected get router() {
    return this.#contracts.router
  }

  public async getAmounts(props: GetAmountsProps): Promise<[Wei, Wei]> {
    const path = [props.addressA, props.addressB]
    const [amount0, amount1] = await (props.mode === 'in'
      ? this.router.getAmountsIn([props.amountOut.asStr, path]).call()
      : this.router.getAmountsOut([props.amountIn.asStr, path]).call())
    return [new Wei(amount0), new Wei(amount1)]
  }
}

export class Swap extends SwapAnon {
  #agent: Agent

  public constructor(props: { agent: Agent; contracts: CommonContracts }) {
    super(props)
    this.#agent = props.agent
  }

  public async prepareSwap(props: SwapProps): Promise<SwapResult> {
    const { deadline = deadlineFiveMinutesFromNow() } = props
    const { router } = this
    const { address } = this.#agent
    const gasPrice = await this.#agent.getGasPrice()

    const baseOverrides: IsomorphicOverrides = {
      gasPrice,
      from: address,
    }

    let method: BuiltMethod<unknown>

    switch (props.mode) {
      case 'exact-tokens-for-tokens': {
        method = router.swapExactTokensForTokens(
          [props.amountIn.asStr, props.amountOutMin.asStr, [props.addressA, props.addressB], address, deadline],
          baseOverrides,
        )

        break
      }
      case 'tokens-for-exact-tokens': {
        method = router.swapTokensForExactTokens(
          [props.amountInMax.asStr, props.amountOut.asStr, [props.addressA, props.addressB], address, deadline],
          baseOverrides,
        )

        break
      }
      case 'exact-tokens-for-eth': {
        method = router.swapExactTokensForETH(
          [props.amountIn.asStr, props.amountOutMin.asStr, [props.addressA, props.addressB], address, deadline],
          baseOverrides,
        )

        break
      }
      case 'exact-eth-for-tokens': {
        method = router.swapExactETHForTokens(
          [props.amountOutMin.asStr, [props.addressA, props.addressB], address, deadline],
          { ...baseOverrides, value: props.amountIn },
        )

        break
      }
      case 'eth-for-exact-tokens': {
        method = router.swapETHForExactTokens(
          [props.amountOut.asStr, [props.addressA, props.addressB], address, deadline],
          { ...baseOverrides, value: props.amountInMax },
        )

        break
      }
      case 'tokens-for-exact-eth': {
        method = router.swapTokensForExactETH(
          [props.amountOut.asStr, props.amountInMax.asStr, [props.addressA, props.addressB], address, deadline],
          baseOverrides,
        )

        break
      }

      default: {
        const badProps: never = props
        throw new Error(`Bad props: ${String(badProps)}`)
      }
    }

    const { estimateGas, send: sendWithGas } = method
    const gas = await estimateGas()
    const send = () => sendWithGas({ gas })

    const fee = computeTransactionFee(gasPrice, gas)

    return { fee, send }
  }
}
