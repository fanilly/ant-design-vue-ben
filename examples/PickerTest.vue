<template>
  <div>
    <a-date-picker :show-arrow="false" v-model="date" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD">
      <a-input :value="date"></a-input>
    </a-date-picker>
    <a-date-picker
      :show-arrow="false"
      showTime
      v-model="datetime"
      format="YYYY-MM-DD HH:mm:ss"
      valueFormat="YYYY-MM-DD HH:mm:ss"
    >
      <a-input :value="datetime"></a-input>
    </a-date-picker>
    <a-date-picker mode="year" v-model="year" format="YYYY" valueFormat="YYYY">
      <a-input :value="year"></a-input>
    </a-date-picker>
    <a-month-picker mode="month" v-model="month" format="YYYY-MM" valueFormat="YYYY-MM">
      <a-input :value="month"></a-input>
    </a-month-picker>
    <a-time-picker v-model="time" format="HH:mm:ss" valueFormat="HH:mm:ss">
      <a-input :value="time"></a-input>
    </a-time-picker>

    <a-card title="时间区间测试">
      <a-range-picker
        :ranges="ranges"
        :defaultPickerValue="[
          moment(`${moment().format('YYYY-MM-DD')} 00:00:00`, 'YYYY-MM-DD HH:mm:ss'),
          moment(`${moment().format('YYYY-MM-DD')} 23:59:59`, 'YYYY-MM-DD HH:mm:ss'),
        ]"
        allowClear
        :format="'YYYY-MM-DD HH:mm:ss'"
        :valueFormat="'YYYY-MM-DD HH:mm:ss'"
        style="width: 100%"
        :showTime="true"
      ></a-range-picker>
      <a-range-picker></a-range-picker>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment';
const i18nRender = k => {
  const m = {
    'range-picker.ranges.today': '今天',
    'range-picker.ranges.yesterday': '昨日',
    'range-picker.ranges.week': '本周',
    'range-picker.ranges.last-week': '上周',
    'range-picker.ranges.month': '本月',
    'range-picker.ranges.prev-month': '上月',
    'range-picker.ranges.quarter': '本季度',
    'range-picker.ranges.last-quarter': '上季度',
    'range-picker.ranges.year': '今年',
    'range-picker.ranges.last-year': '去年',
    'range-picker.ranges.three-day': '近三天',
    'range-picker.ranges.seven-day': '近七天',
  };
  return m[k];
};
const getDateRanges = () => ({
  today: [moment().startOf('day'), moment().endOf('day')],
  yesterday: [
    moment()
      .subtract(1, 'day')
      .startOf('day'),
    moment()
      .subtract(1, 'day')
      .endOf('day'),
  ],
  week: [moment().startOf('week'), moment().endOf('week')],
  'last week': [
    moment()
      .subtract(1, 'week')
      .startOf('week'),
    moment()
      .subtract(1, 'week')
      .endOf('week'),
  ],
  month: [
    moment()
      .startOf('month')
      .startOf('day'),
    moment()
      .endOf('month')
      .endOf('day'),
  ],
  'last month': [
    moment()
      .subtract(1, 'month')
      .startOf('month'),
    moment()
      .subtract(1, 'month')
      .endOf('month'),
  ],
  year: [moment().startOf('year'), moment().endOf('year')],
  'last year': [
    moment()
      .subtract(1, 'year')
      .startOf('year'),
    moment()
      .subtract(1, 'year')
      .endOf('year'),
  ],
});

// 预置日期范围选择
const getRangePickerPresetOptions = () => {
  const dateRanges = getDateRanges();
  console.log(
    dateRanges['today'].forEach(v => {
      console.log(v.format('YYYY-MM-DD HH:mm:ss'));
    }),
  );
  // const quarterData = ['Q1', 'Q2', 'Q4', 'Q3']
  // const quarterRange = [
  //   ...quarterData.splice(0, Math.ceil((currentMonth + 1) / 3)).reverse(),
  //   ...quarterData.map((v) => `${i18nRender('range-picker.ranges.last-year')}${v}`)
  // ].reduce((prev, next, index) => {
  //   prev[next] = [
  //     moment().subtract(index, 'quarter').startOf('quarter').startOf('day'),
  //     moment().subtract(index, 'quarter').endOf('quarter').endOf('day')
  //   ]
  //   return prev
  // }, {})
  const ranges = {
    [i18nRender('range-picker.ranges.today')]: dateRanges['today'],
    [i18nRender('range-picker.ranges.yesterday')]: dateRanges['yesterday'],
    [i18nRender('range-picker.ranges.week')]: dateRanges['week'],
    [i18nRender('range-picker.ranges.last-week')]: dateRanges['last week'],
    [i18nRender('range-picker.ranges.month')]: dateRanges['month'],
    [i18nRender('range-picker.ranges.prev-month')]: dateRanges['last month'],
    [i18nRender('range-picker.ranges.quarter')]: [
      moment().startOf('quarter'),
      moment().endOf('quarter'),
    ],
    [i18nRender('range-picker.ranges.last-quarter')]: [
      moment()
        .subtract(1, 'quarter')
        .startOf('quarter'),
      moment()
        .subtract(1, 'quarter')
        .endOf('quarter'),
    ],
    // // ...quarterRange,
    [i18nRender('range-picker.ranges.year')]: dateRanges['year'],
    [i18nRender('range-picker.ranges.last-year')]: dateRanges['last year'],
  };

  return ranges;
};
export default {
  data() {
    const ranges = getRangePickerPresetOptions();
    return {
      ranges,
      date: '',
      datetime: '',
      year: '',
      month: '',
      time: '',
    };
  },
  methods: {
    moment,
    openModel() {},
  },
};
</script>
