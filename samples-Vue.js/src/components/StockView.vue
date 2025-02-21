<script>
	import './StockView.css';
	export default {
		props: {
			close: {
				type: String,
				default: '0'
			},
			vars: {
				type: String,
				default: '0'
			},
			gap: {
				type: String,
				default: '0'
			}
		},

		computed: {
			varStyle() {
				if (this.vars > 0) return { background: "url('./assets/ico_up.gif') 0% 50% no-repeat" };
				else if (this.vars < 0) return { background: "url('./assets/ico_down.gif') 0% 50% no-repeat" };
				return { background: 'transparent' };
			}
		}
	};
</script>
<template>
	<div :style="{ color: Number(vars) > 0 ? '#D90400' : Number(vars) < 0 ? '#005DDE' : '#000000' }">
		<div class="my-child1">{{ close }}</div>
		<div class="my-child2" :style="varStyle">{{ vars }}</div>
		<div class="my-child3">{{ gap }}</div>
	</div>
</template>
