import PropTypes from '../../_util/vue-types';
import moment from 'moment';
import { getMonthName } from './util/index';
import enUs from './locale/en_US';

const YEAR_RANGE_SHORTCUTS = [
  { key: 'fullYear', label: 'Full year' },
  { key: 'firstHalf', label: 'First half' },
  { key: 'secondHalf', label: 'Second half' },
  { key: 'lastSixMonths', label: 'Last 6 months' },
  { key: 'lastYear', label: 'Last year' },
  { key: 'lastTwoYears', label: 'Last 2 years' },
  { key: 'lastThreeYears', label: 'Last 3 years' },
  { key: 'lastFourYears', label: 'Last 4 years' },
  { key: 'lastFiveYears', label: 'Last 5 years' },
];

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
      const count = mode === 'year' ? 15 : mode === 'quarter' ? 24 : 16;
      return count;
    },
    yearRangeShortcuts() {
      const { locale } = this;
      return YEAR_RANGE_SHORTCUTS.map(({ key, label }) => ({
        key,
        label: locale[key] || label,
      }));
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
    chooseYearRange(type) {
      const { yearActived } = this;
      const today = moment().startOf('day');
      const rollingRanges = {
        lastSixMonths: [6, 'months'],
        lastYear: [1, 'years'],
        lastTwoYears: [2, 'years'],
        lastThreeYears: [3, 'years'],
        lastFourYears: [4, 'years'],
        lastFiveYears: [5, 'years'],
      };
      let range;

      switch (type) {
        case 'fullYear':
          range = [
            moment()
              .year(yearActived)
              .startOf('year'),
            moment()
              .year(yearActived)
              .endOf('year'),
          ];
          break;
        case 'firstHalf':
          range = [
            moment()
              .year(yearActived)
              .startOf('year'),
            moment()
              .year(yearActived)
              .month(5)
              .endOf('month'),
          ];
          break;
        case 'secondHalf':
          range = [
            moment()
              .year(yearActived)
              .month(6)
              .startOf('month'),
            moment()
              .year(yearActived)
              .endOf('year'),
          ];
          break;
        default:
          range = [today.clone().subtract(...rollingRanges[type]), moment().endOf('day')];
      }

      this.$emit('rangeChange', range);
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
    const {
      lModeDatas,
      prefixCls,
      extraFooterHeight,
      mode,
      yearActived,
      yearRangeShortcuts,
    } = this;
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
          <div
            class={{
              [`${prefixClsCustom}-body`]: true,
              [`${prefixClsCustom}-body-with-shortcuts`]: mode === 'year',
            }}
          >
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
            {mode === 'year' ? (
              <div class={`${prefixClsCustom}-shortcuts`}>
                {yearRangeShortcuts.map(v => (
                  <div
                    class={`${prefixClsCustom}-shortcuts-item`}
                    key={v.key}
                    onClick={() => this.chooseYearRange(v.key)}
                  >
                    {v.label}
                  </div>
                ))}
              </div>
            ) : null}
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
