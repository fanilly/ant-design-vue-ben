import PropTypes from '../../_util/vue-types';
import moment from 'moment';
import { getMonthName } from './util/index';
import enUs from './locale/en_US';

const RangeCalendarCustomSelector = {
  props: {
    mode: PropTypes.oneOf(['year', 'quarter', 'month']),
    locale: PropTypes.object.def(enUs),
    prefixCls: PropTypes.string,
    extraFooterHeight: PropTypes.number,
    defaultYear: PropTypes.number,
  },

  data() {
    const { locale, defaultYear } = this;
    const current = moment();
    const months = new Array(12).fill(1).map((v, i) => {
      current.month(i);
      const content = getMonthName(current);
      return {
        value: i,
        content,
        title: content,
      };
    });
    const quarters = [locale.quarter1, locale.quarter2, locale.quarter3, locale.quarter4];
    const year = defaultYear || Number(moment().format('YYYY'));
    return {
      yearActived: year,
      currentYear: year,
      lModeDatas: {
        years: [],
        months,
        quarters,
      },
    };
  },

  created() {
    const { lModeDatas } = this;
    lModeDatas.years = this.getYears(this.currentYear);
  },

  watch: {
    mode() {
      this.lModeDatas.years = this.getYears(this.currentYear);
    },
  },

  computed: {
    yearCount() {
      const { mode } = this;
      const count = mode === 'year' ? 32 : mode === 'quarter' ? 24 : 16;
      return count;
    },
  },

  methods: {
    getYears(currentYear) {
      const { yearCount } = this;
      const medianValue = Math.floor(yearCount / 2);
      return new Array(yearCount)
        .fill(0)
        .map((v, i) =>
          i < medianValue ? currentYear - medianValue + i : currentYear + i - medianValue,
        );
    },
    chooseYear(year) {
      this.yearActived = year;
      if (this.mode !== 'year') return;
      this.$emit('rangeChange', [
        moment()
          .year(year)
          .startOf('year'),
        moment()
          .year(year)
          .endOf('year'),
      ]);
    },
    chooseQuarter(quarter) {
      const { yearActived } = this;
      this.$emit('rangeChange', [
        moment()
          .year(yearActived)
          .quarter(quarter)
          .startOf('quarter'),
        moment()
          .year(yearActived)
          .quarter(quarter)
          .endOf('quarter'),
      ]);
    },
    chooseMonth(month) {
      const { yearActived } = this;
      this.$emit('rangeChange', [
        moment()
          .year(yearActived)
          .month(month)
          .startOf('month'),
        moment()
          .year(yearActived)
          .month(month)
          .endOf('month'),
      ]);
    },
    toggleYears(type) {
      const { currentYear, yearCount, lModeDatas } = this;
      this.currentYear =
        type === 'prev'
          ? currentYear - Math.floor(yearCount / 2)
          : currentYear + Math.floor(yearCount / 2);
      lModeDatas.years = this.getYears(this.currentYear);
    },
  },

  render() {
    const { lModeDatas, prefixCls, extraFooterHeight, mode, yearActived } = this;
    const prefixClsCustom = `${prefixCls}-custom-selector`;
    const cls = {
      [`${prefixClsCustom}`]: true,
      [`${prefixClsCustom}-${mode}`]: true,
      [`${prefixCls}-${mode}`]: true,
    };

    return (
      <div class={cls} style={{ bottom: `${extraFooterHeight + 1}px` }}>
        <div class={`${prefixClsCustom}-wrapper`}>
          <div class={[`${prefixClsCustom}-header`, `${prefixCls}-header`]}>
            <a
              class={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={() => this.toggleYears('prev')}
            />
            <a class={`${prefixCls}-year-select`} role="button">
              {lModeDatas.years[0]} - {lModeDatas.years[lModeDatas.years.length - 1]}({yearActived})
            </a>
            <a class={`${prefixCls}-next-year-btn`} onClick={() => this.toggleYears('next')} />
          </div>
          <div class={`${prefixClsCustom}-body`}>
            <div class={`${prefixClsCustom}-years`}>
              {lModeDatas.years.map(v => (
                <div
                  class={{
                    [`active`]: this.yearActived == v,
                    [`${prefixClsCustom}-years-item`]: true,
                  }}
                  key={v}
                  onClick={() => this.chooseYear(v)}
                >
                  {v}
                </div>
              ))}
            </div>
            {mode === 'quarter' ? (
              <div class={`${prefixClsCustom}-quarters`}>
                {lModeDatas.quarters.map((v, i) => (
                  <div
                    class={`${prefixClsCustom}-quarters-item`}
                    key={v}
                    onClick={() => this.chooseQuarter(i + 1)}
                  >
                    {v}
                  </div>
                ))}
              </div>
            ) : null}
            {mode === 'month' ? (
              <div class={`${prefixClsCustom}-months`}>
                {lModeDatas.months.map(v => (
                  <div
                    class={`${prefixClsCustom}-months-item`}
                    key={v.value}
                    onClick={() => this.chooseMonth(v.value)}
                  >
                    {v.title}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
};

export default RangeCalendarCustomSelector;
