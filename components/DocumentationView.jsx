import {useApiFetch, bsLoader, setTemplateContext} from "katnip"; 

function DocBlock({block, hideTitle}) {
	return <>
		{!hideTitle &&
			<h2 class="border-bottom border-black">{block.name}</h2>
		}
		<p>{block.summary}</p>
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
		<p class="mb-5">{block.description}</p>
	</>
}

export default function DocumentationView({request}) {
	let doc=useApiFetch("/api/getDocumentation",{
		slugOrId: request.pathargs[1],
		parent: request.pathargs[2]
	},[request.pathargs]);

	if (doc && doc.parentBlock)
		setTemplateContext("title",doc.parentBlock.name);

	return bsLoader(doc,()=><>
		{doc.parentBlock &&
			<DocBlock block={doc.parentBlock} hideTitle={true}/>
		}
		{doc.childBlocks.map((block)=><DocBlock block={block}/>)}
	</>);
}