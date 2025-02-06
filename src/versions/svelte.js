<script>
  import { onMount } from 'svelte';
  import FlexTimer from '../index';

  export let options = {};
  let timerElement;

  onMount(() => {
  if (timerElement) {
  new FlexTimer(timerElement, options).start();
}
});
</script>

<div bind:this={timerElement}></div>
