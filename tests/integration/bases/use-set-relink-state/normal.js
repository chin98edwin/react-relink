import { createCompoundHookInterface } from '../../../__utils__/hook-interface'

export default function ({ Relink }) {
  const { createSource, useSetRelinkState, useRelinkValue } = Relink
  it('Normal + No unnecessary re-rendering', () => {
    const Source = createSource({
      default: 1,
    })
    const compoundHookInterface = createCompoundHookInterface({
      a: {
        hook: {
          method: useSetRelinkState,
          props: [Source],
        },
        actions: {
          step: ({ H: setState }) => {
            setState((c) => c + 1)
          },
          replace: ({ H: setState }) => {
            setState(5)
          },
        },
      },
      b: {
        hook: {
          method: useRelinkValue,
          props: [Source],
        },
        values: {
          value: (H) => H,
        },
      },
    })

    // Initial phase
    expect(compoundHookInterface.at('b').get('value')).toBe('1')

    // Update phase - callback
    compoundHookInterface.at('a').actions('step')
    expect(compoundHookInterface.at('b').get('value')).toBe('2')

    // Update phase - replace value
    compoundHookInterface.at('a').actions('replace')
    expect(compoundHookInterface.at('b').get('value')).toBe('5')

    // Check if A, which only uses the setter, performs extra re-renders
    expect(compoundHookInterface.at('a').getRenderCount()).toBe(1)

    compoundHookInterface.cleanup()
  })
}
