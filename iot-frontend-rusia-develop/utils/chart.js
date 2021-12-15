import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated'
import am5themesDark from '@amcharts/amcharts5/themes/Dark'
import am5themesKelly from '@amcharts/amcharts5/themes/Kelly'

export const dispose = () => am5.disposeAllRootElements()

export const Series = (ref, data, device = {}, element = {}) => {
  const mode = localStorage.getItem('nuxt-color-mode')

  const root = am5.Root.new(ref, data)
  root.setThemes([
    am5themesAnimated.new(root),
    mode === 'dark' ? am5themesDark.new(root) : am5themesKelly.new(root),
  ])

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      // panX: false,
      // panY: false,
      // wheelX: 'panX',
      // wheelY: 'zoomX',
      layout: root.verticalLayout,
      maxTooltipDistance: 0,
    })
  )

  chart.set(
    'scrollbarX',
    am5.Scrollbar.new(root, {
      orientation: 'horizontal',
      opacity: 0.4,
      // position: 'absolute',
      // centerX: -120,
      // scale: 0.6,
      // x: am5.Percent(50),
    })
  )

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      extraTooltipPrecision: 2,
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0,
      max: Math.max(data.map((x) => x.value)),
    })
  )
  yAxis.children.moveValue(
    am5.Label.new(root, {
      rotation: -90,
      text: `${device.greenhouse.name} ${device.code}`,
      y: am5.p50,
      centerX: am5.p50,
      fontSize: 9,
      fontWeight: '600',
    }),
    0
  )
  // Create X-Axis
  const xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      baseInterval: { timeUnit: 'minute', count: 4 },
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  )

  xAxis.get('renderer').labels.template.setAll({
    fontSize: 10,
  })

  yAxis.get('renderer').labels.template.setAll({
    fontSize: 10,
  })
  // Create series
  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: `${device.greenhouse.name} ${device.code}`,
      xAxis,
      yAxis,
      valueYField: 'value',
      valueXField: 'date',
      fill: am5.color(0x80bc00),
      opacity: 1,
      stroke: am5.color(0x80bc00),
      tooltip: am5.Tooltip.new(root, {
        fill: am5.color(0x80bc00),
        opacity: 0.9,
      }),
    })
  )

  series.fills.template.setAll({
    fillOpacity: 0.2,
    visible: true,
  })
  series.strokes.template.setAll({
    strokeWidth: 0.5,
  })

  series.data.processor = am5.DataProcessor.new(root, {
    dateFormat: 'dd',
    dateFields: ['date'],
  })

  series
    .get('tooltip')
    .label.set('text', `[bold]{valueY}${element.um}[/]\n{valueX.formatDate()}`)

  // Add cursor
  chart.set(
    'cursor',
    am5xy.XYCursor.new(root, {
      behavior: 'none',
    })
  )

  xAxis.set(
    'tooltip',
    am5.Tooltip.new(root, {
      themeTags: ['axis'],
    })
  )

  series.data.setAll(data)

  // yAxis.set(
  //   'tooltip',
  //   am5.Tooltip.new(root, {
  //     themeTags: ['axis'],
  //   })
  // )
}
