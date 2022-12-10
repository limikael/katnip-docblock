import {useApiFetch, bsLoader, setTemplateContext, A} from "katnip"; 
import {marked} from "marked";

function DocBlock({block, hideTitle, baseUrl}) {
	let htmlBlockDescription=marked.parse(block.description);

	let declaration;
	switch (block.type) {
		case "function":
			declaration=
				block.flags.map(s=>s+" ").join("")+
				"function "+block.name+"("+
				block.params.map(p=>p.name).join(", ")+")";
			break;
	}

	return <>
		{!hideTitle &&
			<h2 class="border-bottom border-black">
				<A href={baseUrl+"/"+block.slug} class="text-reset text-decoration-none">
					{block.name}
				</A>
			</h2>
		}
		<p>{block.summary}</p>
		{declaration &&
			<pre class="bg-light p-3">{declaration}</pre>
		}
		{!!block.params.length &&
			<table class="table table-borderless">
				<tbody>
					{block.params.map((param)=><>
						<tr>
							<th scope="row" class="col-3"><pre class="m-0">{param.name}</pre></th>
							<td>{param.description}</td>
						</tr>
					</>)}
				</tbody>
			</table>
		}
		<div dangerouslySetInnerHTML={{__html: htmlBlockDescription}}/>
		<div class="mb-5"/>
	</>
}

export default function DocumentationView({request}) {
	let doc=useApiFetch("/api/getDocumentation",{
		slugOrId: request.pathargs[1],
		parent: request.pathargs[2]
	},[request.pathargs[1],request.pathargs[2]]);

	if (doc && doc.parentBlock)
		setTemplateContext("title",doc.parentBlock.name);

	let baseUrl="/documentation/"+request.pathargs[1];

	return bsLoader(doc,()=><>
		{doc.parentBlock &&
			<DocBlock block={doc.parentBlock} hideTitle={true} baseUrl={baseUrl}/>
		}
		{doc.childBlocks.map((block)=><DocBlock block={block} baseUrl={baseUrl}/>)}
	</>);
}