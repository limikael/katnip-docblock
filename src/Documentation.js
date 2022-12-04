import {Model, convertToSlug} from "katnip";
import {readBlocksFromFile} from "./docblock-util.js";
import glob from "glob";
import download from "download";
import os from "os";
import fs from "fs";
import path from "path";

function createTmpDir() {
	return new Promise((resolve, reject)=>{
		let tmpDir=os.tmpdir();
		fs.mkdtemp(`${tmpDir}${path.sep}`, (err, folder) => {
			if (err)
				reject(err);

			else
				resolve(folder);
		});
	});
}

export default class Documentation extends Model {
	static fields={
		id: "INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY",
		slug: "VARCHAR(255)",
		url: "TEXT",
		files: "TEXT",
		blocks: "JSON"
	};

	async build() {
		let tmpDir;
		let u=new URL(this.url);

		switch (u.protocol) {
			case "file:":
				tmpDir=u.pathname;
				break;

			case "http:":
			case "https:":
				tmpDir=await createTmpDir();
				console.log("downloading to: "+tmpDir);
				await download(this.url,tmpDir,{extract: true});
				break;

			default:
				throw new Error("Unsupported protocol: "+u.protocol);
		}

		let files=glob.sync(tmpDir+"/"+this.files);

		this.blocks=[];
		for (let file of files)
			this.blocks=[...this.blocks,...readBlocksFromFile(file)];

		for (let block of this.blocks) {
			block.slug=convertToSlug(block.name);
			if (block.parent)
				block.parentSlug=convertToSlug(block.parent);
		}
	}
}