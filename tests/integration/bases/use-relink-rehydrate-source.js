import { act } from 'react-test-renderer'
import { createCompoundHookInterface } from '../../__utils__/hook-interface'

export default function ({ Relink }) {
  const { createSource, useRehydrateRelinkSource, useRelinkValue } = Relink
  describe('useRehydrateRelinkSource', () => {
    it('Normal', () => {
      let didSetCalled = false

      const Source = createSource({
        default: 1,
        lifecycle: {
          didSet: () => {
            didSetCalled = true
          },
        },
      })
      const compoundHookInterface = createCompoundHookInterface({
        a: {
          hook: {
            method: useRehydrateRelinkSource,
            props: [Source],
          },
          actions: {
            rehydrate: ({ H: rehydrateSource }) => {
              rehydrateSource(({ commit }) => {
                commit(5)
              })
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

      act(() => {
        compoundHookInterface.at('a').actions('rehydrate')
      })
      expect(compoundHookInterface.at('b').get('value')).toBe('5')
      expect(didSetCalled).toBe(false)

      compoundHookInterface.cleanup()
    })
  })
}
