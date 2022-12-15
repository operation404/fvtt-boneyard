export {
    Drawing_Tools
};

class Drawing_Tools extends Application {

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
            "name": "set-strokeColor",
            "icon": "fas fa-paint-brush",
            "title": "CONTROLS.DrawingStrokeColor",
            "onClick": () => {
                new Drawing_Tools('strokeColor').render(true);
            },
            button: true,
        });
        drawing_controls.tools.push({
            "name": "set-fillColor",
            "icon": "fas fa-fill-drip",
            "title": "CONTROLS.DrawingFillColor",
            "onClick": () => {
                new Drawing_Tools('fillColor').render(true);
            },
            button: true,
        });
    }


    /**
     * The Drawing_Tools Application window.
     * @param {string} [color_type]           Which tool color to modify, 'strokeColor' or 'fillColor'
     * @param {ApplicationOptions} [options]  Default Application configuration options.
     */
    constructor(color_type = null, options = {}) {
        super(options);
        this.color_type = color_type;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `modules/boneyard/templates/color_selector.html`,
            id: 'drawing_tools',
            popOut: false,
        });
    }

    getData() {
        return { // Send data to the html template
            appId: this.appId,
        };
    }

    async _renderInner(data) {
        return super._renderInner(data);;
    }


    async _render(force = false, options = {}) {
        await super._render(force, options);

        const controls_container = document.querySelector('#ui-left > #controls');
        const controls_container_style = window.getComputedStyle(controls_container);
        const sub_controls = document.querySelector('#controls > ol.sub-controls.app.control-tools.flexcol.active');
        const control = sub_controls.firstElementChild;
        const control_style = window.getComputedStyle(control);

        // offsetHeight includes padding+border but not margin
        const control_height = control.offsetHeight + parseFloat(control_style.marginTop) + parseFloat(control_style.marginBottom);
        const control_width = control.offsetWidth + parseFloat(control_style.marginLeft) + parseFloat(control_style.marginRight);
        const max_controls_per_col = Math.floor(sub_controls.offsetHeight / control_height);
        // There's always 1 main control column + potentially multiple sub-control columns
        const columns = 1 + Math.ceil(sub_controls.childElementCount / max_controls_per_col);

        const offset_left = (columns * control_width) + parseFloat(controls_container_style.paddingLeft);

        // the drawing sub-controls should be the active set, so just query that
        const drawing_tool = sub_controls.querySelector(`[data-tool='set-${this.color_type}']`);
        const drawing_tool_rect = drawing_tool.getBoundingClientRect();
        const drawing_tool_y_center = drawing_tool_rect.top + (drawing_tool_rect.height / 2); // not sure if .top or .y is better
		
        const offset_top = drawing_tool_y_center - (this._element[0].offsetHeight / 2);

		this._element[0].style.left = `${offset_left}px`;
		this._element[0].style.top = `${offset_top}px`;
    }


    activateListeners(html) {
        super.activateListeners(html);
    }

    _injectHTML(html) {
        $('body').append(html);
        this._element = html;
		//console.log(this._element);
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

        /*
        const template = `modules/boneyard/templates/color_selector.html`;
        const html = await renderTemplate(template, template_data);

        const node = document.createElement("div");
        node.setAttribute("id", "color_selector");
        node.setAttribute("class", "color_selector");
        node.innerHTML = html;

        document.body.appendChild(node);
        */
    }

}