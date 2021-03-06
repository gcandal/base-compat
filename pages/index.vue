<template>
    <client-only>
        <div class="page">
            <global />
            <div class="search">
                <container-ripe class="search-container">
                    <image-ripe class="search-image" v-bind:src="'logo-base.png'" />
                    <form-input
                        class="search-input"
                        v-bind:footer="error || ' '"
                        v-bind:footer-variant="'error'"
                    >
                        <input-ripe
                            v-bind:placeholder="
                                'http://www.base.gov.pt/Base/pt/Pesquisa/Contrato?a=6436788'
                            "
                            v-bind:autofocus="true"
                            v-bind:value.sync="input"
                            v-bind:height="40"
                            v-bind:font-weight="600"
                        />
                    </form-input>
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

body.mobile .search > .search-container > .search-input .input {
    border-radius: 8px 8px 8px 8px;
    box-shadow: 0px 6px 15px rgb(36 37 38 / 8%);
    margin: 32px auto 32px auto;
}

.search > .search-container > .search-input .input:focus {
    border-color: transparent;
    box-shadow: 0px 1px 8px 0px rgba(32, 33, 36, 0.18);
}

.search > .search-container > .search-input ::v-deep label {
    min-height: 13px;
}
</style>

<script>
import { PAGE_MIXINS } from "./common";

export const Index = {
    name: "index",
    mixins: [...PAGE_MIXINS],
    data: function() {
        return {
            input: null
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
        inputTypeNew() {
            if (!this.inputMatch) return null;
            return `${this.inputMatch.type.toLowerCase()}s`;
        },
        urlNew() {
            if (!this.inputId || !this.inputTypeNew) return null;
            return `https://www.base.gov.pt/Base4/pt/detalhe/?type=${this.inputId}&id=${this.inputTypeNew}`;
        },
        error() {
            if (!this.input) return null;
            if (this.inputMatch) return null;
            return "O URL não é válido";
        }
    },
    watch: {
        urlNew(value) {
            if (!value) return;
            window.open(value);
        }
    }
};

export default Index;
</script>
