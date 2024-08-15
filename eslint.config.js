import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export default [
    // js
    js.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'off',
            'no-undef': 'off',
        },
    },

    // ts
    ...ts.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // vue
    ...vue.configs['flat/recommended'],
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
            },
        },
    },
    {
        rules: {
            'vue/define-macros-order': [
                'error',
                {
                    order: ['defineOptions', 'defineModel', 'defineProps', 'defineEmits', 'defineSlots'],
                    defineExposeLast: true,
                },
            ],
            'vue/no-multiple-objects-in-class': 'warn',
            'vue/no-root-v-if': 'error',
            'vue/no-undef-components': 'off', // off because of Oruga
            'vue/no-undef-properties': 'warn',
            'vue/no-unused-refs': 'warn',
            'vue/no-useless-mustaches': 'warn',
            'vue/no-useless-v-bind': 'warn',
            'vue/padding-line-between-blocks': 'warn',
            'vue/require-macro-variable-name': 'error',
            'vue/require-typed-ref': 'warn',
        },
    },
];