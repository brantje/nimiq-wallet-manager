<template>
    <img :src="'/icon/'+  address +'.svg'" :class="classes" :height="size" :width="size" >
</template>

<script>
    export default {
        name: 'Identicon',
        props: ['size', 'address', 'classes'],
        data: function () {
            return {}
        }
    }
</script>

<style scoped>

</style>