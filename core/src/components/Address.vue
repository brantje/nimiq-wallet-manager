<template>
    <div class="address" @click.prevent="copy">
        <span v-if="!displayAddress">{{ address | getAddressLabel }}</span>
        <span v-if="displayAddress">{{ address }}</span>
        <div class="copy-hover">
            Click to copy
        </div>
        <div class="copied-cover">
            Copied!
        </div>
    </div>
</template>

<script>
import {getAddressLabel} from 'filters/getAddressLabel'

export default {
    name: 'Address',
    filters: {
        getAddressLabel
    },
    props: ['address', 'displayAddress'],
    data: function () {
        return {}
    },
    methods: {
        fallbackCopyTextToClipboard: function(text) {
            var textArea = document.createElement('textarea')
            textArea.value = text
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                var successful = document.execCommand('copy')
                var msg = successful ? 'successful' : 'unsuccessful'
                console.log('Fallback: Copying text command was ' + msg)
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err)
            }

            document.body.removeChild(textArea)
        },
        copy: function () {
            if (!navigator.clipboard) {
                this.fallbackCopyTextToClipboard(this.address)
                return
            }
            navigator.clipboard.writeText(this.address).then(() => {
                console.log('Async: Copying to clipboard was successful!')
                this.$el.classList.add('copied')
                setTimeout(() => this.$el.classList.remove('copied'), 400)
            }, function(err) {
                console.error('Async: Could not copy text: ', err)
            })
        }
    }
}
</script>

<style scoped>
    .address {
        position: relative;
        width: 100%;
        min-width: 15rem;
        /*white-space: nowrap;*/
        cursor: pointer;
    }
    .address:hover .copy-hover{
        opacity: 1;
    }
    .copied-cover,.copy-hover {
        position: absolute;
        width: 100%;
        /*height: 100%;*/
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        text-align: center;
        border-radius: 0.375rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        left: 50%;
    }
    .copy-hover {
        background: rgba(0, 0, 0, 0.5);
    }
    .address.copied .copied-cover {
        opacity: 1;
    }
</style>