import fs from "fs";

export function tokenCons(s) {
	s=s.trim();
	let pos=s.indexOf(" ");
	if (pos<0)
		return [s,""];

	return [s.substr(0,pos).trim(),s.substr(pos).trim()];
	
}

export function stripFlags(s, flags) {
	let resFlags=[];

	for (let done=false; !done;) {
		let [head,tail]=tokenCons(s);
		if (flags.includes(head)) {
			resFlags.push(head);
			s=tail;
		}

		else
			done=true;
	}

	return [resFlags,s];
}

function tokenHead(s) {
	return tokenCons(s)[0];
}

function tokenTail(s) {
	return tokenCons(s)[1];
}

function trimChars(s, chars=" ") {
	while (chars.includes(s[0]))
		s=s.substr(1);

	while (chars.includes(s[s.length-1]))
		s=s.substr(0,s.length-2);

	return s;
}

function appendParagraph(s, t) {
	if (s)
		return s+" "+t;

	return t;
}

export function parseBlock(text) {
	let block={
		summary: "",
		description: "",
		tags: {},
		params: []
	};

	let paramNum=-1;
	let doingDescription=false;

	let namingTags=["function","class","section","component","module"];
	let flags=["optional","static","async"];

	let lines=text.split(/\n/).map(s=>trimChars(s," \t/*"));
	for (let line of lines) {
		if (tokenHead(line).startsWith("@")) {
			let [tag,tail]=tokenCons(line);
			tag=trimChars(tag,"@");
			switch (tag) {
				case "param":
					let f;
					[f,tail]=stripFlags(tail,flags);
					let [declaration,description]=tokenCons(tail);
					let [name,type]=declaration.split(":");
					paramNum=block.params.length;
					block.params.push({
						flags: f,
						name: name,
						type: type,
						description: description
					});
					break;

				default:
					block.tags[tag]=tail;
					if (namingTags.includes(tag)) {
						block.type=tag;
						[block.flags,tail]=stripFlags(tail,flags);

						let parts=tail.split(".");
						if (parts.length==2) {
							block.name=parts[1].trim();
							block.parent=parts[0].trim();
						}

						else if (parts.length==1) {
							block.name=parts[0].trim();
						}

						else {
							throw new Error("Unknown: "+tail);
						}
					}
					break;
			}
		}

		else if (line.trim()) {
			line=line.trim();

			if (paramNum>=0)
				block.params[paramNum].description+=" "+line;

			else if (doingDescription)
				block.description=appendParagraph(block.description,line);

			else
				block.summary=appendParagraph(block.summary,line);
		}

		else if (block.summary && paramNum<0) {
			doingDescription=true;
		}
	}

	if (!block.name)
		throw new Error("No block name "+text);

	return block;
}

export function readBlocksFromFile(fn) {
	let s=fs.readFileSync(fn,"utf8");
	let matches=Array.from(s.matchAll(/^[ \t]*(\/\*\*.*?\*\/)/gsm));
	let blocks=[];
	for (let match of matches) {
		try {
			blocks.push(parseBlock(match[1]));
		}

		catch (e) {
			throw new Error("While parsing: "+fn+": "+e.message);
		}
	}

	return blocks;
}

