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
  </div>
</template>
<script>
export default {
  data() {
    return {
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
