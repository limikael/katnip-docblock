import {katnip} from "katnip";
import FILE_EARMARK_TEXT from "bootstrap-icons/icons/file-earmark-text.svg";
import DocumentationView from "../components/DocumentationView.jsx";

console.log(katnip);
console.log(katnip.createCrudUi);

katnip.createCrudUi("documentation",{
	columns: {
		url: {label: "Url"},
		slug: {label: "Slug"},
	},
	fields: {
		url: {label: "Url"},
		slug: {label: "Slug"},
		files: {label: "Files", type: "textarea"}
	},
	priority: 40,
	icon: FILE_EARMARK_TEXT
});

katnip.addRoute("/documentation/**",DocumentationView);
