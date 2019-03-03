<template>
    <div class="address-input">
        <input v-model="addressInput" type="text" :placeholder="placeholder" />
        <div v-if="error" class="error nq-red-bg">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'Address',
    props: ['address', 'placeholder'],
    data: function () {
        return {
            error: '',
            addressInput: this.address
        }
    },
    watch: {
        addressInput: function () {
            this.checkAddress()
        },
        address: function () {
            this.addressInput = this.address
        },
    },
    methods: {
        checkAddress: function () {
            if (this.addressInput === '' || this.address) {
                this.error = ''
            }
            let address
            try {
                address = Nimiq.Address.fromUserFriendlyAddress(this.addressInput)
            } catch (e) {
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
        width: 100%;
    }

    .error {
        padding: 5px;
    }

</style>