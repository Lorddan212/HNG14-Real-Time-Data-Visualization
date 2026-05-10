<template>
  <button
    class="ui-toggle"
    :class="{ 'ui-toggle--on': modelValue }"
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="ariaLabel"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span class="ui-toggle__thumb" />
    <span v-if="$slots.default" class="ui-toggle__label"><slot /></span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: boolean;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
