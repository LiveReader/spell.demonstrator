module.exports = {
	env: {
		node: true,
	},
	extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
	rules: {
		"no-unused-vars": "off",
		"vue/no-unused-vars": "off",
		"vue/multi-word-component-names": "off",
		"vue/no-mutating-props": "off",
	},
};
