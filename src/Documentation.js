import {Model, convertToSlug} from "katnip";
import {readBlocksFromFile} from "./docblock-util.js";
import glob from "glob";

export default class Documentation extends Model {
	static fields={
		id: "INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY",
		slug: "VARCHAR(255)",
		url: "TEXT",
		files: "TEXT",
		blocks: "JSON"
	};

	async build() {
		let files=glob.sync(this.url+"/"+this.files);

		this.blocks=[];
		for (let file of files)
			this.blocks=[...this.blocks,...readBlocksFromFile(file)];

		for (let block of this.blocks) {
			block.slug=convertToSlug(block.name);
			if (block.parent)
				block.parentSlug=convertToSlug(block.parent);
		}

		/*for (let block of this.blocks) {
			block.slug=convertToSlug(block.name);
			block.children=this.blocks.filter((child)=>child.parent==block.name);
		}

		this.blocks=this.blocks.filter((block)=>!block.parent);*/
	}
}