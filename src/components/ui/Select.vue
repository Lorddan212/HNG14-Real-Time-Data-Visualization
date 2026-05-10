<template>
  <label class="ui-field">
    <span v-if="label" class="ui-field__label">{{ label }}</span>
    <select
      class="ui-select"
      :value="modelValue"
      :aria-label="ariaLabel || label"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
export interface SelectOption {
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    modelValue: string;
    options: SelectOption[];
    label?: string;
    ariaLabel?: string;
  }>(),
  {
    label: undefined,
    ariaLabel: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
