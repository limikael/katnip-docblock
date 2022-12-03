import {katnip} from "katnip";
import FILE_EARMARK_TEXT from "bootstrap-icons/icons/file-earmark-text.svg";
import DocumentationView from "../components/DocumentationView.jsx";

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
	priority: 30,
	icon: FILE_EARMARK_TEXT
});

katnip.addRoute("/documentation/**",DocumentationView);
