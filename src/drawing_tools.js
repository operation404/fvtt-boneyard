export { Drawing_Tools };

class Drawing_Tools extends Application {
	
	// Two tools: Stroke Color & Fill Color
	
	static init() {
		Drawing_Tools.prepare_hook_handlers();
		console.log(`====== Boneyard ======\n - Drawing tools initialized`);
	}
	
	static prepare_hook_handlers() {
        Hooks.on("getSceneControlButtons", (controls) => Drawing_Tools.add_control_buttons(controls));
    }
	
	static add_control_buttons(controls) {
		const drawing_controls = controls.find(control_set => control_set.name === "drawings");
		
		drawing_controls.tools.push({
			"name": "set-stroke-color",
			"icon": "fas fa-paint-brush",
			"title": "CONTROLS.DrawingStrokeColor",
			"onClick": () => {
				Drawing_Tools.render_color_selector('stroke');
			},
			button: true,
		});
		
		drawing_controls.tools.push({
			"name": "set-fill-color",
			"icon": "fas fa-fill-drip",
			"title": "CONTROLS.DrawingFillColor",
			"onClick": () => {
				Drawing_Tools.render_color_selector('fill');
			},
			button: true,
		});
	}
	
	
	// color_type: either 'stroke' or 'fill'
	static async render_color_selector(color_type) {
		const drawing_defaults = game.settings.get("core", DrawingsLayer.DEFAULT_CONFIG_SETTING);
		if (drawing_defaults === undefined) return;
		console.log(drawing_defaults);
		console.log(this);
		console.log(document);
		console.log(window);
		
		const template_data = {
			color_key: `${color_type}Color`,
			color: drawing_defaults[`${color_type}Color`]
		};
		
		const template = `modules/boneyard/templates/color_selector.html`;
		const html = await renderTemplate(template, template_data);

		const node = document.createElement("div");
		node.setAttribute("id", "color_selector");
		node.setAttribute("class", "color_selector");
		node.innerHTML = html;

		document.body.appendChild(node);

	}
	
	function _injectHTML(html) {
		$('body').append(html);
		this._element = html;
	}
	
	async _render(force = false, options = {}) {
		if (!game.ready) return;
		await super._render(force, options);
		
		console.log(this);
		console.log(this.element);
		
	}
	
}

