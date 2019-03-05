<template>
    <div class="nq-card">
        <template v-if="messageHasTitle">
            <div class="nq-card-header">
                <h6 class="dg-title">
                    {{ messageTitle }}
                </h6>
            </div>
        </template>

        <div class="nq-card-body">
            <div class="dg-content">
                {{ messageBody }}
            </div>

            <form v-if="isHardConfirm || isPrompt"
                  class="dg-form"
                  autocomplete="off"
                  @submit.prevent="submitDialogForm"
            >
                <label for="dg-input-elem" style="font-size: 13px">{{ hardConfirmHelpText }}</label>
                <input id="dg-input-elem"
                       ref="inputElem"
                       v-model="input"
                       type="text"
                       :placeholder="options.verification"
                       autocomplete="off"
                       style="width: 100%;margin-top: 10px;
                            padding: 5px 15px; font-size: 16px;
                            border-radius: 4px; border: 2px solid #eee"
                >
            </form>
        </div>


        <div class="nq-card-footer">
            <button :is="leftBtnComponent" :loading="loading" :enabled="leftBtnEnabled"
                    :options="options" :focus="leftBtnFocus" @click="clickLeftBtn()"
            >
                <span>{{ leftBtnText }}</span>
            </button>

            <button :is="rightBtnComponent" :loading="loading" :enabled="rightBtnEnabled"
                    :options="options" :focus="rightBtnFocus" @click="clickRightBtn()"
            >
                <span>{{ rightBtnText }}</span>
            </button>

            <div class="dg-clear" />
        </div>
    </div>
</template>

<script>
import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
import OkBtn from './Ok-btn.vue'
import CancelBtn from './Cancel-btn.vue'

export default {
    components: {CancelBtn, OkBtn},
    mixins: [DialogMixin],
    data: function () {
        return {}
    },
    mounted() {
        this.isHardConfirm && this.$refs.inputElem && this.$refs.inputElem.focus()
    }
}
</script>