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
      <a-range-picker showTime :ranges="ranges" footerPositionTop></a-range-picker>
      <a-range-picker></a-range-picker>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment';
export default {
  data() {
    const ranges = {
      上月: [
        moment()
          .subtract(1, 'month')
          .startOf('month')
          .startOf('day'),
        moment()
          .subtract(1, 'month')
          .endOf('month')
          .endOf('day'),
      ],
    };
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
    openModel() {},
  },
};
</script>
