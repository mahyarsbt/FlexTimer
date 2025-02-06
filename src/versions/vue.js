<template>
  <div ref="timer"></div>
</template>

<script>
  import { onMounted, ref } from 'vue';
  import FlexTimer from '../index';

  export default {
  props: {
  options: { type: Object, required: false }
}
  setup(props) {
  const timer = ref(null);

  onMounted(() => {
  if (timer.value) {
  const instance = new FlexTimer(timer.value, props.options);
  instance.start();
}
});

  return { timer };
}
};
</script>
