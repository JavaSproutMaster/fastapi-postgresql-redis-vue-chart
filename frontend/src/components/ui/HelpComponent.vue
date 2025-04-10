<template>
  <div class="helper" :class="{
    'helper__bottom': align === 'bottom',
    'helper__top__right': align === 'top_right',
    'helper__top__left': align === 'top_left',
    'helper__right': align === 'right',
    'helper__left': align === 'left',
  }">
    <img src="@/assets/icons/help.svg" alt="Help">
    <div class="helper-hover"
    :style="{width: `${hoverWidth}`, padding: `${hoverPadding}`}">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HelpComponent',
  props: {
    align: {
      type: String,
      enum: ['top', 'bottom', 'top_right', 'bottom_left'],
      default: 'top',
    },
    hoverWidth: {
      type: String,
      default: '217px',
    },
    hoverPadding: {
      type: String,
      default: '12px 16px',
    },
  },
});
</script>

<style>
.helper {
  position: relative;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.helper > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.helper > .helper-hover {
  display: none;
  position: absolute;
  background: #D6DBFD;
  font-size: 12px;
  line-height: 14px;
  font-weight: 600;
  color: var(--theme-link-color);
  text-align: center;
  padding: 12px 16px;
  left: 50%;
  top: -10px;
  transform: translate(-50%, -100%);
  z-index: 5;
}

.helper.helper__bottom > .helper-hover {
  top: auto;
  bottom: 0;
  transform: translate(-50%, calc(100% + 10px));
}

.helper:hover > .helper-hover {
  display: block;
  width: 217px;
  border-radius: 10px;
  text-transform: none;
}

.helper:hover > .helper-hover::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -19px;
  transform: translateX(-50%);
  border: 10px solid transparent;
  border-top: 10px solid #D6DBFD;
}

.helper.helper__bottom > .helper-hover::after {
  bottom: auto;
  top: -19px;
  transform: translateX(-50%) rotateX(180deg);
}
.helper.helper__top__right > .helper-hover {
  top: -10px;
  left: 0;
  transform: translate(0%, calc(-100% - 10px));
}

.helper.helper__right > .helper-hover::after {
  /* bottom: 100%; */
  /* top: -19px; */
  /* left: -50%; */
  transform: translate(-50%, calc(50%)) rotateZ(90deg);
}
.helper.helper__right:hover > .helper-hover::after {
  content: '';
  position: absolute;
  left: -9px;
  bottom: 50%;
  /* transform: translateX(-50%); */
  border: 10px solid transparent;
  border-top: 10px solid #D6DBFD;
}
.helper.helper__right > .helper-hover {
  top: 10px;
  left: 30px;
  transform: translate(0%, calc(-50%));
}

.helper.helper__left > .helper-hover {
  top: 10px;
  left: -20px;
  transform: translate(-100%, calc(-50%));
}
.helper.helper__left > .helper-hover::after {
  /* bottom: 100%; */
  /* top: -19px; */
  /* left: 0%; */
  transform: translate(50%, calc(50%)) rotateZ(-90deg);
}
.helper.helper__left:hover > .helper-hover::after {
  content: '';
  position: absolute;
  left: calc(100% - 11px);
  /* right: -9px; */
  bottom: 50%;
  /* transform: translateX(-50%); */
  border: 10px solid transparent;
  border-top: 10px solid #D6DBFD;
}
/* .helper.helper__right > .helper-hover::after {
  /* transform: rotateX(270deg); */
  /* top: 50%; */
  /* left: 0%; */
  /* transform: translate(-100%, calc(-50%)) rotateZ(180deg); */
  /* clip-path: inset(0 50% 0 0); /* Show only the right half */
  /* clip-path: polygon(100% 0, 100% 50%, 50% 100%, 0 50%); */
  /* content: "\25B6"; */
  /* color: #000000; */
  /* left: 0;
  top: 50%; */
  /* transform: rotateX(180deg); */
  /* display: inline-block;
  margin-right: 6px; */
/* }  */

.helper.helper__top__right:hover > .helper-hover {
  border-radius: 10px 10px 10px 0;
}
.helper.helper__top__right > .helper-hover::after {
  left: 0%;
  transform: translateX(-50%);
  clip-path: inset(0 0 0 50%); /* Show only the right half */
}

.helper.helper__top__left > .helper-hover {
  top: -8px;
  left: 0;
  transform: translate(calc(-100% + 10px), -100%);
}

.helper.helper__top__left:hover > .helper-hover {
  border-radius: 10px 10px 0 10px;
}
.helper.helper__top__left > .helper-hover::after {
  left: 100%;
  width: 5px;
  clip-path: inset(0 50% 0 0); /* Show only the right half */
}
</style>
