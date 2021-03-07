<template>
    <client-only>
        <div class="page">
            <global />
            <div class="search">
                <container-ripe class="search-container">
                    <image-ripe class="search-image" v-bind:src="'logo-base.png'" />
                    <form-input
                        class="search-input"
                        v-bind:header="'Procurar por URL'"
                        v-bind:footer="error || ' '"
                        v-bind:footer-variant="'error'"
                    >
                        <search
                            v-bind:placeholder="
                                'http://www.base.gov.pt/Base/pt/Pesquisa/Contrato?a=6436788'
                            "
                            v-bind:autofocus="true"
                            v-bind:value.sync="input"
                            v-bind:height="40"
                            v-bind:loading="checkingUrl"
                        />
                    </form-input>
                    <div class="replace-container">
                        <form-input
                            class="input-replace input-replace-original"
                            v-bind:header="'Texto original'"
                        >
                            <textarea-ripe v-bind:value.sync="inputOriginal" v-bind:resize="true" />
                        </form-input>
                        <form-input
                            class="input-replace input-replace-target"
                            v-bind:header="'Texto corrigido'"
                        >
                            <textarea-ripe
                                v-bind:value="inputTarget"
                                v-bind:disabled="true"
                                v-bind:resize="true"
                            />
                        </form-input>
                    </div>
                </container-ripe>
            </div>
        </div>
    </client-only>
</template>

<style lang="scss" scoped>
@import "css/component.scss";

.page {
    background-color: $background-color;
    box-sizing: border-box;
    font-family: $font-family;
    height: 100%;
    min-height: 100vh;
    padding: 0px;
}

body.tablet .page,
body.mobile .page {
    background-color: $background-color;
}

.search {
    max-width: 100%;
    padding: 60px 50px 0px 50px;
    text-align: center;
}

body.tablet .search,
body.mobile .search {
    margin-bottom: 32px;
    padding: 20px 10px 0px 10px;
}

.search > .search-container {
    padding: 30px 20px 10px 20px;
}

.search > .search-container > .search-image {
    max-width: 100%;
}

.search > .search-container > .search-input {
    margin-top: 20px;
}

.search > .search-container > .search-input .search {
    padding: 0px 0px 0px 0px;
}

.search > .search-container > .search-input ::v-deep label {
    min-height: 13px;
}

.search > .search-container > .replace-container {
    display: flex;
    margin-top: 30px;
}

.search > .search-container > .replace-container > .input-replace {
    flex: 1;
}

.search > .search-container > .replace-container > .input-replace:last-child {
    margin-left: 20px;
}
</style>

<script>
import { verify } from "yonius";

import { PAGE_MIXINS } from "./common";

export const Index = {
    name: "index",
    mixins: [...PAGE_MIXINS],
    props: {
        delay: {
            type: Number,
            default: 500
        }
    },
    data: function() {
        return {
            checkingUrl: false,
            urlExists: null,
            input: null,
            inputOriginal: null
        };
    },
    computed: {
        inputMatch() {
            if (!this.input) return null;
            const match = this.input.match(
                /^http:\/\/www.base.gov.pt\/Base\/pt\/Pesquisa\/(?<type>[a-zA-Z]+)\?a=(?<id>[0-9]+)$/
            );
            if (!match) return null;
            return match.groups;
        },
        inputId() {
            if (!this.inputMatch) return null;
            return this.inputMatch.id;
        },
        inputType() {
            if (!this.inputMatch) return null;
            return this.inputMatch.type.toLowerCase();
        },
        params() {
            if (!this.inputId || !this.inputType) return null;
            return {
                id: this.inputId,
                type: this.inputType
            };
        },
        error() {
            if (!this.input) return null;
            if (!this.inputMatch) return "O formato do URL não é válido";
            if (this.urlExists === false)
                { return `O documento com o tipo '${this.inputType}' e ID '${this.inputId}' não existe`; }
            return null;
        },
        inputTarget() {
            if (!this.inputOriginal) return null;
            return this.inputOriginal.replace(
                /\bhttp:\/\/www.base.gov.pt\/Base\/pt\/Pesquisa\/(?<type>[a-zA-Z]+)\?a=(?<id>[0-9]+)\b/gi,
                (math, type, id) =>
                    `https://www.base.gov.pt/Base4/pt/detalhe/?type=${type.toLowerCase()}s&id=${id}`
            );
        }
    },
    watch: {
        input(value) {
            this.urlExists = null;
        },
        params(value) {
            if (!value) return;
            setTimeout(() => this.checkAndOpen(value.id, value.type), this.delay);
        }
    },
    methods: {
        async checkAndOpen(id, type) {
            this.checkingUrl = true;
            try {
                const params = new URLSearchParams({ id: id, type: type });
                const result = await fetch(`/api/entities?${params.toString()}`);

                verify(result.ok);
                const json = await result.json();

                this.urlExists = true;
                window.open(json.originalUrl);
            } catch (err) {
                this.urlExists = false;
            } finally {
                this.checkingUrl = false;
            }
        }
    }
};

export default Index;
</script>
