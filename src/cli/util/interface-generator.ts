/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-02-08
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { ICmTemplateEngine } from "../../build/templating/cm.template-engine";

function generateInterface(target: any, templateEngine: ICmTemplateEngine) {
	const proto = target.prototype;
	const properties = {};
	const methods = {};
	const propertyNames = Object.getOwnPropertyNames(proto);
	for (const propertyName of propertyNames) {
		if (propertyName !== "constructor") {
			if (typeof proto[propertyName] === "function") {
				methods[propertyName] = proto[propertyName];
			} else {
				properties[propertyName] = typeof proto[propertyName];
			}
		}
	}

	const interfaceTemplate = `
interface <%= name %> {
  <% for (let propertyName in properties) { %>
    <%= propertyName %>: <%= properties[propertyName] %>;
  <% } %>
  <% for (let methodName in methods) { %>
    <%= methodName %>(<%= Object.keys(methods[methodName]).join(', ') %>): <%= methods[methodName].name %>;
  <% } %>
}`;

	const interfaceString = templateEngine.render(interfaceTemplate, {
		name: target.name,
		properties,
		methods
	});
	console.log(interfaceString);
}
