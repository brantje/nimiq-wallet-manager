<template>
    <span>
        <span class="slot">
            <slot></slot>
        </span>
        <svg class="nq-icon"><use :xlink:href="icon"></use></svg>
    </span>
</template>

<script>
export default {
    name: 'NqIcon',
    data: function () {
        return {
            icon: '',
        }
    },
    created: function () {
        if (this.$slots.default) {
            let slot = this.$slots.default.shift()
            this.icon = `/img/nimiq-style.icons.svg#${slot.text}`
        }
    }

}
</script>

<style scoped>
    .slot {
        display: none;
    }
</style>