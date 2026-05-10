<template>
  <article class="metric-card" :class="`metric-card--${tone}`">
    <div class="metric-card__top">
      <div>
        <p class="metric-card__label">{{ title }}</p>
        <strong class="metric-card__value">{{ formattedValue }}</strong>
      </div>
      <div class="metric-card__icon">
        <component :is="icon" :size="19" aria-hidden="true" />
      </div>
    </div>

    <div class="metric-card__footer">
      <span class="metric-card__trend" :class="{ 'metric-card__trend--down': trend < 0 }">
        {{ trend >= 0 ? '+' : '' }}{{ trend.toFixed(1) }}%
      </span>
      <svg class="sparkline" viewBox="0 0 120 36" role="img" :aria-label="`${title} sparkline`">
        <polyline class="sparkline__line" :points="sparklinePoints" />
      </svg>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type Component } from 'vue';
import { formatCompact, formatMbps, formatMs, formatNumber, formatPercent } from '@/utils/formatters';

const props = withDefaults(
  defineProps<{
    title: string;
    value: number;
    trend: number;
    points: number[];
    format?: 'number' | 'compact' | 'percent' | 'ms' | 'mbps';
    tone?: 'blue' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'red';
    icon: Component;
  }>(),
  {
    format: 'number',
    tone: 'blue',
  },
);

const displayValue = ref(props.value);
let frameId: number | null = null;

function animateTo(target: number) {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }

  const start = displayValue.value;
  const startedAt = performance.now();
  const duration = 420;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - (1 - progress) ** 3;
    displayValue.value = start + (target - start) * eased;

    if (progress < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(tick);
}

watch(
  () => props.value,
  (value) => animateTo(value),
);

onBeforeUnmount(() => {
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
  }
});

const formattedValue = computed(() => {
  const value = displayValue.value;
  if (props.format === 'compact') {
    return formatCompact(value);
  }
  if (props.format === 'percent') {
    return formatPercent(value);
  }
  if (props.format === 'ms') {
    return formatMs(value);
  }
  if (props.format === 'mbps') {
    return formatMbps(value);
  }
  return formatNumber(value);
});

const sparklinePoints = computed(() => {
  const values = props.points.slice(-28);

  if (values.length < 2) {
    return '0,28 120,28';
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 120;
      const y = 32 - ((value - min) / range) * 26;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
});
</script>
