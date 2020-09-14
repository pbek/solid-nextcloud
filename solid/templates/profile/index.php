<?php
	script("solid", "rdflib.min");
	script("solid", "simply-edit");
	script("solid", "simply.everything");
	script("solid", "profile");
?>
<div class="app-content-details" id="solid-body"
	xmlns:vcard="http://www.w3.org/2006/vcard/ns#"
	xmlns:foaf="http://xmlns.com/foaf/0.1/"
	xmlns:solid="http://www.w3.org/ns/solid/terms#"
	xmlns:acl="http://www.w3.org/ns/auth/acl#"
>
	<h1>Your Solid profile</h1>
	<p>URI: <span data-simply-field="subject"><?php p($_['profileUri']); ?></span></p>
	<!-- p>URI: <span data-simply-field="subject">https://ylebre.solid.community/profile/card#me</span></p -->
	<!-- p><a href="#simply-edit">Edit me</a></p -->
	<div data-simply-list="data" data-simply-data="profile">
		<template>
			<div>
				<label>Name: <input property="foaf:name" data-simply-field="subject" data-simply-transformer="rdf"></label><br>
				<!-- label>Note: <input property="vcard:note" data-simply-field="subject" data-simply-transformer="rdf"></label><br>
				<label>vcard name: <input property="vcard:fn" data-simply-field="subject" data-simply-transformer="rdf"></label><br>
				<label>Role: <input property="vcard:role" data-simply-field="subject" data-simply-transformer="rdf"></label><br>
				<p>Addresses:</p>
				<ul property="vcard:hasAddress" data-simply-list="subject" data-simply-transformer="rdf">
					<template data-simply-template="default">
						<li data-simply-field="value" data-simply-content="attributes" data-simply-attributes="about">
							<table>
								<tr><td>Street</td><td><input property="vcard:street-address" data-simply-field="value" data-simply-transformer="rdf"></td></tr>
								<tr><td>Locality</td><td><input property="vcard:locality" data-simply-field="value" data-simply-transformer="rdf"></td></tr>
							</table>
						</li>
					</template>
				</ul -->
				<p>Trusted apps:</p>
				<ul data-simply-rdf="acl:trustedApp" data-simply-list="subject" data-simply-transformer="rdf">
					<template data-simply-template="default">
						<li rel="acl:trustedApp">
							<label><input data-simply-field="fieldValue" data-simply-transformer="rdf" type="text" rel="acl:origin" href="https://example.com"></label>
							<label><input data-simply-field="fieldValue" data-simply-transformer="rdf" type="checkbox" rel="acl:mode" value="acl:Read"> Read</label>
							<label><input data-simply-field="fieldValue" data-simply-transformer="rdf" type="checkbox" rel="acl:mode" value="acl:Write"> Write</label>
							<label><input data-simply-field="fieldValue" data-simply-transformer="rdf" type="checkbox" rel="acl:mode" value="acl:Append"> Append</label>
							<label><input data-simply-field="fieldValue" data-simply-transformer="rdf" type="checkbox" rel="acl:mode" value="acl:Control"> Control</label>
						</li>
					</template>
					<template data-simply-template="new">
						<li rel="acl:trustedApp">
							<label>Origin: <input rel="acl:origin" type="text"></label>
							<label><input type="checkbox" rel="acl:mode" value="acl:Read"> Read</label>
							<label><input type="checkbox" rel="acl:mode" value="acl:Write"> Write</label>
							<label><input type="checkbox" rel="acl:mode" value="acl:Append"> Append</label>
							<label><input type="checkbox" rel="acl:mode" value="acl:Control"> Control</label>
						</li>
					</template>
				</ul>
				<!-- p>privateTypeIndex: <a rel="solid:privateTypeIndex" data-simply-field="subject" data-simply-transformer="rdf" data-simply-content="attributes" data-simply-attributes="href"></span></p>
						<span rel="solid:privateTypeIndex" data-simply-field="subject" data-simply-transformer="rdf"></span>
					</a>
				</p -->
			</div>
		</template>
	</div>
	<p><a href="#" data-simply-command="turtleLog">Log as turtle</a></p>
	<textarea data-simply-field="turtle"></textarea>
</div>