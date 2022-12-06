import {parseBlock, tokenCons, stripFlags} from "../src/docblock-util.js";

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
			flags: [],
			params: [{
				flags: [],
				name: 'i',
				type: 'Number',
				description: 'Some description for i'
			},{
				flags: [],
				name: 's',
				type: 'String',
				description: 'Some description for s spanning 2 lines.'
			}]
		});
	});

	it("can parse",()=>{
		let [flags,tail]=stripFlags("    optional  async   hello world",["optional","async"]);
		expect(flags).toEqual(["optional","async"]);
		expect(tail).toEqual("hello world");

		let block=parseBlock(`
			/**
			 * Refresh this item with current data from the database.
			 *
			 * Refresh this item with current data from the database.
			 *
			 * @function async static Javascript functions.refresh
			 * @param optional i:integer hello
			 */
		`);

		//console.log(JSON.stringify(block,null,2));
	})
})