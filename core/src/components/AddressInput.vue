<template>
    <div class="address-input">
        <input v-model="address" type="text" placeholder="Enter address" />
        <div v-if="error" class="error nq-red-bg">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Address',
    props: ['address'],
    data: function () {
        return {
            error: ''
        }
    },
    watch: {
        address: function () {
            this.checkAddress()
        }
    },
    methods: {
        checkAddress: function () {
            if (this.address === '') {
                this.error = ''
            }
            let address
            try {
                address = Nimiq.Address.fromUserFriendlyAddress(this.address)
            } catch (e) {
                console.log(e)
                this.error = 'Invalid address'
            }
            if (address) {
                this.error = ''
                this.$emit('changed', address.toUserFriendlyAddress())
            }
        }
    }
}
</script>

<style scoped>
    .address-input {
        display: inline-block;
    }

    .error {
        padding: 5px;
    }

</style>