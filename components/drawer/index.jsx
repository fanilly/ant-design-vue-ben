import classnames from 'classnames';
import omit from 'omit.js';
import VcDrawer from '../vc-drawer/src';
import PropTypes from '../_util/vue-types';
import BaseMixin from '../_util/BaseMixin';
import Icon from '../icon';
import { getComponentFromProp, getOptionProps, getListeners } from '../_util/props-util';
import addEventListener from '../vc-util/Dom/addEventListener';
import debounce from 'lodash/debounce';

import { ConfigConsumerProps } from '../config-provider/configConsumerProps';
import Base from '../base';
const getDraggableX = (placement, winWidth, newWidth, minSize) =>
  placement === 'right' ? Math.max(winWidth - newWidth, minSize) : newWidth;
const getDraggableY = (placement, winHeight, newHeight, minSize) =>
  placement === 'bottom' ? Math.max(winHeight - newHeight, minSize) : newHeight;

const Drawer = {
  name: 'ADrawer',
  props: {
    closable: PropTypes.bool.def(true),
    destroyOnClose: PropTypes.bool,
    getContainer: PropTypes.any,
    maskClosable: PropTypes.bool.def(true),
    resizable: PropTypes.bool.def(true),
    minSize: PropTypes.number.def(60),
    mask: PropTypes.bool.def(true),
    maskStyle: PropTypes.object,
    wrapStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    drawerStyle: PropTypes.object,
    title: PropTypes.any,
    visible: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(256),
    zIndex: PropTypes.number,
    prefixCls: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).def('right'),
    level: PropTypes.any.def(null),
    wrapClassName: PropTypes.string, // not use class like react, vue will add class to root dom
    handle: PropTypes.any,
    afterVisibleChange: PropTypes.func,
    keyboard: PropTypes.bool.def(true),
  },
  mixins: [BaseMixin],
  data() {
    let windowWidth = document.documentElement.clientWidth,
      windowHeihgt = document.documentElement.clientHeight;

    let newWidth = parseFloat(this.width),
      newHeight = parseFloat(this.height);
    let draggableX = getDraggableX(this.placement, windowWidth, newWidth, this.minSize),
      draggableY = getDraggableY(this.placement, windowHeihgt, newHeight, this.minSize);

    this.destroyClose = false;
    this.preVisible = this.$props.visible;
    return {
      windowWidth,
      windowHeihgt,
      newWidth,
      newHeight,
      draggableX,
      draggableY,
      _push: false,
    };
  },
  watch: {
    width(newVal) {
      this.newWidth = parseFloat(newVal);
    },
    height(newVal) {
      this.newHeight = parseFloat(newVal);
    },
  },
  inject: {
    parentDrawer: {
      default: () => null,
    },
    configProvider: { default: () => ConfigConsumerProps },
  },
  provide() {
    return {
      parentDrawer: this,
    };
  },
  mounted() {
    // fix: delete drawer in child and re-render, no push started.
    // <Drawer>{show && <Drawer />}</Drawer>
    const { visible } = this;
    if (visible && this.parentDrawer) {
      this.parentDrawer.push();
    }
  },
  updated() {
    this.$nextTick(() => {
      if (this.preVisible !== this.visible && this.parentDrawer) {
        if (this.visible) {
          this.parentDrawer.push();
        } else {
          this.parentDrawer.pull();
        }
      }
      this.preVisible = this.visible;
    });
  },
  beforeDestroy() {
    // unmount drawer in child, clear push.
    if (this.parentDrawer) {
      this.parentDrawer.pull();
    }
  },
  created: function created() {
    this.debouncedWindowResize = debounce(this.handleWindowResize, 150);
  },
  mounted: function mounted() {
    let self = this;
    this.$nextTick(function() {
      self.handleWindowResize();
      self.resizeEvent = addEventListener(window, 'resize', self.debouncedWindowResize);
    });
  },
  updated: function updated() {
    var self = this;
    this.$nextTick(function() {
      self.handleWindowResize();
      if (!self.resizeEvent) {
        self.resizeEvent = addEventListener(window, 'resize', self.debouncedWindowResize);
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.resizeEvent) {
      this.resizeEvent.remove();
    }
    if (this.debouncedWindowResize) {
      this.debouncedWindowResize.cancel();
    }
  },

  methods: {
    handleWindowResize() {
      this.windowWidth = document.documentElement.clientWidth;
      this.draggableX = getDraggableX(
        this.placement,
        this.windowWidth,
        this.newWidth,
        this.minSize,
      );
      this.windowHeihgt = document.documentElement.clientHeight;
      this.draggableY = getDraggableY(
        this.placement,
        this.windowHeihgt,
        this.newHeight,
        this.minSize,
      );
    },
    domFocus() {
      if (this.$refs.vcDrawer) {
        this.$refs.vcDrawer.domFocus();
      }
    },
    close(e) {
      this.$emit('close', e);
    },
    // onMaskClick(e) {
    //   if (!this.maskClosable) {
    //     return;
    //   }
    //   this.close(e);
    // },
    push() {
      this.setState({
        _push: true,
      });
    },
    pull() {
      this.setState(
        {
          _push: false,
        },
        () => {
          this.domFocus();
        },
      );
    },
    onDestroyTransitionEnd() {
      const isDestroyOnClose = this.getDestroyOnClose();
      if (!isDestroyOnClose) {
        return;
      }
      if (!this.visible) {
        this.destroyClose = true;
        this.$forceUpdate();
      }
    },

    getDestroyOnClose() {
      return this.destroyOnClose && !this.visible;
    },
    // get drawar push width or height
    getPushTransform(placement) {
      if (placement === 'left' || placement === 'right') {
        return `translateX(${placement === 'left' ? 180 : -180}px)`;
      }
      if (placement === 'top' || placement === 'bottom') {
        return `translateY(${placement === 'top' ? 180 : -180}px)`;
      }
    },
    getRcDrawerStyle() {
      const { zIndex, placement, wrapStyle } = this.$props;
      const { _push: push } = this.$data;
      return {
        zIndex,
        transform: push ? this.getPushTransform(placement) : undefined,
        ...wrapStyle,
      };
    },
    renderHeader(prefixCls) {
      const { closable, headerStyle } = this.$props;
      const title = getComponentFromProp(this, 'title');
      if (!title && !closable) {
        return null;
      }

      const headerClassName = title ? `${prefixCls}-header` : `${prefixCls}-header-no-title`;
      return (
        <div class={headerClassName} style={headerStyle}>
          {title && <div class={`${prefixCls}-title`}>{title}</div>}
          {closable ? this.renderCloseIcon(prefixCls) : null}
        </div>
      );
    },
    renderCloseIcon(prefixCls) {
      const { closable } = this;
      return (
        closable && (
          <button key="closer" onClick={this.close} aria-label="Close" class={`${prefixCls}-close`}>
            <Icon type="close" />
          </button>
        )
      );
    },
    // render drawer body dom
    renderBody(prefixCls) {
      if (this.destroyClose && !this.visible) {
        return null;
      }
      this.destroyClose = false;
      const { bodyStyle, drawerStyle } = this.$props;

      const containerStyle = {};

      const isDestroyOnClose = this.getDestroyOnClose();
      if (isDestroyOnClose) {
        // Increase the opacity transition, delete children after closing.
        containerStyle.opacity = 0;
        containerStyle.transition = 'opacity .3s';
      }

      return (
        <div
          class={`${prefixCls}-wrapper-body`}
          style={{ ...containerStyle, ...drawerStyle }}
          onTransitionend={this.onDestroyTransitionEnd}
        >
          {this.renderHeader(prefixCls)}
          <div key="body" class={`${prefixCls}-body`} style={bodyStyle}>
            {this.$slots.default}
          </div>
        </div>
      );
    },
  },
  render() {
    const props = getOptionProps(this);
    const {
      prefixCls: customizePrefixCls,
      visible,
      placement,
      wrapClassName,
      mask,
      ...rest
    } = props;
    const width = this.newWidth;
    const height = this.newHeight;
    const { windowWidth, windowHeihgt, minSize } = this;
    const xMin = windowWidth - minSize;
    const yMin = windowHeihgt - minSize;
    const haveMask = mask ? '' : 'no-mask';
    const offsetStyle = {};
    if (placement === 'left' || placement === 'right') {
      offsetStyle.width = typeof width === 'number' ? `${width}px` : width;
    } else {
      offsetStyle.height = typeof height === 'number' ? `${height}px` : height;
    }
    const handler = getComponentFromProp(this, 'handle') || false;
    const getPrefixCls = this.configProvider.getPrefixCls;
    const prefixCls = getPrefixCls('drawer', customizePrefixCls);

    const vcDrawerProps = {
      ref: 'vcDrawer',
      props: {
        ...omit(rest, [
          'closable',
          'destroyOnClose',
          'drawerStyle',
          'headerStyle',
          'bodyStyle',
          'title',
          'width',
          'height',
          'push',
          'visible',
          'getPopupContainer',
          'rootPrefixCls',
          'getPrefixCls',
          'renderEmpty',
          'csp',
          'pageHeader',
          'autoInsertSpaceInButton',
        ]),
        draggableX: this.draggableX,
        draggableY: this.draggableY,
        width: this.newWidth,
        height: this.newHeight,
        handler,
        ...offsetStyle,
        prefixCls,
        open: visible,
        showMask: mask,
        placement,
        className: classnames({
          [wrapClassName]: !!wrapClassName,
          [haveMask]: !!haveMask,
        }),
        wrapStyle: this.getRcDrawerStyle(),
      },
      on: {
        ...getListeners(this),
        sizeChange: (x, y) => {
          switch (placement) {
            case 'right':
              this.newWidth = Math.min(xMin, windowWidth - Math.min(x, xMin));
              break;
            case 'left':
              this.newWidth = Math.min(Math.max(minSize, x), xMin);
              break;
            case 'top':
              this.newHeight = Math.min(Math.max(minSize, y), yMin);
              break;
            case 'bottom':
              this.newHeight = Math.min(yMin, windowHeihgt - Math.min(y, yMin));
              break;

            default:
              break;
          }

          this.$emit('drawerResizable', this.newWidth, this.newHeight);
        },
        sizeChangeStop: (x, y) => {
          let curWidth = 0,
            curHeight = 0;
          switch (placement) {
            case 'right':
              curWidth = Math.min(xMin, windowWidth - Math.min(x, xMin));
              this.newWidth = curWidth === this.newWidth ? curWidth + 1 : curWidth;
              this.draggableX = windowWidth - this.newWidth;
              break;
            case 'left':
              curWidth = Math.min(Math.max(minSize, x), xMin);
              this.newWidth = curWidth === this.newWidth ? curWidth + 1 : curWidth;
              this.draggableX = this.newWidth;
              break;
            case 'top':
              curHeight = Math.min(Math.max(minSize, y), yMin);
              this.newHeight = curHeight === this.newHeight ? curHeight + 1 : curHeight;
              this.draggableY = this.newHeight;
              break;
            case 'bottom':
              curHeight = Math.min(yMin, windowHeihgt - Math.min(y, yMin));
              this.newHeight = curHeight === this.newHeight ? curHeight + 1 : curHeight;
              this.draggableY = windowHeihgt - this.newHeight;
              break;

            default:
              break;
          }

          this.$emit('drawerResizable', this.newWidth, this.newHeight);
        },
      },
    };
    return <VcDrawer {...vcDrawerProps}>{this.renderBody(prefixCls)}</VcDrawer>;
  },
};

/* istanbul ignore next */
Drawer.install = function(Vue) {
  Vue.use(Base);
  Vue.component(Drawer.name, Drawer);
};

export default Drawer;
