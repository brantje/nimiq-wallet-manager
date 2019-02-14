<template>
    <div class="nq-card">

        <template v-if="messageHasTitle">
            <div class="nq-card-header">
                <h6 v-if="options.html" class="dg-title" v-html="messageTitle"></h6>
                <h6 v-else="" class="dg-title">{{ messageTitle }}</h6>
            </div>
        </template>

        <div class="nq-card-body">
            <div v-if="options.html" class="dg-content" v-html="messageBody"></div>
            <div v-else="" class="dg-content">{{ messageBody }}</div>

            <form v-if="isHardConfirm || isPrompt"
                  class="dg-form"
                  autocomplete="off"
                  @submit.prevent="submitDialogForm"
            >
                <label for="dg-input-elem" style="font-size: 13px">{{ hardConfirmHelpText }}</label>
                <input type="text"
                       :placeholder="options.verification"
                       v-model="input"
                       autocomplete="off"
                       id="dg-input-elem"
                       ref="inputElem"
                       style="width: 100%;margin-top: 10px;
                            padding: 5px 15px; font-size: 16px;
                            border-radius: 4px; border: 2px solid #eee"
                />
            </form>
        </div>


        <div class="nq-card-footer">

            <button @click="clickLeftBtn()" :is="leftBtnComponent" :loading="loading"
                    :enabled="leftBtnEnabled" :options="options" :focus="leftBtnFocus">
                <span v-if="options.html" v-html="leftBtnText"></span>
                <span v-else="">{{ leftBtnText }}</span>
            </button>

            <button :is="rightBtnComponent" @click="clickRightBtn()" :loading="loading"
                    :enabled="rightBtnEnabled" :options="options" :focus="rightBtnFocus">
                <span v-if="options.html" v-html="rightBtnText"></span>
                <span v-else="">{{ rightBtnText }}</span>
            </button>

            <div class="dg-clear"></div>
        </div>
    </div>
</template>

<script>
    import DialogMixin from 'vuejs-dialog/dist/vuejs-dialog-mixin.min.js'
    import OkBtn from './Ok-btn.vue'
    import CancelBtn from './Cancel-btn.vue'

    export default {
        data: function () {
            return {};
        },
        mixins: [DialogMixin],
        mounted() {
            this.isHardConfirm && this.$refs.inputElem && this.$refs.inputElem.focus();
        },
        components: {CancelBtn, OkBtn}
    };
</script>