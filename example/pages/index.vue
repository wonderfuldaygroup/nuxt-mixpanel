<template>
  <div>
    It works!
  </div>
</template>

<script>
export default {
  middleware (ctx) {
    ctx.$mixpanel.track('first event', {
      success: '1'
    })
  }
}
</script>
