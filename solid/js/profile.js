var store = new $rdf.graph();
var fetcher = $rdf.fetcher(store);

function getNameSpace(element, namespace) {
	if (!element) {
		return getNameSpace(document.getElementById("solid-body"), namespace);
	}
	if (element.hasAttribute("xmlns:" + namespace)) {
		return element.getAttribute("xmlns:" + namespace);
	}
	if (element != document.getElementById("solid-body")) {
		return getNameSpace(element.parentnode, namespace);
	}
};

editor.transformers = {
	rdf : {
		render : function(data) {
			this.simplyValue = data;

			var namespace;
			var property;
			var predicate = namespace;
			var attributes;

			if (this.hasAttribute("property")) {
				attributes = this.getAttribute("property").split(":");
			} else if (this.hasAttribute("rel")) {
				attributes = this.getAttribute("rel").split(":");
			} else if (this.hasAttribute("data-simply-rdf")) {
				attributes = this.getAttribute("data-simply-rdf").split(":");
			}
			if (attributes.length > 1) {
				namespace = attributes[0];
				property = attributes[1];

				namespace = getNameSpace(this, namespace);
				predicate = namespace + property;
			}

			if (data.indexOf("_") === 0) {
				me = store.index[0]['_:' + data][0].subject; // blank node
			} else {
				me = store.sym(data);
			} 

			predicate = store.sym(predicate);

			if (this.getAttribute("data-simply-list")) {
				return store.each(me, predicate).map(function(entry) {
					return {
						value : entry.value,
						fieldValue : entry.value
					};
				});
			} else if (this.getAttribute("data-simply-field") && (this.tagName.toLowerCase() == "input")) {
				var object = this.value;
				attributes = this.value.split(":");
				if (attributes.length > 1) {
					namespace = attributes[0];
					property = attributes[1];

					namespace = getNameSpace(this, namespace);
					object = namespace + property;

					var object = store.sym(object);
					var result = store.each(me, predicate, object);
					if (result.length) {
						return this.value;
					}
				} else {
					var result = store.any(me, predicate);
					if (result) {
						return result.value;
					}
					return '';
				}
			} else {
				var result = store.any(me, predicate);
				if (result) {
					return result.value;
				}
				return '';
			}
		},
		extract : function(data) {
			if (this.getAttribute("data-simply-list")) {
				return data;
			}
			return this.simplyValue;
		}
	}
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
  });
}

browser = simply.app({
	commands : {
		browse : function(el) {
			editor.pageData.subject = el.href;
			updateDataSource("profile");
			editor.pageData.turtle = ""; // force update
		},
		turtleLog : function(el) {
			document.querySelectorAll("[property][data-simply-list] > :not([about])").forEach(function(item) {
				var base = editor.pageData.subject.split("#");
					base[1] = "id-" + uuidv4();

				item.setAttribute("about", base.join("#"));
			});

			var subjects = document.querySelectorAll("[about]");
			var turtles = [];
			subjects.forEach(function(element) {
				var clone = element.cloneNode(true);

				var subItems = clone.querySelectorAll("[about]");
				subItems.forEach(function (item) {
					parentItem = item.parentNode;
					item.innerHTML = item.getAttribute("about");
					item.setAttribute("href", item.getAttribute("about"));
					item.removeAttribute("about");
					item.setAttribute("rel", item.parentNode.getAttribute("property"));
				});

				clone.querySelectorAll("[property][data-simply-list]").forEach(function(list) {
					list.removeAttribute("property");
				});

				// remove self closing tags to work around an issue with rdflib.js
				clone.querySelectorAll("br").forEach(function(element) {
					element.parentNode.removeChild(element);
				});

				// replace inputs with values;
				clone.querySelectorAll("input[type=checkbox]").forEach(function(input) {
					if (input.hasAttribute("rel") && input.checked) {
						var element = document.createElement("span");
						element.setAttribute("rel", input.getAttribute("rel"));
						element.setAttribute("href", input.value);
						input.parentNode.insertBefore(element, input);
					}
					input.parentNode.removeChild(input);
				});

				// replace inputs with values;
				clone.querySelectorAll("input[type=text],input:not([type])").forEach(function(input) {
					if (input.hasAttribute("rel") && input.value) {
						var element = document.createElement("span");
						element.setAttribute("rel", input.getAttribute("rel"));
						element.setAttribute("href", input.value);
						input.parentNode.insertBefore(element, input);
					} else if (input.hasAttribute("property") && input.value) {
						var element = document.createElement("span");
						element.setAttribute("property", input.getAttribute("property"));
						element.innerHTML = input.value;
						input.parentNode.insertBefore(element, input);
					}
					input.parentNode.removeChild(input);
				});

				var partStore = $rdf.graph();
				var baseUrl = element.getAttribute("about");
				var contentType = "text/html"; $rdf.parse(clone.outerHTML, partStore, baseUrl, contentType);

				partStore.statements.forEach(function(statement) {
					if (statement.subject.termType == "BlankNode") {
						return; // FIXME: handle blank nodes
					}

					var subject = store.sym(statement.subject.value);
					var predicate = statement.predicate.value;
					var attributes = predicate.split(":");
					if (attributes.length > 1) {
						var namespace = attributes[0];
						var property = attributes[1];
						console.log(partStore.namespaces);
						var namespace = getNameSpace(document.getElementById("solid-body"), namespace);
						predicate = namespace + property;
					}
					predicate = store.sym(predicate);
					var previousValue = store.each(subject, predicate);
					if (previousValue.length == 1) {
						previousValue = previousValue[0];
						if (previousValue.value != statement.object.value) {
							console.log("DELETE DATA {<" + statement.subject.value + "> <" + statement.predicate.value + "> " + previousValue.value);
							console.log("INSERT DATA {<" + statement.subject.value + "> <" + statement.predicate.value + "> " + statement.object.value);
						}
					} else {
						// fixme: handle case where multiple values exist
					}
				});

				turtles.push(partStore.toString().slice(1, -1));
			});

			// turtles.push(store.toString());

			editor.pageData.turtle = "{" + turtles.join("\n\n") + "}";
			console.log(editor.pageData.turtle);
		}
	}
});

function updateDataSource(name) {
	document.querySelectorAll('[data-simply-data="'+name+'"]').forEach(function(list) {
		list.innerHTML = '';
		editor.list.applyDataSource(list, name);
	});
};

editor.addDataSource("profile", {
	load : function(el, callback) {
		var me = store.sym(editor.pageData.subject);
		el.setAttribute("about", editor.pageData.subject);

		var profile = me.doc();
		fetcher.load(profile).then(function() {
			callback([editor.pageData]);
		});
	}
});
