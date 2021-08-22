import { shallowMount } from '@vue/test-utils';
import InputRange from '@/components/InputRange.vue';

describe('InputRange.vue', () => {
  it('has an input element', () => {
    const wrapper = shallowMount(InputRange, {
      // props: { msg },
    });
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
  });
});
