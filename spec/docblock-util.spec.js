import {parseBlock} from "../src/docblock-util.js";

describe("docblock-util",()=>{
	it("can parse",()=>{
		let block=parseBlock(`
			/**
			 * This is a docblock for a function.
			 * spanning two lines.
			 *
			 * This is the description
			 * on two lines.
			 *
			 * @function global.hello
			 * @param i:Number Some description for i
			 * @param s:String Some description for s
			 *                 spanning 2 lines.
			 * /
		`);

		expect(block).toEqual({
			summary: 'This is a docblock for a function. spanning two lines.',
			description: 'This is the description on two lines.',
			type: "function",
			name: "hello",
			parent: "global",
			tags: { function: 'global.hello' },
			params: [{
				name: 'i',
				type: 'Number',
				description: 'Some description for i'
			},{
				name: 's',
				type: 'String',
				description: 'Some description for s spanning 2 lines.'
			}]
		});
	})
})