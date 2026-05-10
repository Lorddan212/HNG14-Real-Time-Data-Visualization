import { BarChart, LineChart, RadarChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

use([
  CanvasRenderer,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  LineChart,
  BarChart,
  RadarChart,
  RadarComponent,
]);
