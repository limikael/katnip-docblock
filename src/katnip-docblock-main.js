import {katnip} from "katnip";
import Documentation from "./Documentation.js";

katnip.addModel(Documentation);
katnip.createCrudApi(Documentation,{
	onsave: async (documentation)=>{
		await documentation.build();
	}
});

katnip.addApi("/api/getDocumentation",async ({slugOrId, parent},req)=>{
	let doc=await Documentation.findOne({
		$op: "or",
		id: slugOrId,
		slug: slugOrId
	});

	if (!doc)
		throw new Error("NOT FOUND");

//	console.log(doc);

	doc.childBlocks=doc.blocks.filter((block)=>block.parentSlug==parent);
	doc.parentBlock=doc.blocks.filter((block)=>block.slug==parent)[0];

	return doc;
});