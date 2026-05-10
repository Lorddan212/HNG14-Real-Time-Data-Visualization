<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <input
      class="ui-input"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel || label"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    ariaLabel?: string;
    type?: 'text' | 'search';
  }>(),
  {
    label: undefined,
    placeholder: '',
    ariaLabel: undefined,
    type: 'text',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
